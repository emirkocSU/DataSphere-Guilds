/**
 * AI Configuration for DataSphere Guilds
 * 
 * Flexible AI provider configuration that supports:
 * - OpenAI (GPT-4, GPT-3.5)
 * - Custom AI Models
 * - Local AI Models
 * - Multiple providers simultaneously
 * 
 * @version 2.0.0
 */

export interface AIModelConfig {
  name: string;
  provider: AIProvider;
  endpoint?: string;
  apiKey?: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  retryAttempts: number;
  rateLimitPerMinute: number;
  supportedFeatures: AIFeature[];
  customHeaders?: Record<string, string>;
  authMethod?: 'bearer' | 'api-key' | 'custom';
}

export type AIProvider = 
  | 'openai'
  | 'custom'
  | 'local'
  | 'anthropic'
  | 'google'
  | 'azure'
  | 'huggingface';

export type AIFeature = 
  | 'text-generation'
  | 'image-analysis'
  | 'audio-transcription'
  | 'data-validation'
  | 'quality-control'
  | 'translation'
  | 'summarization'
  | 'classification';

export interface AIProviderConfig {
  primary: AIModelConfig;
  fallback?: AIModelConfig;
  qcSpecific?: AIModelConfig;
  imageAnalysis?: AIModelConfig;
  audioAnalysis?: AIModelConfig;
}

// Environment-based configuration
const getAIConfig = (): AIProviderConfig => {
  const env = process.env.NODE_ENV || 'development';
  
  // OpenAI Configuration (current)
  const openAIConfig: AIModelConfig = {
    name: 'OpenAI GPT-4',
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview',
    maxTokens: 4000,
    temperature: 0.3,
    timeout: 30000,
    retryAttempts: 3,
    rateLimitPerMinute: 60,
    supportedFeatures: [
      'text-generation',
      'data-validation',
      'quality-control',
      'translation',
      'summarization',
      'classification'
    ],
    authMethod: 'bearer'
  };

  // Custom AI Model Configuration (your future model)
  const customModelConfig: AIModelConfig = {
    name: 'DataSphere Custom Model',
    provider: 'custom',
    endpoint: process.env.CUSTOM_AI_ENDPOINT || 'https://your-ai-api.com/v1/chat',
    apiKey: process.env.CUSTOM_AI_API_KEY,
    model: process.env.CUSTOM_AI_MODEL || 'datasphere-qc-v1',
    maxTokens: 4000,
    temperature: 0.2,
    timeout: 45000,
    retryAttempts: 2,
    rateLimitPerMinute: 100,
    supportedFeatures: [
      'text-generation',
      'data-validation',
      'quality-control',
      'image-analysis',
      'audio-transcription'
    ],
    customHeaders: {
      'X-Custom-Auth': process.env.CUSTOM_AI_AUTH_TOKEN || '',
      'X-Client-Version': '2.0.0'
    },
    authMethod: 'custom'
  };

  // Local AI Model Configuration
  const localModelConfig: AIModelConfig = {
    name: 'Local Llama Model',
    provider: 'local',
    endpoint: process.env.LOCAL_AI_ENDPOINT || 'http://localhost:11434/api/chat',
    model: process.env.LOCAL_AI_MODEL || 'llama2:7b',
    maxTokens: 2000,
    temperature: 0.3,
    timeout: 60000,
    retryAttempts: 1,
    rateLimitPerMinute: 30,
    supportedFeatures: [
      'text-generation',
      'data-validation',
      'quality-control'
    ],
    authMethod: 'bearer'
  };

  // Configuration based on environment and availability
  const config: AIProviderConfig = {
    primary: process.env.USE_CUSTOM_AI === 'true' ? customModelConfig : openAIConfig,
    fallback: openAIConfig,
    qcSpecific: process.env.USE_CUSTOM_QC === 'true' ? customModelConfig : openAIConfig,
    imageAnalysis: customModelConfig, // Your model might be better for domain-specific tasks
    audioAnalysis: customModelConfig
  };

  return config;
};

export const AI_CONFIG = getAIConfig();

// Feature flags for AI capabilities
export const AI_FEATURES = {
  ENABLE_AI_QC: process.env.ENABLE_AI_QC !== 'false',
  ENABLE_AI_SUGGESTIONS: process.env.ENABLE_AI_SUGGESTIONS !== 'false',
  ENABLE_AI_TRANSLATION: process.env.ENABLE_AI_TRANSLATION === 'true',
  ENABLE_FALLBACK_PROVIDER: process.env.ENABLE_FALLBACK_PROVIDER !== 'false',
  ENABLE_LOCAL_AI: process.env.ENABLE_LOCAL_AI === 'true',
  ENABLE_CUSTOM_AI: process.env.ENABLE_CUSTOM_AI === 'true',
  
  // Performance settings
  CACHE_AI_RESPONSES: process.env.CACHE_AI_RESPONSES !== 'false',
  CACHE_DURATION_MS: parseInt(process.env.AI_CACHE_DURATION_MS || '300000'), // 5 minutes
  
  // Quality settings
  CONFIDENCE_THRESHOLD: parseFloat(process.env.AI_CONFIDENCE_THRESHOLD || '0.7'),
  ENABLE_RESPONSE_VALIDATION: process.env.ENABLE_AI_RESPONSE_VALIDATION !== 'false',
  
  // Cost optimization
  ENABLE_SMART_ROUTING: process.env.ENABLE_AI_SMART_ROUTING === 'true', // Route to cheaper models for simple tasks
  MAX_DAILY_REQUESTS: parseInt(process.env.AI_MAX_DAILY_REQUESTS || '10000'),
  
  // Development settings
  ENABLE_AI_LOGGING: process.env.NODE_ENV === 'development' || process.env.ENABLE_AI_LOGGING === 'true',
  ENABLE_AI_METRICS: process.env.ENABLE_AI_METRICS !== 'false'
};

// Prompt templates for different use cases
export const AI_PROMPTS = {
  QC_VALIDATION: `
    You are a quality control expert for DataSphere Guilds. 
    Analyze the submitted data and provide a quality assessment.
    
    Task: {taskType}
    Data: {data}
    Requirements: {requirements}
    
    Respond with JSON:
    {
      "isValid": boolean,
      "confidence": number (0-1),
      "issues": string[],
      "suggestions": string[],
      "score": number (0-100)
    }
  `,
  
  DATA_SUGGESTION: `
    You are an AI assistant helping workers with data collection tasks.
    Provide helpful suggestions for improving data quality.
    
    Task: {taskType}
    Current Data: {data}
    Context: {context}
    
    Respond with JSON:
    {
      "suggestions": string[],
      "improvements": string[],
      "confidence": number (0-1)
    }
  `,
  
  APPEAL_ANALYSIS: `
    You are reviewing an appeal for a rejected data submission.
    Analyze the original data, rejection reason, and appeal arguments.
    
    Original Data: {originalData}
    Rejection Reason: {rejectionReason}
    Appeal Arguments: {appealArguments}
    
    Respond with JSON:
    {
      "recommendation": "approve" | "reject" | "needs_human_review",
      "reasoning": string,
      "confidence": number (0-1),
      "additionalEvidence": string[]
    }
  `
};

export default AI_CONFIG; 