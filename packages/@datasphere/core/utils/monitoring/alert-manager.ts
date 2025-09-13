/**
 * @fileoverview Lean, high-performance alert manager for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

export interface Alert {
  type: string;
  message?: string;
  method?: string;
  threshold?: number;
  value?: number;
  timestamp?: Date;
}

export class AlertManager {
  private alerts: Alert[] = [];

  sendAlert(alert: Alert): void {
    const fullAlert = {
      ...alert,
      timestamp: new Date()
    };
    
    this.alerts.push(fullAlert);
    console.warn(`[ALERT] ${alert.type}:`, fullAlert);
  }

  getAlerts(): Alert[] {
    return this.alerts;
  }

  clearAlerts(): void {
    this.alerts = [];
  }
}
