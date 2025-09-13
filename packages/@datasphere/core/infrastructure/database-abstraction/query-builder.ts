/** @fileoverview Business logic for building database queries. */

export type QueryOperation = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';

export interface QueryBuilder {
  select(fields: string[]): QueryBuilder;
  from(table: string): QueryBuilder;
  where(condition: string, params?: any[]): QueryBuilder;
  limit(count: number): QueryBuilder;
  offset(count: number): QueryBuilder;
  build(): string; // Returns the SQL or NoSQL query string
}

export class SqlQueryBuilder implements QueryBuilder {
  private query: string = '';

  select(fields: string[]): SqlQueryBuilder {
    this.query += `SELECT ${fields.join(', ')} `;
    return this;
  }

  from(table: string): SqlQueryBuilder {
    this.query += `FROM ${table} `;
    return this;
  }

  where(condition: string, params?: any[]): SqlQueryBuilder {
    this.query += `WHERE ${condition} `;
    return this;
  }

  limit(count: number): SqlQueryBuilder {
    this.query += `LIMIT ${count} `;
    return this;
  }

  offset(count: number): SqlQueryBuilder {
    this.query += `OFFSET ${count} `;
    return this;
  }

  build(): string {
    return this.query.trim();
  }
}
