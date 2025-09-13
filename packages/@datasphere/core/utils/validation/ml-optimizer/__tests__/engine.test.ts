/**
 * @fileoverview Unit tests for the re-architected ML Optimizer module.
 * @version 1.0.0
 */



import { MLValidationOptimizer } from '../engine';
import { ValidationEvent } from '../types';

// Mock the sub-modules to test the engine's orchestration logic
jest.mock('../feature-extractor');
jest.mock('../model-manager');
jest.mock('../pattern-analyzer');
jest.mock('../risk-assessor');

describe('MLValidationOptimizer Engine', () => {
  let optimizer: MLValidationOptimizer;

  beforeEach(() => {
    optimizer = new MLValidationOptimizer();
  });

  afterEach(async () => {
    await optimizer.shutdown();
  });

  it('should be instantiated without errors', () => {
    expect(optimizer).toBeInstanceOf(MLValidationOptimizer);
  });

  it('should handle learning from a validation event', () => {
    const event: ValidationEvent = {
      id: 'evt1', timestamp: Date.now(), taskType: 'image', validationRules: ['rule1'],
      outcome: 'success', processingTime: 100, errorTypes: [], severity: 'low',
      userId: 'user1', sessionId: 'sess1', contextMetadata: {}
    };

    const emitSpy = jest.spyOn(optimizer, 'emit');
    optimizer.learnFromValidation(event);

    expect(optimizer.getMetrics().totalEvents).toBe(1);
    expect(emitSpy).toHaveBeenCalledWith('learningComplete', event);
  });

  it('should call the model manager for prediction', async () => {
    const prediction = await optimizer.predictValidationOutcome('image', { data: '...' }, {});
    // The mock should return a default value
    expect(prediction).toHaveProperty('confidence');
    expect(prediction).toHaveProperty('prediction');
  });

  it('should gracefully shut down and clear intervals', async () => {
    const removeAllListenersSpy = jest.spyOn(optimizer, 'removeAllListeners');
    await optimizer.shutdown();
    expect(removeAllListenersSpy).toHaveBeenCalled();
    expect(optimizer.getMetrics().totalEvents).toBe(0);
  });
});
