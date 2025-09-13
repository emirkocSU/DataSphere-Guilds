/**
 * @fileoverview ML Model Registry
 */

import { EventEmitter } from 'events';
import { Model, ModelId, ModelVersion, Experiment, Deployment } from './types';

export class ModelRegistry extends EventEmitter {
  private static instance: ModelRegistry;
  private models = new Map<ModelId, Model>();
  private versions = new Map<string, ModelVersion>();
  private experiments = new Map<string, Experiment>();
  private deployments = new Map<string, Deployment>();

  private constructor() {
    super();
  }

  static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  registerModel(model: Model): void {
    this.models.set(model.id, model);
    this.emit('model-registered', model);
  }

  getModel(modelId: ModelId): Model | null {
    return this.models.get(modelId) || null;
  }

  listModels(filter?: { status?: string; type?: string }): Model[] {
    const models = Array.from(this.models.values());
    
    if (!filter) return models;
    
    return models.filter(model => {
      if (filter.status && model.status !== filter.status) return false;
      if (filter.type && model.type !== filter.type) return false;
      return true;
    });
  }

  updateModelStatus(modelId: ModelId, status: Model['status']): void {
    const model = this.models.get(modelId);
    if (model) {
      model.status = status;
      model.updatedAt = new Date().toISOString();
      this.emit('model-status-updated', { modelId, status });
    }
  }

  createVersion(modelId: ModelId, version: string, checksum: string, size: number): ModelVersion {
    const versionId = `${modelId}:${version}`;
    const modelVersion: ModelVersion = {
      id: versionId,
      modelId,
      version,
      checksum,
      size,
      createdAt: new Date().toISOString(),
      isActive: false
    };

    this.versions.set(versionId, modelVersion);
    this.emit('version-created', modelVersion);
    return modelVersion;
  }

  setActiveVersion(modelId: ModelId, version: string): void {
    // Deactivate all versions for this model
    for (const [id, modelVersion] of this.versions) {
      if (modelVersion.modelId === modelId) {
        modelVersion.isActive = false;
      }
    }

    // Activate the specified version
    const versionId = `${modelId}:${version}`;
    const modelVersion = this.versions.get(versionId);
    if (modelVersion) {
      modelVersion.isActive = true;
      this.emit('active-version-changed', { modelId, version });
    }
  }

  getActiveVersion(modelId: ModelId): ModelVersion | null {
    for (const modelVersion of this.versions.values()) {
      if (modelVersion.modelId === modelId && modelVersion.isActive) {
        return modelVersion;
      }
    }
    return null;
  }

  createExperiment(experiment: Experiment): void {
    this.experiments.set(experiment.id, experiment);
    this.emit('experiment-created', experiment);
  }

  updateExperiment(experimentId: string, updates: Partial<Experiment>): void {
    const experiment = this.experiments.get(experimentId);
    if (experiment) {
      Object.assign(experiment, updates);
      experiment.updatedAt = new Date().toISOString();
      this.emit('experiment-updated', experiment);
    }
  }

  getExperiment(experimentId: string): Experiment | null {
    return this.experiments.get(experimentId) || null;
  }

  listExperiments(): Experiment[] {
    return Array.from(this.experiments.values());
  }

  recordDeployment(deployment: Deployment): void {
    this.deployments.set(deployment.id, deployment);
    this.emit('deployment-recorded', deployment);
  }

  updateDeploymentStatus(deploymentId: string, status: Deployment['status']): void {
    const deployment = this.deployments.get(deploymentId);
    if (deployment) {
      deployment.status = status;
      this.emit('deployment-status-updated', { deploymentId, status });
    }
  }

  getDeployments(modelId?: ModelId): Deployment[] {
    const deployments = Array.from(this.deployments.values());
    return modelId ? deployments.filter(d => d.modelId === modelId) : deployments;
  }

  archiveModel(modelId: ModelId): void {
    const model = this.models.get(modelId);
    if (model) {
      model.status = 'retired';
      model.updatedAt = new Date().toISOString();
      this.emit('model-archived', model);
    }
  }

  deleteModel(modelId: ModelId): void {
    const model = this.models.get(modelId);
    if (model) {
      this.models.delete(modelId);
      
      // Remove versions
      for (const [id, version] of this.versions) {
        if (version.modelId === modelId) {
          this.versions.delete(id);
        }
      }
      
      this.emit('model-deleted', model);
    }
  }

  getModelMetrics(modelId: ModelId): any {
    const model = this.models.get(modelId);
    if (!model) return null;

    const versions = Array.from(this.versions.values())
      .filter(v => v.modelId === modelId);
    
    const deployments = Array.from(this.deployments.values())
      .filter(d => d.modelId === modelId);

    return {
      model: model.metrics,
      versions: versions.length,
      deployments: deployments.length,
      activeDeployments: deployments.filter(d => d.status === 'deployed').length
    };
  }

  searchModels(query: string): Model[] {
    const models = Array.from(this.models.values());
    const lowerQuery = query.toLowerCase();
    
    return models.filter(model => 
      model.name.toLowerCase().includes(lowerQuery) ||
      model.algorithm.toLowerCase().includes(lowerQuery) ||
      model.type.toLowerCase().includes(lowerQuery)
    );
  }
}

export const createModelRegistry = (): ModelRegistry => {
  return ModelRegistry.getInstance();
};