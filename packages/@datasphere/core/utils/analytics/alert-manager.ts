/**
 * @fileoverview Alert Management System
 */

import { EventEmitter } from 'events';
import { AlertRule, AlertId, StreamEvent } from './types';

interface AlertState {
  id: AlertId;
  rule: AlertRule;
  triggered: boolean;
  triggerTime?: number;
  acknowledgedBy?: string;
  lastNotification?: number;
}

export class AlertManager extends EventEmitter {
  private static instance: AlertManager;
  private rules = new Map<AlertId, AlertRule>();
  private states = new Map<AlertId, AlertState>();
  private channels = new Map<string, Function>();

  private constructor() {
    super();
  }

  static getInstance(): AlertManager {
    if (!AlertManager.instance) {
      AlertManager.instance = new AlertManager();
    }
    return AlertManager.instance;
  }

  addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
    this.states.set(rule.id, {
      id: rule.id,
      rule,
      triggered: false
    });
  }

  removeRule(ruleId: AlertId): void {
    this.rules.delete(ruleId);
    this.states.delete(ruleId);
  }

  registerChannel(name: string, handler: Function): void {
    this.channels.set(name, handler);
  }

  async evaluateEvent(event: StreamEvent): Promise<void> {
    for (const [ruleId, rule] of this.rules) {
      if (!rule.enabled) continue;

      const shouldTrigger = await this.evaluateRule(rule, event);
      await this.handleRuleResult(ruleId, shouldTrigger, event);
    }
  }

  async acknowledgeAlert(alertId: AlertId, userId: string): Promise<void> {
    const state = this.states.get(alertId);
    if (!state) return;

    state.acknowledgedBy = userId;
    this.emit('alert-acknowledged', { alertId, userId });
  }

  private async evaluateRule(rule: AlertRule, event: StreamEvent): Promise<boolean> {
    try {
      // Simple condition evaluation
      return this.evaluateCondition(rule.condition, event);
    } catch (error) {
      this.emit('rule-error', { ruleId: rule.id, error });
      return false;
    }
  }

  private evaluateCondition(condition: string, event: StreamEvent): boolean {
    // Simplified condition evaluation
    if (condition.includes('event.type')) {
      return condition.includes(event.type);
    }
    
    if (condition.includes('event.data.value')) {
      const value = Number(event.data.value);
      if (condition.includes('>')) {
        const threshold = parseFloat(condition.split('>')[1].trim());
        return value > threshold;
      }
      if (condition.includes('<')) {
        const threshold = parseFloat(condition.split('<')[1].trim());
        return value < threshold;
      }
    }
    
    return false;
  }

  private async handleRuleResult(
    ruleId: AlertId,
    shouldTrigger: boolean,
    event: StreamEvent
  ): Promise<void> {
    const state = this.states.get(ruleId);
    if (!state) return;

    const now = Date.now();
    
    if (shouldTrigger && !state.triggered) {
      // New alert
      state.triggered = true;
      state.triggerTime = now;
      state.lastNotification = now;
      
      await this.sendNotifications(state.rule, event);
      this.emit('alert-triggered', { ruleId, event });
      
    } else if (!shouldTrigger && state.triggered) {
      // Alert resolved
      state.triggered = false;
      state.triggerTime = undefined;
      state.acknowledgedBy = undefined;
      
      await this.sendResolutionNotifications(state.rule);
      this.emit('alert-resolved', { ruleId });
      
    } else if (shouldTrigger && state.triggered) {
      // Check throttling
      const timeSinceLastNotification = now - (state.lastNotification || 0);
      if (timeSinceLastNotification >= state.rule.throttle * 1000) {
        state.lastNotification = now;
        await this.sendNotifications(state.rule, event);
      }
    }
  }

  private async sendNotifications(rule: AlertRule, event: StreamEvent): Promise<void> {
    const message = this.createAlertMessage(rule, event);
    
    for (const channel of rule.channels) {
      const handler = this.channels.get(channel);
      if (handler) {
        try {
          await handler(message);
        } catch (error) {
          this.emit('notification-error', { channel, error });
        }
      }
    }
  }

  private async sendResolutionNotifications(rule: AlertRule): Promise<void> {
    const message = {
      type: 'resolution',
      rule: rule.name,
      severity: rule.severity,
      message: `Alert resolved: ${rule.name}`,
      timestamp: new Date().toISOString()
    };
    
    for (const channel of rule.channels) {
      const handler = this.channels.get(channel);
      if (handler) {
        try {
          await handler(message);
        } catch (error) {
          this.emit('notification-error', { channel, error });
        }
      }
    }
  }

  private createAlertMessage(rule: AlertRule, event: StreamEvent): any {
    return {
      type: 'alert',
      rule: rule.name,
      severity: rule.severity,
      condition: rule.condition,
      event: {
        type: event.type,
        timestamp: event.timestamp,
        data: event.data
      },
      message: `Alert: ${rule.name} - ${rule.condition}`,
      timestamp: new Date().toISOString()
    };
  }

  getActiveAlerts(): AlertState[] {
    return Array.from(this.states.values()).filter(state => state.triggered);
  }

  getAlertHistory(limit: number = 100): any[] {
    // In a real implementation, this would query from persistent storage
    return [];
  }
}

export const createAlertManager = (): AlertManager => {
  return AlertManager.getInstance();
};