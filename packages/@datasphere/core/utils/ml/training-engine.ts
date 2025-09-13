/**
 * @fileoverview ML Training Engine
 */

import { EventEmitter } from 'events';
import { TrainingJob, TrainingConfig, Model, ModelId } from './types';

export class TrainingEngine extends EventEmitter {
  private static instance: TrainingEngine;
  private jobs = new Map<string, TrainingJob>();
  private queue: TrainingJob[] = [];
  private running = false;

  private constructor() {
    super();
    this.startJobProcessor();
  }

  static getInstance(): TrainingEngine {
    if (!TrainingEngine.instance) {
      TrainingEngine.instance = new TrainingEngine();
    }
    return TrainingEngine.instance;
  }

  async startTraining(modelId: ModelId, config: TrainingConfig): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const job: TrainingJob = {
      id: jobId,
      modelId,
      status: 'pending',
      progress: 0,
      startTime: new Date().toISOString(),
      config,
      metrics: {},
      logs: []
    };

    this.jobs.set(jobId, job);
    this.queue.push(job);
    
    this.emit('job-created', job);
    return jobId;
  }

  getJob(jobId: string): TrainingJob | null {
    return this.jobs.get(jobId) || null;
  }

  getJobs(modelId?: ModelId): TrainingJob[] {
    const jobs = Array.from(this.jobs.values());
    return modelId ? jobs.filter(j => j.modelId === modelId) : jobs;
  }

  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'completed') return false;

    job.status = 'failed';
    job.endTime = new Date().toISOString();
    job.logs.push(`Job cancelled at ${new Date().toISOString()}`);
    
    this.emit('job-cancelled', job);
    return true;
  }

  private startJobProcessor(): void {
    if (this.running) return;
    
    this.running = true;
    setInterval(() => this.processQueue(), 5000);
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) return;

    const job = this.queue.shift();
    if (!job) return;

    try {
      await this.executeJob(job);
    } catch (error) {
      this.handleJobError(job, error);
    }
  }

  private async executeJob(job: TrainingJob): Promise<void> {
    job.status = 'running';
    job.logs.push(`Training started at ${new Date().toISOString()}`);
    
    this.emit('job-started', job);

    // Simulate training process
    for (let epoch = 1; epoch <= job.config.epochs; epoch++) {
      await this.simulateEpoch(job, epoch);
      
      const currentJob = this.jobs.get(job.id);
      if (currentJob?.status === 'failed') break;
    }

    const finalJob = this.jobs.get(job.id);
    if (finalJob?.status === 'running') {
      finalJob.status = 'completed';
      finalJob.progress = 100;
      finalJob.endTime = new Date().toISOString();
      finalJob.logs.push(`Training completed at ${new Date().toISOString()}`);
      
      this.emit('job-completed', finalJob);
    }
  }

  private async simulateEpoch(job: TrainingJob, epoch: number): Promise<void> {
    const progress = (epoch / job.config.epochs) * 100;
    job.progress = Math.floor(progress);

    // Simulate metrics
    const loss = Math.max(0.1, 2.0 - (epoch * 0.1) + (Math.random() * 0.2));
    const accuracy = Math.min(0.95, 0.5 + (epoch * 0.02) + (Math.random() * 0.05));
    
    job.metrics = {
      epoch,
      loss,
      accuracy,
      val_loss: loss + 0.1,
      val_accuracy: accuracy - 0.05
    };

    job.logs.push(`Epoch ${epoch}/${job.config.epochs} - loss: ${loss.toFixed(4)} - accuracy: ${accuracy.toFixed(4)}`);
    
    this.emit('job-progress', job);
    
    // Simulate training time
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private handleJobError(job: TrainingJob, error: any): void {
    job.status = 'failed';
    job.endTime = new Date().toISOString();
    job.logs.push(`Error: ${error.message || error}`);
    
    this.emit('job-failed', { job, error });
  }

  getJobMetrics(jobId: string): any {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    return {
      id: job.id,
      modelId: job.modelId,
      status: job.status,
      progress: job.progress,
      duration: job.endTime ? 
        new Date(job.endTime).getTime() - new Date(job.startTime).getTime() : 
        Date.now() - new Date(job.startTime).getTime(),
      metrics: job.metrics,
      epochs: job.config.epochs
    };
  }

  getQueueStatus(): { pending: number; running: number; completed: number } {
    const jobs = Array.from(this.jobs.values());
    
    return {
      pending: jobs.filter(j => j.status === 'pending').length,
      running: jobs.filter(j => j.status === 'running').length,
      completed: jobs.filter(j => j.status === 'completed').length
    };
  }

  cleanup(): void {
    const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
    
    for (const [jobId, job] of this.jobs) {
      if (job.status === 'completed' && new Date(job.startTime).getTime() < cutoff) {
        this.jobs.delete(jobId);
      }
    }
  }
}

export const createTrainingEngine = (): TrainingEngine => {
  return TrainingEngine.getInstance();
};