/**
 * @fileoverview Database Connection Pool
 */

import { EventEmitter } from 'events';
import { DatabaseConnection, DatabaseConfig, ConnectionId, PoolConfig } from './types';

export class ConnectionPool extends EventEmitter {
  private connections = new Map<ConnectionId, DatabaseConnection>();
  private available: ConnectionId[] = [];
  private busy: ConnectionId[] = [];
  private waitingQueue: Array<{ resolve: (conn: DatabaseConnection) => void; reject: (err: Error) => void }> = [];

  constructor(private config: DatabaseConfig) {
    super();
    this.initializePool();
  }

  async acquire(): Promise<DatabaseConnection> {
    if (this.available.length > 0) {
      const connectionId = this.available.shift()!;
      this.busy.push(connectionId);
      const connection = this.connections.get(connectionId)!;
      connection.lastUsed = new Date().toISOString();
      return connection;
    }

    if (this.connections.size < this.config.pool.max) {
      const connection = await this.createConnection();
      this.busy.push(connection.id);
      return connection;
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = this.waitingQueue.findIndex(item => item.resolve === resolve);
        if (index > -1) {
          this.waitingQueue.splice(index, 1);
          reject(new Error('Connection acquire timeout'));
        }
      }, this.config.pool.acquireTimeoutMillis);

      this.waitingQueue.push({
        resolve: (conn) => {
          clearTimeout(timeout);
          resolve(conn);
        },
        reject: (err) => {
          clearTimeout(timeout);
          reject(err);
        }
      });
    });
  }

  release(connectionId: ConnectionId): void {
    const index = this.busy.indexOf(connectionId);
    if (index > -1) {
      this.busy.splice(index, 1);
      this.available.push(connectionId);

      if (this.waitingQueue.length > 0) {
        const waiter = this.waitingQueue.shift()!;
        const connection = this.connections.get(connectionId)!;
        this.available.pop();
        this.busy.push(connectionId);
        waiter.resolve(connection);
      }
    }
  }

  async destroy(): Promise<void> {
    for (const [connectionId, connection] of this.connections) {
      await this.destroyConnection(connection);
    }
    this.connections.clear();
    this.available.length = 0;
    this.busy.length = 0;
  }

  getMetrics() {
    return {
      total: this.connections.size,
      available: this.available.length,
      busy: this.busy.length,
      waiting: this.waitingQueue.length
    };
  }

  private async initializePool(): Promise<void> {
    for (let i = 0; i < this.config.pool.min; i++) {
      const connection = await this.createConnection();
      this.available.push(connection.id);
    }
  }

  private async createConnection(): Promise<DatabaseConnection> {
    const connection: DatabaseConnection = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: this.config.type,
      config: this.config,
      state: 'connecting',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      metrics: {
        totalQueries: 0,
        successfulQueries: 0,
        failedQueries: 0,
        averageResponseTime: 0,
        connectionsUsed: 0,
        connectionsAvailable: 0
      }
    };

    try {
      await this.establishConnection(connection);
      connection.state = 'connected';
      this.connections.set(connection.id, connection);
      this.emit('connection-created', connection);
      return connection;
    } catch (error) {
      connection.state = 'error';
      this.emit('connection-error', { connection, error });
      throw error;
    }
  }

  private async establishConnection(connection: DatabaseConnection): Promise<void> {
    // Mock connection establishment
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async destroyConnection(connection: DatabaseConnection): Promise<void> {
    connection.state = 'disconnected';
    this.emit('connection-destroyed', connection);
  }
}

export const createConnectionPool = (config: DatabaseConfig): ConnectionPool => {
  return new ConnectionPool(config);
};