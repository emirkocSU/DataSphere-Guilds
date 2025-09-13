/**
 * @fileoverview Lean, high-performance logging utility for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

export class Logger {
  constructor(private context: string) {}

  debug(message: string, meta?: any): void {
    console.debug(`[${this.context}] ${message}`, meta || "");
  }

  info(message: string, meta?: any): void {
    console.info(`[${this.context}] ${message}`, meta || "");
  }

  warn(message: string, meta?: any): void {
    console.warn(`[${this.context}] ${message}`, meta || "");
  }

  error(message: string, meta?: any): void {
    console.error(`[${this.context}] ${message}`, meta || "");
  }
}
