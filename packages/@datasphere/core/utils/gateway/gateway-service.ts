/**
 * @fileoverview API Gateway Service
 */

import { EventEmitter } from 'events';
import { Route, Upstream, Target, RequestContext, GatewayMetrics } from './types';
import { LoadBalancer, createLoadBalancer } from './load-balancer';
import { RateLimiter, createRateLimiter } from './rate-limiter';

export class GatewayService extends EventEmitter {
  private static instance: GatewayService;
  private routes = new Map<string, Route>();
  private upstreams = new Map<string, Upstream>();
  private loadBalancer: LoadBalancer;
  private rateLimiter: RateLimiter;
  private metrics: GatewayMetrics;

  private constructor() {
    super();
    this.loadBalancer = createLoadBalancer();
    this.rateLimiter = createRateLimiter();
    this.metrics = {
      totalRequests: 0,
      totalResponses: 0,
      errorRate: 0,
      averageLatency: 0,
      throughput: 0,
      activeConnections: 0,
      upstreamHealth: {}
    };
    
    this.startHealthChecks();
    this.startMetricsCollection();
  }

  static getInstance(): GatewayService {
    if (!GatewayService.instance) {
      GatewayService.instance = new GatewayService();
    }
    return GatewayService.instance;
  }

  addRoute(route: Route): void {
    this.routes.set(route.id, route);
    this.emit('route-added', route);
  }

  removeRoute(routeId: string): void {
    this.routes.delete(routeId);
    this.emit('route-removed', routeId);
  }

  addUpstream(upstream: Upstream): void {
    this.upstreams.set(upstream.id, upstream);
    this.emit('upstream-added', upstream);
  }

  async processRequest(context: RequestContext): Promise<any> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    try {
      // Find matching route
      const route = this.findRoute(context);
      if (!route) {
        return this.createErrorResponse(404, 'Route not found');
      }

      context.route = route;

      // Check rate limiting
      if (route.rateLimit) {
        const allowed = await this.rateLimiter.isAllowed(route.rateLimit, context);
        if (!allowed) {
          return this.createErrorResponse(429, 'Rate limit exceeded');
        }
      }

      // Get upstream
      const upstream = this.upstreams.get(route.upstream);
      if (!upstream) {
        return this.createErrorResponse(502, 'Upstream not found');
      }

      context.upstream = upstream;

      // Select target
      const target = this.loadBalancer.selectTarget(
        upstream.targets,
        upstream.loadBalancer,
        context
      );

      if (!target) {
        return this.createErrorResponse(503, 'No healthy upstream targets');
      }

      // Proxy request
      const response = await this.proxyRequest(context, target, upstream);
      
      // Update metrics
      const duration = Date.now() - startTime;
      this.updateMetrics(duration, response.status < 400);
      
      return response;

    } catch (error) {
      this.emit('request-error', { context, error });
      this.updateMetrics(Date.now() - startTime, false);
      return this.createErrorResponse(500, 'Internal server error');
    }
  }

  private findRoute(context: RequestContext): Route | null {
    for (const route of this.routes.values()) {
      if (!route.enabled) continue;
      
      if (route.methods.includes(context.method) && 
          this.matchPath(route.path, context.path)) {
        return route;
      }
    }
    return null;
  }

  private matchPath(routePath: string, requestPath: string): boolean {
    // Simple path matching - can be enhanced with regex patterns
    if (routePath === requestPath) return true;
    
    // Wildcard matching
    if (routePath.endsWith('*')) {
      const prefix = routePath.slice(0, -1);
      return requestPath.startsWith(prefix);
    }
    
    // Path parameter matching
    const routeParts = routePath.split('/');
    const requestParts = requestPath.split('/');
    
    if (routeParts.length !== requestParts.length) return false;
    
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) continue; // Parameter
      if (routeParts[i] !== requestParts[i]) return false;
    }
    
    return true;
  }

  private async proxyRequest(
    context: RequestContext,
    target: Target,
    upstream: Upstream
  ): Promise<any> {
    this.loadBalancer.incrementConnections(target);
    
    try {
      const url = `http://${target.host}:${target.port}${context.path}`;
      const response = await fetch(url, {
        method: context.method,
        headers: context.headers,
        body: context.body ? JSON.stringify(context.body) : undefined
      });

      const data = await response.json().catch(() => null);
      
      const responseHeaders: { [key: string]: string } = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      return {
        status: response.status,
        headers: responseHeaders,
        body: data
      };

    } finally {
      this.loadBalancer.decrementConnections(target);
    }
  }

  private createErrorResponse(status: number, message: string): any {
    return {
      status,
      headers: { 'Content-Type': 'application/json' },
      body: { error: message, timestamp: new Date().toISOString() }
    };
  }

  private updateMetrics(duration: number, success: boolean): void {
    this.metrics.totalResponses++;
    
    if (!success) {
      this.metrics.errorRate = (this.metrics.errorRate * (this.metrics.totalResponses - 1) + 1) / this.metrics.totalResponses;
    }
    
    this.metrics.averageLatency = (this.metrics.averageLatency * (this.metrics.totalResponses - 1) + duration) / this.metrics.totalResponses;
  }

  private startHealthChecks(): void {
    setInterval(() => {
      for (const upstream of this.upstreams.values()) {
        if (upstream.healthCheck.enabled) {
          this.performHealthCheck(upstream);
        }
      }
    }, 30000); // Every 30 seconds
  }

  private async performHealthCheck(upstream: Upstream): Promise<void> {
    for (const target of upstream.targets) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), upstream.healthCheck.timeout);

      try {
        const url = `http://${target.host}:${target.port}${upstream.healthCheck.path}`;
        const response = await fetch(url, {
          method: 'GET',
          signal: controller.signal
        });
        
        const wasHealthy = target.healthy;
        target.healthy = response.ok;
        target.lastCheck = new Date().toISOString();
        
        if (wasHealthy !== target.healthy) {
          this.emit('target-health-changed', { target, healthy: target.healthy });
        }
        
      } catch (error) {
        target.healthy = false;
        target.lastCheck = new Date().toISOString();
        this.emit('health-check-failed', { target, error });
      } finally {
        clearTimeout(timeoutId);
      }
    }
  }

  private startMetricsCollection(): void {
    setInterval(() => {
      this.rateLimiter.cleanup();
      this.emit('metrics-updated', this.metrics);
    }, 60000); // Every minute
  }

  getMetrics(): GatewayMetrics {
    return { ...this.metrics };
  }

  getRoutes(): Route[] {
    return Array.from(this.routes.values());
  }

  getUpstreams(): Upstream[] {
    return Array.from(this.upstreams.values());
  }
}

export const createGatewayService = (): GatewayService => {
  return GatewayService.getInstance();
};