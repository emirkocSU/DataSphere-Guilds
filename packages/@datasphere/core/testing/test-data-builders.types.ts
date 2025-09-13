/** @fileoverview Types for test data builders using the Builder pattern. */

export abstract class Builder<T> {
  protected instance: Partial<T> = {};
  abstract build(): T;
}

export interface UserBuilder extends Builder<import('../types').UserProfile> {
  withStatus(status: string): this;
  withReputation(rep: number): this;
}
