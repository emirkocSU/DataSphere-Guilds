/**
 * @fileoverview Lean, high-performance ML validation optimizer for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';

const monitor = new PerformanceMonitor('MLOptimizer');

export interface MLOptimizerConfig {
  learningRate?: number;
  batchSize?: number;
  maxIterations?: number;
  convergenceThreshold?: number;
  enableAdaptiveLearning?: boolean;
}

export interface ValidationPattern {
  field: string;
  pattern: string;
  confidence: number;
  usage: number;
  lastUsed: Date;
}

export interface OptimizationResult {
  optimizedRules: ValidationPattern[];
  performanceGain: number;
  accuracy: number;
  trainingTime: number;
}

export interface TrainingData {
  input: any;
  expected: boolean;
  field: string;
  timestamp: Date;
}

export class MLOptimizer {
  private config: MLOptimizerConfig;
  private patterns = new Map<string, ValidationPattern>();
  private trainingData: TrainingData[] = [];
  private weights = new Map<string, number>();
  
  constructor(config: MLOptimizerConfig = {}) {
    this.config = {
      learningRate: config.learningRate || 0.01,
      batchSize: config.batchSize || 32,
      maxIterations: config.maxIterations || 1000,
      convergenceThreshold: config.convergenceThreshold || 0.001,
      enableAdaptiveLearning: config.enableAdaptiveLearning || true
    };
  }
  
  async optimize(validationRules: any[]): Promise<OptimizationResult> {
    return monitor.measure('mlOptimizerOptimize', async () => {
      const startTime = performance.now();
      
      // Analyze existing patterns
      const patterns = this.analyzePatterns(validationRules);
      
      // Train the model if we have training data
      if (this.trainingData.length > 0) {
        await this.trainModel();
      }
      
      // Generate optimized rules
      const optimizedRules = this.generateOptimizedRules(patterns);
      
      const trainingTime = performance.now() - startTime;
      
      return {
        optimizedRules,
        performanceGain: this.calculatePerformanceGain(patterns, optimizedRules),
        accuracy: this.calculateAccuracy(),
        trainingTime
      };
    });
  }
  
  addTrainingData(data: TrainingData): void {
    monitor.measure('mlOptimizerAddTrainingData', () => {
      this.trainingData.push(data);
      
      // Keep only recent training data (last 10000 entries)
      if (this.trainingData.length > 10000) {
        this.trainingData = this.trainingData.slice(-10000);
      }
    });
  }
  
  predict(input: any, field: string): number {
    return monitor.measure('mlOptimizerPredict', () => {
      const pattern = this.patterns.get(field);
      if (!pattern) {
        return 0.5; // Default confidence
      }
      
      const weight = this.weights.get(field) || 1;
      const confidence = this.calculateConfidence(input, pattern);
      
      return Math.min(1, Math.max(0, confidence * weight));
    });
  }
  
  updatePattern(field: string, input: any, success: boolean): void {
    monitor.measure('mlOptimizerUpdatePattern', () => {
      let pattern = this.patterns.get(field);
      
      if (!pattern) {
        pattern = {
          field,
          pattern: this.extractPattern(input),
          confidence: success ? 0.8 : 0.2,
          usage: 1,
          lastUsed: new Date()
        };
      } else {
        // Update confidence based on success/failure
        const learningRate = this.config.learningRate!;
        if (success) {
          pattern.confidence = Math.min(1, pattern.confidence + learningRate);
        } else {
          pattern.confidence = Math.max(0, pattern.confidence - learningRate);
        }
        
        pattern.usage++;
        pattern.lastUsed = new Date();
      }
      
      this.patterns.set(field, pattern);
    });
  }
  
  getOptimizedValidators(): Map<string, (value: any) => boolean> {
    return monitor.measure('mlOptimizerGetOptimizedValidators', () => {
      const validators = new Map<string, (value: any) => boolean>();
      
      for (const [field, pattern] of this.patterns) {
        if (pattern.confidence > 0.7) {
          validators.set(field, (value: any) => {
            const confidence = this.predict(value, field);
            return confidence > 0.5;
          });
        }
      }
      
      return validators;
    });
  }
  
  private async trainModel(): Promise<void> {
    return monitor.measure('mlOptimizerTrainModel', async () => {
      const batchSize = this.config.batchSize!;
      const maxIterations = this.config.maxIterations!;
      
      for (let iteration = 0; iteration < maxIterations; iteration++) {
        const batch = this.getRandomBatch(batchSize);
        let totalError = 0;
        
        for (const data of batch) {
          const prediction = this.predict(data.input, data.field);
          const error = data.expected ? (1 - prediction) : prediction;
          totalError += Math.abs(error);
          
          // Update weights
          const currentWeight = this.weights.get(data.field) || 1;
          const adjustment = this.config.learningRate! * error;
          this.weights.set(data.field, currentWeight + adjustment);
        }
        
        const avgError = totalError / batch.length;
        if (avgError < this.config.convergenceThreshold!) {
          break;
        }
        
        // Adaptive learning rate
        if (this.config.enableAdaptiveLearning && iteration % 100 === 0) {
          this.config.learningRate! *= 0.95;
        }
      }
    });
  }
  
  private analyzePatterns(rules: any[]): ValidationPattern[] {
    return monitor.measure('mlOptimizerAnalyzePatterns', () => {
      const patterns: ValidationPattern[] = [];
      
      for (const rule of rules) {
        if (rule.field && rule.validator) {
          patterns.push({
            field: rule.field,
            pattern: this.extractPattern(rule),
            confidence: 0.5,
            usage: 0,
            lastUsed: new Date()
          });
        }
      }
      
      return patterns;
    });
  }
  
  private generateOptimizedRules(patterns: ValidationPattern[]): ValidationPattern[] {
    return monitor.measure('mlOptimizerGenerateOptimizedRules', () => {
      return patterns
        .filter(pattern => pattern.confidence > 0.6)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 50); // Keep top 50 patterns
    });
  }
  
  private calculatePerformanceGain(original: ValidationPattern[], optimized: ValidationPattern[]): number {
    const originalComplexity = original.length;
    const optimizedComplexity = optimized.length;
    return Math.max(0, (originalComplexity - optimizedComplexity) / originalComplexity);
  }
  
  private calculateAccuracy(): number {
    if (this.trainingData.length === 0) return 0;
    
    let correct = 0;
    for (const data of this.trainingData.slice(-1000)) { // Use last 1000 for accuracy
      const prediction = this.predict(data.input, data.field);
      const predicted = prediction > 0.5;
      if (predicted === data.expected) {
        correct++;
      }
    }
    
    return correct / Math.min(1000, this.trainingData.length);
  }
  
  private extractPattern(input: any): string {
    if (typeof input === 'string') {
      return input.replace(/[0-9]/g, 'N').replace(/[a-zA-Z]/g, 'A');
    }
    return typeof input;
  }
  
  private calculateConfidence(input: any, pattern: ValidationPattern): number {
    const inputPattern = this.extractPattern(input);
    const similarity = this.calculateSimilarity(inputPattern, pattern.pattern);
    return similarity * pattern.confidence;
  }
  
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }
  
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  private getRandomBatch(size: number): TrainingData[] {
    const shuffled = [...this.trainingData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
  }
}

// Global ML optimizer instance
export const globalMLOptimizer = new MLOptimizer({
  learningRate: 0.01,
  batchSize: 64,
  maxIterations: 2000,
  enableAdaptiveLearning: true
});

// Helper functions
export function optimizeValidationRules(rules: any[]): Promise<OptimizationResult> {
  return globalMLOptimizer.optimize(rules);
}

export function predictValidation(input: any, field: string): number {
  return globalMLOptimizer.predict(input, field);
}

export function addValidationTraining(data: TrainingData): void {
  globalMLOptimizer.addTrainingData(data);
}