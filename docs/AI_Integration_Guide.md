# AI Model Integration Guide - DataSphere Guilds

Bu rehber, kendi AI modelinizi DataSphere Guilds projesine nasıl entegre edeceğinizi adım adım anlatmaktadır.

## 🎯 Genel Bakış

DataSphere Guilds, esnek bir AI mimarisi ile tasarlanmıştır ve aşağıdaki AI provider'larını destekler:

- **OpenAI** (mevcut - GPT-4/GPT-3.5)
- **Custom AI Models** (sizin modeliniz)
- **Local AI Models** (Ollama, LM Studio, vb.)
- **Cloud Providers** (Anthropic, Google, Azure)

## 🏗️ Mimari Genel Bakış

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Agent Service                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   OpenAI    │  │  Custom AI  │  │  Local AI   │         │
│  │  Provider   │  │  Provider   │  │  Provider   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│               Smart Routing & Fallback                     │
│               Caching & Cost Optimization                  │
│               Metrics & Monitoring                         │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Hızlı Başlangıç

### 1. Environment Variables Ayarlama

`.env` dosyanızda aşağıdaki değişkenleri ayarlayın:

```bash
# Kendi modelinizi aktif etmek için
USE_CUSTOM_AI=true
USE_CUSTOM_QC=true

# Kendi model konfigürasyonu
CUSTOM_AI_ENDPOINT=https://your-ai-api.com/v1/chat
CUSTOM_AI_API_KEY=your_api_key_here
CUSTOM_AI_MODEL=datasphere-qc-v1
CUSTOM_AI_AUTH_TOKEN=your_auth_token

# Özellik kontrolü
ENABLE_CUSTOM_AI=true
```

### 2. Basit Entegrasyon

Eğer modeliniz OpenAI uyumlu API kullanıyorsa, sadece endpoint'i değiştirmeniz yeterli:

```typescript
// Mevcut konfigürasyonda değişiklik
const customConfig: AIModelConfig = {
  name: 'Your Custom Model',
  provider: 'custom',
  endpoint: 'https://your-api.com/v1/chat/completions',
  apiKey: process.env.CUSTOM_AI_API_KEY,
  model: 'your-model-name',
  // ... diğer ayarlar
};
```

### 3. Test Etme

```typescript
import { aiAgent } from '@services/aiAgent';

// Modelinizi test edin
const response = await aiAgent.validateQuality(
  'image-labeling',
  { labels: ['car', 'truck'] },
  { minLabels: 2, maxLabels: 5 }
);

console.log('AI Response:', response);
```

## 🔧 Detaylı Entegrasyon

### Custom AI Provider Sınıfı Özelleştirme

Eğer modeliniz farklı bir API formatı kullanıyorsa, `CustomAIProvider` sınıfını özelleştirebilirsiniz:

```typescript
// src/services/providers/YourCustomProvider.ts
import { AIProviderInterface, AIResponse, AIModelConfig } from '../aiAgent';

export class YourCustomProvider implements AIProviderInterface {
  name = 'Your Custom AI';
  private config: AIModelConfig;

  constructor(config: AIModelConfig) {
    this.config = config;
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Kendi health check endpoint'iniz
      const response = await fetch(`${this.config.endpoint}/status`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async generateResponse(prompt: string, context?: any): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      // Kendi API formatınıza göre request
      const response = await fetch(this.config.endpoint!, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify({
          // Kendi modelinizin beklediği format
          input: prompt,
          parameters: {
            max_length: this.config.maxTokens,
            temperature: this.config.temperature,
            task_type: context?.taskType,
            domain: 'data_quality_control'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: data.output || data.text, // Kendi response formatınız
        confidence: data.confidence_score,
        provider: 'custom',
        model: this.config.model,
        tokensUsed: data.token_count,
        processingTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'custom',
        processingTime: Date.now() - startTime
      };
    }
  }

  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      'X-Model-Version': '2.0',
      'X-Client': 'DataSphere-Guilds',
      // Kendi özel header'larınız
      ...this.config.customHeaders
    };
  }

  validateResponse(response: any): boolean {
    // Kendi response validation mantığınız
    return response && 
           (response.output || response.text) && 
           typeof response.confidence_score === 'number';
  }

  estimateCost(prompt: string): number {
    // Kendi pricing mantığınız
    const estimatedTokens = prompt.length / 4;
    return (estimatedTokens / 1000) * 0.005; // $0.005 per 1K tokens
  }
}
```

### Provider'ı Kaydetme

Yeni provider'ınızı AI Agent Service'e kaydedin:

```typescript
// src/services/aiAgent.ts içinde initializeProviders() methodunu güncelleyin

private initializeProviders(): void {
  // ... mevcut kodlar

  // Kendi provider'ınızı ekleyin
  if (AI_CONFIG.primary.provider === 'your-custom') {
    this.providers.set('primary', new YourCustomProvider(AI_CONFIG.primary));
  }
}
```

## 🎛️ Gelişmiş Özellikler

### 1. Smart Routing

Farklı task türleri için farklı modeller kullanabilirsiniz:

```typescript
// AI konfigürasyonunda
const config: AIProviderConfig = {
  primary: openAIConfig,
  fallback: openAIConfig,
  qcSpecific: yourCustomConfig,        // QC için kendi modeliniz
  imageAnalysis: yourVisionConfig,     // Görüntü analizi için
  audioAnalysis: yourAudioConfig      // Ses analizi için
};
```

### 2. Cost Optimization

```typescript
// Akıllı routing ile maliyet optimizasyonu
if (AI_FEATURES.ENABLE_SMART_ROUTING) {
  // Basit tasklar için ucuz model
  if (isSimpleTask(taskType)) {
    provider = await this.getAvailableProvider('local');
  }
  // Karmaşık tasklar için güçlü model
  else {
    provider = await this.getAvailableProvider('primary');
  }
}
```

### 3. Custom Prompts

Kendi domain'iniz için özel prompt'lar oluşturun:

```typescript
// src/config/ai.config.ts içinde AI_PROMPTS'a ekleyin
export const AI_PROMPTS = {
  // ... mevcut prompt'lar
  
  CUSTOM_DOMAIN_QC: `
    Sen DataSphere Guilds için özel olarak eğitilmiş bir kalite kontrol uzmanısın.
    Türkçe ve İngilizce veri analizi yapabilirsin.
    
    Görev Türü: {taskType}
    Veri: {data}
    Gereksinimler: {requirements}
    
    Analiz sonucunu JSON formatında döndür:
    {
      "gecerli": boolean,
      "guven_skoru": number (0-1),
      "sorunlar": string[],
      "oneriler": string[],
      "puan": number (0-100),
      "dil": "tr" | "en"
    }
  `
};
```

## 🔍 Monitoring ve Debugging

### 1. Metrics Takibi

```typescript
// AI metrics'leri takip edin
const metrics = aiAgent.getMetrics();
console.log('AI Metrics:', {
  totalRequests: metrics.totalRequests,
  successRate: (metrics.successfulRequests / metrics.totalRequests) * 100,
  averageResponseTime: metrics.averageResponseTime,
  providerUsage: metrics.providerUsage,
  totalCost: metrics.totalCost
});
```

### 2. Provider Status Kontrolü

```typescript
// Provider'ların durumunu kontrol edin
const status = await aiAgent.getProvidersStatus();
console.log('Provider Status:', status);
// { primary: true, fallback: true, qc: false }
```

### 3. Debug Logging

```typescript
// Development ortamında detaylı logging
if (AI_FEATURES.ENABLE_AI_LOGGING) {
  console.log('AI Request:', { prompt, context, provider: provider.name });
  console.log('AI Response:', response);
}
```

## 🚀 Production'a Geçiş

### 1. Environment Ayarları

```bash
# Production .env
NODE_ENV=production
USE_CUSTOM_AI=true
CUSTOM_AI_ENDPOINT=https://your-production-api.com/v1/chat
ENABLE_AI_LOGGING=false
ENABLE_AI_METRICS=true
CACHE_AI_RESPONSES=true
```

### 2. Performance Optimizations

```typescript
// Production optimizasyonları
const productionConfig: AIModelConfig = {
  // ... diğer ayarlar
  timeout: 15000,           // Daha kısa timeout
  retryAttempts: 2,         // Daha az retry
  rateLimitPerMinute: 200,  // Daha yüksek rate limit
  maxTokens: 2000          // Daha az token (maliyet için)
};
```

### 3. Error Handling

```typescript
// Güçlü error handling
try {
  const response = await aiAgent.validateQuality(taskType, data, requirements);
  
  if (!response.success) {
    // Fallback mechanism
    console.warn('Primary AI failed, trying fallback');
    // Manual QC'ye yönlendir veya basit validation kullan
  }
} catch (error) {
  // Critical error handling
  console.error('AI Service Critical Error:', error);
  // Sistem admin'e bildirim gönder
}
```

## 📊 Örnek Kullanım Senaryoları

### 1. Görüntü Etiketleme QC

```typescript
const imageQCResponse = await aiAgent.validateQuality(
  'image-labeling',
  {
    imageUrl: 'https://example.com/image.jpg',
    labels: [
      { class: 'car', bbox: [100, 100, 200, 200], confidence: 0.95 },
      { class: 'person', bbox: [150, 50, 180, 120], confidence: 0.87 }
    ]
  },
  {
    minLabels: 1,
    maxLabels: 10,
    requiredClasses: ['vehicle', 'person'],
    minConfidence: 0.8
  }
);
```

### 2. Ses Transkripsiyon QC

```typescript
const audioQCResponse = await aiAgent.validateQuality(
  'audio-transcription',
  {
    audioUrl: 'https://example.com/audio.mp3',
    transcription: 'Merhaba, bu bir test kaydıdır.',
    duration: 5.2,
    language: 'tr'
  },
  {
    minDuration: 3,
    maxDuration: 60,
    requiredLanguage: 'tr',
    minWordCount: 3
  }
);
```

### 3. Metin Analizi

```typescript
const textAnalysisResponse = await aiAgent.getSuggestions(
  'text-classification',
  {
    text: 'Bu ürün çok kaliteli ve hızlı kargo.',
    category: 'product-review'
  },
  {
    language: 'tr',
    sentiment: 'positive',
    domain: 'e-commerce'
  }
);
```

## 🔄 Migration Rehberi

### OpenAI'dan Kendi Modelinize Geçiş

1. **Aşamalı Geçiş**: Önce test ortamında deneyin
2. **A/B Testing**: İki modeli paralel çalıştırın
3. **Fallback**: OpenAI'ı fallback olarak tutun
4. **Monitoring**: Performans metriklerini yakından takip edin

```typescript
// Aşamalı geçiş için feature flag
const useCustomAI = Math.random() < 0.1; // %10 trafiği kendi modelinize

if (useCustomAI && AI_FEATURES.ENABLE_CUSTOM_AI) {
  provider = await this.getAvailableProvider('custom');
} else {
  provider = await this.getAvailableProvider('openai');
}
```

## 🛠️ Troubleshooting

### Yaygın Sorunlar ve Çözümleri

1. **Connection Timeout**
   ```typescript
   // Timeout ayarlarını artırın
   timeout: 45000, // 45 saniye
   ```

2. **Rate Limiting**
   ```typescript
   // Rate limit ayarlarını kontrol edin
   rateLimitPerMinute: 60,
   ```

3. **Response Format Issues**
   ```typescript
   // Response validation'ı güçlendirin
   validateResponse(response: any): boolean {
     return response && 
            response.data && 
            typeof response.confidence === 'number';
   }
   ```

## 📞 Destek

Entegrasyon sırasında sorun yaşarsanız:

- **Email**: ai-support@datasphereguilds.com
- **Discord**: #ai-integration kanalı
- **GitHub Issues**: Teknik sorunlar için

---

Bu rehber ile kendi AI modelinizi kolayca entegre edebilir ve OpenAI bağımlılığını ortadan kaldırabilirsiniz! 🚀 