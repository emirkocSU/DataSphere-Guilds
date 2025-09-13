/** @fileoverview API Gateway routing logic. */
import { ApiRoute } from '../../../types/infrastructure/api-gateway.types';

export class Router {
  private routes: ApiRoute[] = [];

  addRoute(route: ApiRoute) {
    this.routes.push(route);
    console.log(`Route added: ${route.method} ${route.path} -> ${route.targetService}`);
  }

  matchRoute(method: string, path: string): ApiRoute | undefined {
    // Simplified matching logic
    return this.routes.find(r => r.method === method && r.path === path);
  }
}
