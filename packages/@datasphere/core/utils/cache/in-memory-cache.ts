/** @fileoverview Implementation for in-memory LRU cache. */

export class InMemoryCache<K, V> {
  private cache = new Map<K, V>();
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (item) {
      // Move to end to signify most recently used
      this.cache.delete(key);
      this.cache.set(key, item);
    }
    return item;
  }

  set(key: K, value: V): void {
    if (this.cache.size >= this.capacity) {
      // Evict LRU item
      const lruKey = this.cache.keys().next().value;
      this.cache.delete(lruKey);
    }
    this.cache.set(key, value);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
