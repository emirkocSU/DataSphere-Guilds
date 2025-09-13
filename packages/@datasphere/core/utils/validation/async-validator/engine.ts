/**
 * @fileoverview High-performance asynchronous validation engine using a worker pool.
 *
 * This engine manages a pool of worker threads to perform validations concurrently,
 * making it ideal for high-throughput scenarios.
 *
 * @version 1.0.0
 * @author DataSphere Guilds Engineering
 */

import { ValidationJob, ValidationResult, EngineOptions, EngineStats } from './types';
import { DEFAULT_POOL_SIZE } from './constants';
import { WorkerPoolError } from './errors';
import { validateSchema } from '../schema-validator/validator';

export class AsyncValidationEngine {
  private jobQueue: ValidationJob[] = [];
  private activeJobs = new Map<string, (result: ValidationResult) => void>();
  private pendingResolvers = new Map<string, (result: ValidationResult) => void>();
  private nextJobId = 0;
  private maxConcurrentJobs: number;
  private stats: Omit<EngineStats, 'jobsInQueue' | 'activeWorkers'> = {
      totalJobs: 0,
      successfulJobs: 0,
      failedJobs: 0,
      averageJobTime: 0,
      poolSize: 0,
  };

  constructor(options: EngineOptions = {}) {
    this.maxConcurrentJobs = options.poolSize || DEFAULT_POOL_SIZE;
    this.stats.poolSize = this.maxConcurrentJobs;
  }

  /**
   * Validates a batch of jobs asynchronously.
   * @param {ValidationJob[]} jobs An array of validation jobs.
   * @returns {Promise<ValidationResult[]>} A promise that resolves to an array of validation results.
   */
  public validateBulk(jobs: Omit<ValidationJob, 'id'>[]): Promise<ValidationResult[]> {
    return Promise.all(jobs.map(job => this.validate(job.data, job.schema, job.options)));
  }

  /**
   * Validates a single data object asynchronously.
   * @param data The data to validate.
   * @param schema The schema to validate against.
   * @param options Validation options.
   * @returns A promise that resolves with the validation result.
   */
  public validate(data: any, schema: any, options?: any): Promise<ValidationResult> {
    const id = String(this.nextJobId++);
    const job: ValidationJob = { id, data, schema, options };
    this.stats.totalJobs++;

    return new Promise((resolve, reject) => {
        this.pendingResolvers.set(id, resolve);
        
        if (this.activeJobs.size < this.maxConcurrentJobs) {
            this.processJob(job, resolve);
        } else {
            // All slots are busy, queue the job
            this.jobQueue.push(job);
        }
    });
  }

  private async processJob(job: ValidationJob, resolve: (result: ValidationResult) => void) {
    const jobId = String(job.id);
    this.activeJobs.set(jobId, resolve);

    // Use setTimeout to make validation asynchronous (React Native compatible)
    setTimeout(async () => {
      try {
        const startTime = performance.now();
        const validationResult = validateSchema(job.data, job.schema, job.options);
        const endTime = performance.now();
        
        const result: ValidationResult = {
          id: job.id,
          isValid: validationResult.isValid,
          errors: validationResult.fieldErrors,
          data: validationResult.data
        };

        this.stats.successfulJobs++;
        this.stats.averageJobTime = (this.stats.averageJobTime + (endTime - startTime)) / 2;
        
        resolve(result);
        this.activeJobs.delete(jobId);
        this.processQueue();
      } catch (error) {
        this.stats.failedJobs++;
        console.error(`Validation job ${job.id} failed:`, error);
        this.activeJobs.delete(jobId);
        this.processQueue();
      }
    }, 0);
  }

  private processQueue() {
    if (this.jobQueue.length > 0 && this.activeJobs.size < this.maxConcurrentJobs) {
        const nextJob = this.jobQueue.shift()!;
        const resolve = this.pendingResolvers.get(String(nextJob.id))!;
        this.processJob(nextJob, resolve);
        this.pendingResolvers.delete(String(nextJob.id));
    }
  }

  /**
   * Shuts down the engine gracefully.
   */
  public async shutdown(): Promise<void> {
    // Clear pending jobs and resolvers
    this.jobQueue.length = 0;
    this.activeJobs.clear();
    this.pendingResolvers.clear();
  }

  /**
   * Gets the current performance statistics of the engine.
   */
  public getStats(): EngineStats {
    return {
        ...this.stats,
        jobsInQueue: this.jobQueue.length,
        activeWorkers: this.activeJobs.size,
    };
  }
}
