/**
 * @fileoverview Integration tests for the main validation facade.
 *
 * This test ensures that different modules exported from the main index
 * can work together seamlessly, demonstrating the kümülatif power of the system.
 *
 * @version 1.0.0
 * @author DataSphere Guilds Engineering
 */

// Jest globals for React Native compatibility
declare global {
  var describe: (description: string, callback: () => void) => void;
  var it: (description: string, callback: () => void | Promise<void>) => void;
  var expect: (value: any) => any;
}

import { BusinessRuleEngine } from '../business-rules';
import { CacheManager } from '../validation-cache';

// Simple test types
interface User {
  id: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Task {
  id: string;
}

interface ClaimTaskContext {
  user: User;
  task: Task;
  activeTaskCount: number;
}

interface RuleResult {
  success: boolean;
  message?: string;
}

// Simple memory adapter for testing
class MemoryAdapter {
  private storage = new Map<string, any>();
  
  async get<T>(key: string): Promise<T | undefined> {
    return this.storage.get(key);
  }
  
  async set(key: string, value: any, ttl?: number): Promise<void> {
    this.storage.set(key, value);
  }
  
  async delete(key: string): Promise<boolean> {
    return this.storage.delete(key);
  }
  
  async flush(): Promise<void> {
    this.storage.clear();
  }
}

describe('Validation Facade Integration Test', () => {

  // 1. Setup a business rule
  const canClaimTaskRule = (context: ClaimTaskContext): RuleResult => {
    return context.user.status === 'ACTIVE' 
      ? { success: true } 
      : { success: false, message: 'User not active' };
  };

  // 2. Setup the business rule engine
  const engine = new BusinessRuleEngine();
  // This is a simplified registration for the test
  (engine as any).validate = (action: string, context: ClaimTaskContext) => {
      if (action === 'CLAIM_TASK') {
          return canClaimTaskRule(context);
      }
      return { success: true };
  }

  // 3. Setup the cache manager
  const cacheManager = new CacheManager(new MemoryAdapter());

  // 4. Create a service that uses caching
  class TaskService {
    public executionCount = 0;

    async checkUserCanClaim(user: User, task: Task): Promise<RuleResult> {
      const cacheKey = `claim-${user.id}-${task.id}`;
      
      // Check cache first
      const cached = await cacheManager.get<RuleResult>(cacheKey);
      if (cached) {
        return cached;
      }

      // Execute validation
      this.executionCount++;
      const context = { user, task, activeTaskCount: 0 };
      const result = (engine as any).validate('CLAIM_TASK', context);
      
      // Cache result
      await cacheManager.set(cacheKey, result, 300); // 5 min TTL
      return result;
    }
  }

  it('should use the cache to avoid re-validating a business rule', async () => {
    const service = new TaskService();
    const activeUser: User = { id: 'user1', status: 'ACTIVE' } as User;
    const task: Task = { id: 'task1' } as Task;

    // First call: should execute the rule
    const result1 = await service.checkUserCanClaim(activeUser, task);
    expect(result1.success).toBe(true);
    expect(service.executionCount).toBe(1);

    // Second call with same args: should hit the cache
    const result2 = await service.checkUserCanClaim(activeUser, task);
    expect(result2.success).toBe(true);
    expect(service.executionCount).toBe(1); // Execution count should NOT increase

    // Verify cache stats
    const stats = cacheManager.getStats();
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(1);
  });
});
