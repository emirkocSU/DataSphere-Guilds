/**
 * @fileoverview Database Query Builder
 */

import { EventEmitter } from 'events';
import { Query, QueryCondition, QueryJoin, QueryOrderBy, QueryType, DatabaseType } from './types';

export class QueryBuilder extends EventEmitter {
  private query: Partial<Query> = {};
  private dialectMap = new Map<DatabaseType, QueryDialect>();

  constructor(private dbType: DatabaseType) {
    super();
    this.initializeDialects();
  }

  select(fields: string[] = ['*']): QueryBuilder {
    this.query.type = QueryType.SELECT;
    this.query.fields = fields;
    return this;
  }

  from(table: string): QueryBuilder {
    this.query.table = table;
    return this;
  }

  where(field: string, operator: string, value: unknown): QueryBuilder {
    if (!this.query.conditions) this.query.conditions = [];
    this.query.conditions.push({ field, operator: operator as any, value });
    return this;
  }

  join(table: string, on: string, type: 'inner' | 'left' | 'right' = 'inner'): QueryBuilder {
    if (!this.query.joins) this.query.joins = [];
    this.query.joins.push({ type, table, on });
    return this;
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): QueryBuilder {
    if (!this.query.orderBy) this.query.orderBy = [];
    this.query.orderBy.push({ field, direction });
    return this;
  }

  limit(limit: number): QueryBuilder {
    this.query.limit = limit;
    return this;
  }

  offset(offset: number): QueryBuilder {
    this.query.offset = offset;
    return this;
  }

  insert(table: string, data: Record<string, unknown>): QueryBuilder {
    this.query.type = QueryType.INSERT;
    this.query.table = table;
    this.query.params = [data];
    return this;
  }

  update(table: string, data: Record<string, unknown>): QueryBuilder {
    this.query.type = QueryType.UPDATE;
    this.query.table = table;
    this.query.params = [data];
    return this;
  }

  delete(table: string): QueryBuilder {
    this.query.type = QueryType.DELETE;
    this.query.table = table;
    return this;
  }

  build(): Query {
    const dialect = this.dialectMap.get(this.dbType);
    if (!dialect) throw new Error(`Unsupported database type: ${this.dbType}`);

    const fullQuery: Query = {
      id: `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: this.query.type!,
      raw: dialect.build(this.query),
      params: this.query.params || [],
      table: this.query.table,
      conditions: this.query.conditions || [],
      fields: this.query.fields || [],
      joins: this.query.joins || [],
      orderBy: this.query.orderBy || [],
      groupBy: this.query.groupBy || [],
      having: this.query.having || [],
      limit: this.query.limit,
      offset: this.query.offset
    };

    this.emit('query-built', fullQuery);
    return fullQuery;
  }

  private initializeDialects(): void {
    this.dialectMap.set(DatabaseType.POSTGRESQL, new PostgreSQLDialect());
    this.dialectMap.set(DatabaseType.MYSQL, new MySQLDialect());
    this.dialectMap.set(DatabaseType.MONGODB, new MongoDBDialect());
  }
}

interface QueryDialect {
  build(query: Partial<Query>): string;
}

class PostgreSQLDialect implements QueryDialect {
  build(query: Partial<Query>): string {
    switch (query.type) {
      case QueryType.SELECT:
        return this.buildSelect(query);
      case QueryType.INSERT:
        return this.buildInsert(query);
      case QueryType.UPDATE:
        return this.buildUpdate(query);
      case QueryType.DELETE:
        return this.buildDelete(query);
      default:
        throw new Error(`Unsupported query type: ${query.type}`);
    }
  }

  private buildSelect(query: Partial<Query>): string {
    let sql = `SELECT ${query.fields?.join(', ') || '*'}`;
    sql += ` FROM ${query.table}`;
    
    if (query.joins?.length) {
      sql += ' ' + query.joins.map(join => 
        `${join.type.toUpperCase()} JOIN ${join.table} ON ${join.on}`
      ).join(' ');
    }
    
    if (query.conditions?.length) {
      sql += ' WHERE ' + query.conditions.map(c => 
        `${c.field} ${this.mapOperator(c.operator)} $${query.params?.length || 1}`
      ).join(' AND ');
    }
    
    if (query.orderBy?.length) {
      sql += ' ORDER BY ' + query.orderBy.map(o => 
        `${o.field} ${o.direction.toUpperCase()}`
      ).join(', ');
    }
    
    if (query.limit) sql += ` LIMIT ${query.limit}`;
    if (query.offset) sql += ` OFFSET ${query.offset}`;
    
    return sql;
  }

  private buildInsert(query: Partial<Query>): string {
    const data = query.params?.[0] as Record<string, unknown>;
    const fields = Object.keys(data || {});
    const values = fields.map((_, i) => `$${i + 1}`);
    
    return `INSERT INTO ${query.table} (${fields.join(', ')}) VALUES (${values.join(', ')})`;
  }

  private buildUpdate(query: Partial<Query>): string {
    const data = query.params?.[0] as Record<string, unknown>;
    const fields = Object.keys(data || {});
    const sets = fields.map((field, i) => `${field} = $${i + 1}`);
    
    let sql = `UPDATE ${query.table} SET ${sets.join(', ')}`;
    
    if (query.conditions?.length) {
      sql += ' WHERE ' + query.conditions.map(c => 
        `${c.field} ${this.mapOperator(c.operator)} $${fields.length + 1}`
      ).join(' AND ');
    }
    
    return sql;
  }

  private buildDelete(query: Partial<Query>): string {
    let sql = `DELETE FROM ${query.table}`;
    
    if (query.conditions?.length) {
      sql += ' WHERE ' + query.conditions.map(c => 
        `${c.field} ${this.mapOperator(c.operator)} $1`
      ).join(' AND ');
    }
    
    return sql;
  }

  private mapOperator(operator: string): string {
    const map: Record<string, string> = {
      eq: '=', ne: '!=', gt: '>', lt: '<', gte: '>=', lte: '<=',
      in: 'IN', nin: 'NOT IN', like: 'LIKE', regex: '~'
    };
    return map[operator] || '=';
  }
}

class MySQLDialect implements QueryDialect {
  build(query: Partial<Query>): string {
    // Similar to PostgreSQL but with MySQL-specific syntax
    return new PostgreSQLDialect().build(query).replace(/\$(\d+)/g, '?');
  }
}

class MongoDBDialect implements QueryDialect {
  build(query: Partial<Query>): string {
    // MongoDB uses different syntax - return JSON query
    const mongoQuery: Record<string, unknown> = {};
    
    if (query.conditions?.length) {
      query.conditions.forEach(condition => {
        mongoQuery[condition.field] = { [`$${condition.operator}`]: condition.value };
      });
    }
    
    return JSON.stringify(mongoQuery);
  }
}

export const createQueryBuilder = (dbType: DatabaseType): QueryBuilder => {
  return new QueryBuilder(dbType);
};