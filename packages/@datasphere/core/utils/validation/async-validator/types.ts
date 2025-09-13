/**
 * @fileoverview Type definitions for the Async Validator Engine.
 *
 * Defines the data structures for jobs, results, and the communication protocol
 * between the main engine and the worker threads.
 *
 * @version 1.0.0
 * @author DataSphere Guilds Engineering
 */

import { Schema, ValidationOptions } from '../schema-validator/types';

/** A unique identifier for a validation job. */
export type JobId = string | number;

/** Represents a single validation task to be processed by a worker. */
export interface ValidationJob<T = any> {
  id: JobId;
  data: T;
  schema: Schema;
  options?: ValidationOptions;
}

/** Represents the result of a single validation job. */
export interface ValidationResult<T = any> {
  id: JobId;
  isValid: boolean;
  errors?: { [key: string]: string[] };
  data: T;
}

/** Defines the structure of messages sent from the Engine to a Worker. */
export interface EngineToWorkerMessage {
  type: 'VALIDATE';
  payload: ValidationJob;
}

/** Defines the structure of messages sent from a Worker to the Engine. */
export type WorkerToEngineMessage = 
  | {
      type: 'RESULT';
      payload: ValidationResult;
    }
  | {
      type: 'ERROR';
      payload: { id: JobId; error: string };
    }
  | {
      type: 'READY';
      payload: { workerId: number };
    };

/** Union type representing all possible worker message types. */
export type WorkerMessage = EngineToWorkerMessage | WorkerToEngineMessage;


/** Configuration options for the AsyncValidationEngine. */
export interface EngineOptions {
    /** The number of worker threads to spawn. Defaults to DEFAULT_POOL_SIZE. */
    poolSize?: number;
    /** The path to the worker script. */
    workerPath?: string;
}

/** Statistical information about the engine's performance. */
export interface EngineStats {
    totalJobs: number;
    successfulJobs: number;
    failedJobs: number;
    averageJobTime: number; // in milliseconds
    jobsInQueue: number;
    activeWorkers: number;
    poolSize: number;
}
