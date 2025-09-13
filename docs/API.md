# DataSphere Guilds API Reference v2.0 - Complete Documentation

<div align="center">

![DataSphere Guilds Logo](../src/assets/images/logo.png)

[![API Version](https://img.shields.io/badge/API%20Version-2.0-blue)](https://api.datasphereguilds.com)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green)](https://api.datasphereguilds.com/docs)
[![Status](https://img.shields.io/badge/Status-Production-success)](https://status.datasphereguilds.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](../LICENSE)

**🌐 Base URL:** `https://api.datasphereguilds.com/v2`  
**📧 Support:** api-support@datasphereguilds.com  
**📚 OpenAPI Spec:** [Download](https://api.datasphereguilds.com/v2/openapi.json)

</div>

---

## 🚀 Quick Start

### 1. Get Your API Credentials
```bash
# Register via API
curl -X POST https://api.datasphereguilds.com/v2/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "SecureP@ssw0rd!",
    "fullName": "Your Name",
    "country": "TR"
  }'
```

### 2. Authenticate
```bash
# Login to get tokens
curl -X POST https://api.datasphereguilds.com/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "your@email.com",
    "password": "SecureP@ssw0rd!"
  }'
```

### 3. Make Your First Request
```bash
# Get available tasks
curl -X GET https://api.datasphereguilds.com/v2/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📋 Table of Contents

- [API Overview](#api-overview)
- [Authentication](#authentication)
- [User Management](#user-management)
- [Task Operations](#task-operations)
- [Quality Control](#quality-control)
- [Appeals System](#appeals-system)
- [Earnings & Payments](#earnings--payments)
- [AI Agent Integration](#ai-agent-integration)
- [Notifications](#notifications)
- [Analytics & Reporting](#analytics--reporting)
- [Webhooks](#webhooks)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## 🌐 API Overview

### Base URLs

| Environment | URL | Description |
|------------|-----|-------------|
| Production | `https://api.datasphereguilds.com/v2` | Live environment |
| Staging | `https://api-staging.datasphereguilds.com/v2` | Testing environment |
| Development | `https://api-dev.datasphereguilds.com/v2` | Development environment |

### Authentication

All authenticated endpoints require a Bearer token:

```http
Authorization: Bearer <access_token>
```

### Rate Limiting

| Tier | Requests/Hour | Burst | Cost |
|------|--------------|-------|------|
| Free | 1,000 | 50/min | $0 |
| Worker | 5,000 | 100/min | $0 |
| Inspector | 10,000 | 200/min | $0 |
| Premium | 50,000 | 500/min | $99/mo |

### Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_ABC123",
    "timestamp": "2025-01-15T14:30:00Z",
    "version": "2.0"
  }
}
```

### Pagination

List endpoints support cursor-based pagination:

```json
{
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6MTIzfQ==",
    "hasMore": true,
    "totalCount": 1234,
    "pageSize": 20
  }
}
```

---

## 🔐 Authentication

### Register

Creates a new worker account.

**Endpoint:** `POST /v2/auth/register`

**Request:**
```json
{
  "email": "jane.doe@example.com",
  "phone": "+905551234567",
  "password": "SecureP@ssw0rd!",
  "fullName": "Jane Doe",
  "dateOfBirth": "1995-06-15",
  "country": "TR",
  "preferredLanguage": "en",
  "referralCode": "FRIEND123",
  "acceptTerms": true,
  "acceptPrivacy": true
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_ABC123",
      "email": "jane.doe@example.com",
      "role": "worker",
      "status": "pending_verification"
    },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresIn": 900
    }
  }
}
```

### Login

Authenticates a user.

**Endpoint:** `POST /v2/auth/login`

**Request:**
```json
{
  "identifier": "jane.doe@example.com",
  "password": "SecureP@ssw0rd!",
  "rememberMe": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": { ... },
    "requires2FA": false
  }
}
```

### Social Login

Login with OAuth providers.

**Endpoint:** `POST /v2/auth/social/{provider}`

Supported providers: `google`, `facebook`, `apple`

**Request:**
```json
{
  "idToken": "eyJ..."
}
```

### Two-Factor Authentication

Enable 2FA for enhanced security.

**Enable 2FA:** `POST /v2/auth/2fa/enable`
```json
{
  "method": "totp"
}
```

**Verify 2FA:** `POST /v2/auth/2fa/verify`
```json
{
  "code": "123456",
  "trustDevice": true
}
```

---

## 👤 User Management

### Get Profile

**Endpoint:** `GET /v2/users/me`

**Response:**
```json
{
  "data": {
    "id": "usr_ABC123",
    "fullName": "Jane Doe",
    "rating": 4.8,
    "level": 3,
    "stats": {
      "completedTasks": 156,
      "acceptanceRate": 94.87,
      "totalEarnings": 1234.56
    }
  }
}
```

### Update Profile

**Endpoint:** `PATCH /v2/users/me`

**Request:**
```json
{
  "displayName": "JaneExpert",
  "bio": "Senior data annotator",
  "skills": ["image-labeling", "video-annotation"]
}
```

### Upload Avatar

**Endpoint:** `POST /v2/users/me/avatar`

**Request:** Multipart form data with `avatar` field

**Response:**
```json
{
  "data": {
    "avatarUrl": "https://cdn.datasphereguilds.com/avatars/usr_ABC123.jpg"
  }
}
```

---

## 📋 Task Operations

### List Tasks

Get available tasks with filtering.

**Endpoint:** `GET /v2/tasks`

**Query Parameters:**
- `status`: `open`, `claimed`, `completed`
- `domain`: `image-labeling`, `audio-transcription`, etc.
- `minReward`: Minimum reward amount
- `maxReward`: Maximum reward amount
- `skills`: Required skills (comma-separated)
- `sort`: `reward`, `deadline`, `created`
- `cursor`: Pagination cursor
- `limit`: Items per page (max: 100)

**Response:**
```json
{
  "data": [
    {
      "id": "task_XYZ789",
      "title": "Label 100 images of cars",
      "domain": "image-labeling",
      "reward": 25.00,
      "currency": "USD",
      "deadline": "2025-01-20T23:59:59Z",
      "requirements": {
        "level": 2,
        "skills": ["image-labeling"],
        "location": null
      },
      "estimatedTime": 120,
      "available": 5
    }
  ],
  "pagination": { ... }
}
```

### Get Task Detail

**Endpoint:** `GET /v2/tasks/{taskId}`

**Response:**
```json
{
  "data": {
    "id": "task_XYZ789",
    "title": "Label 100 images of cars",
    "description": "Identify and label all vehicles in the provided images...",
    "instructions": [
      "Draw bounding boxes around each vehicle",
      "Label as: car, truck, bus, motorcycle, or other",
      "Mark occluded vehicles with 'partial' tag"
    ],
    "domain": "image-labeling",
    "reward": 25.00,
    "dataCount": 100,
    "examples": [ ... ],
    "schema": { ... }
  }
}
```

### Claim Task

Reserve a task for completion.

**Endpoint:** `POST /v2/tasks/{taskId}/claim`

**Response:** `200 OK`
```json
{
  "data": {
    "claimedAt": "2025-01-15T14:30:00Z",
    "expiresAt": "2025-01-15T16:30:00Z",
    "taskData": [ ... ]
  }
}
```

### Submit Task

Submit completed work.

**Endpoint:** `POST /v2/tasks/{taskId}/submit`

**Request:**
```json
{
  "data": {
    "annotations": [ ... ],
    "timeSpent": 115,
    "confidence": 0.95
  },
  "metadata": {
    "platform": "ios",
    "appVersion": "1.0.0",
    "location": {
      "lat": 41.0082,
      "lon": 28.9784,
      "accuracy": 10
    }
  }
}
```

**Response:** `202 Accepted`
```json
{
  "data": {
    "submissionId": "sub_ABC123",
    "status": "pending_review",
    "estimatedReviewTime": 3600
  }
}
```

---

## 🔍 Quality Control

### QC Overview

The multi-layer quality control system ensures high-quality data:

1. **Automated Checks** - AI-powered validation
2. **Peer Review** - Human inspector verification
3. **Gold Standards** - Known correct answers
4. **Honeypots** - Quality monitoring tasks
5. **Appeals** - Dispute resolution process

### List QC Jobs

Get assigned quality control tasks.

**Endpoint:** `GET /v2/qc/jobs`

**Response:**
```json
{
  "data": [
    {
      "id": "qc_ABC123",
      "taskId": "task_XYZ789",
      "submissionId": "sub_DEF456",
      "type": "peer_review",
      "priority": "high",
      "reward": 2.50,
      "deadline": "2025-01-15T16:00:00Z"
    }
  ]
}
```

### Submit QC Review

**Endpoint:** `POST /v2/qc/jobs/{qcJobId}/review`

**Request:**
```json
{
  "decision": "approve",
  "confidence": 0.95,
  "feedback": {
    "accuracy": 5,
    "completeness": 5,
    "followedInstructions": 4
  },
  "issues": []
}
```

---

## 📢 Appeals System

### Create Appeal

Dispute a rejected submission.

**Endpoint:** `POST /v2/appeals`

**Request:**
```json
{
  "submissionId": "sub_ABC123",
  "reason": "incorrect_rejection",
  "explanation": "I followed all instructions correctly. The bounding boxes are accurate.",
  "evidence": [
    {
      "type": "screenshot",
      "url": "https://..."
    }
  ]
}
```

### Appeal Status

**Endpoint:** `GET /v2/appeals/{appealId}`

**Response:**
```json
{
  "data": {
    "id": "appeal_ABC123",
    "status": "under_review",
    "assignedTo": "senior_inspector",
    "timeline": [
      {
        "event": "created",
        "timestamp": "2025-01-15T14:30:00Z",
        "actor": "usr_ABC123"
      }
    ]
  }
}
```

---

## 💰 Earnings & Payments

### Get Balance

**Endpoint:** `GET /v2/payments/balance`

**Response:**
```json
{
  "data": {
    "available": 156.78,
    "pending": 45.00,
    "processing": 0,
    "currency": "USD",
    "nextPayoutDate": "2025-01-20",
    "lifetime": {
      "earned": 2345.67,
      "withdrawn": 2188.89
    }
  }
}
```

### Request Payout

**Endpoint:** `POST /v2/payments/payouts`

**Request:**
```json
{
  "amount": 100.00,
  "method": "iban",
  "details": {
    "iban": "TR330006100519786457841326",
    "accountHolder": "Jane Doe"
  }
}
```

### Transaction History

**Endpoint:** `GET /v2/payments/transactions`

**Response:**
```json
{
  "data": [
    {
      "id": "txn_ABC123",
      "type": "task_completion",
      "amount": 25.00,
      "balance": 181.78,
      "description": "Task: Label 100 images",
      "createdAt": "2025-01-15T14:30:00Z"
    }
  ]
}
```

---

## 🤖 AI Agent Integration

### Pre-Label Suggestion

Get AI-generated suggestions for tasks.

**Endpoint:** `POST /v2/ai/suggest`

**Request:**
```json
{
  "taskId": "task_ABC123",
  "dataId": "img_001",
  "context": {
    "previousLabels": [ ... ]
  }
}
```

**Response:**
```json
{
  "data": {
    "suggestions": [
      {
        "type": "bounding_box",
        "coordinates": [100, 100, 200, 200],
        "label": "car",
        "confidence": 0.92
      }
    ],
    "explanations": [
      "Detected vehicle based on shape and features"
    ]
  }
}
```

### Quality Prediction

Predict submission quality before final submit.

**Endpoint:** `POST /v2/ai/predict-quality`

**Request:**
```json
{
  "taskId": "task_ABC123",
  "data": { ... }
}
```

**Response:**
```json
{
  "data": {
    "predictedScore": 0.94,
    "issues": [],
    "suggestions": [
      "Consider adding more detail to annotation 3"
    ]
  }
}
```

---

## 🔔 Notifications

### List Notifications

**Endpoint:** `GET /v2/notifications`

**Response:**
```json
{
  "data": [
    {
      "id": "notif_ABC123",
      "type": "task_approved",
      "title": "Task Approved!",
      "message": "Your submission for 'Label 100 images' was approved",
      "data": {
        "taskId": "task_XYZ789",
        "earned": 25.00
      },
      "read": false,
      "createdAt": "2025-01-15T14:30:00Z"
    }
  ]
}
```

### Update Preferences

**Endpoint:** `PATCH /v2/notifications/preferences`

**Request:**
```json
{
  "email": {
    "taskApproved": true,
    "taskRejected": true,
    "newTasks": false,
    "weeklyDigest": true
  },
  "push": {
    "taskApproved": true,
    "taskRejected": true,
    "newTasks": true
  }
}
```

---

## 📊 Analytics & Reporting

### Worker Analytics

Get performance metrics.

**Endpoint:** `GET /v2/analytics/performance`

**Query Parameters:**
- `period`: `day`, `week`, `month`, `year`
- `startDate`: ISO date
- `endDate`: ISO date

**Response:**
```json
{
  "data": {
    "period": "month",
    "metrics": {
      "tasksCompleted": 45,
      "tasksRejected": 2,
      "acceptanceRate": 95.56,
      "avgCompletionTime": 127,
      "totalEarned": 678.90,
      "ranking": {
        "global": 1234,
        "percentile": 85
      }
    },
    "trends": {
      "acceptanceRate": "+2.3%",
      "earnings": "+15.7%"
    },
    "breakdown": {
      "byDomain": { ... },
      "byDay": { ... }
    }
  }
}
```

### Leaderboards

**Endpoint:** `GET /v2/analytics/leaderboards`

**Query Parameters:**
- `type`: `global`, `country`, `skill`
- `period`: `week`, `month`, `allTime`

**Response:**
```json
{
  "data": {
    "type": "global",
    "period": "month",
    "yourRank": 156,
    "topWorkers": [
      {
        "rank": 1,
        "user": {
          "id": "usr_TOP1",
          "displayName": "DataMaster",
          "avatarUrl": "..."
        },
        "stats": {
          "tasksCompleted": 523,
          "acceptanceRate": 99.2,
          "totalEarned": 4567.89
        }
      }
    ]
  }
}
```

---

## 🪝 Webhooks

### Register Webhook

**Endpoint:** `POST /v2/webhooks`

**Request:**
```json
{
  "url": "https://your-server.com/webhook",
  "events": [
    "task.completed",
    "task.rejected",
    "payment.processed"
  ],
  "secret": "your-webhook-secret"
}
```

### Webhook Payload

```json
{
  "id": "evt_ABC123",
  "type": "task.completed",
  "created": "2025-01-15T14:30:00Z",
  "data": {
    "taskId": "task_XYZ789",
    "submissionId": "sub_ABC123",
    "earned": 25.00
  }
}
```

### Verify Webhook Signature

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return `sha256=${hash}` === signature;
}
```

---

## ❌ Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Email is required", "Email must be valid"]
    }
  },
  "meta": {
    "requestId": "req_ABC123",
    "timestamp": "2025-01-15T14:30:00Z"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

### Handling Errors

```javascript
try {
  const response = await api.getTasks();
  // Handle success
} catch (error) {
  if (error.code === 'RATE_LIMITED') {
    // Wait and retry
    const retryAfter = error.details.retryAfter;
    setTimeout(() => retry(), retryAfter * 1000);
  } else if (error.code === 'UNAUTHORIZED') {
    // Refresh token
    await refreshToken();
  }
}
```

---

## 🏆 Best Practices

### 1. Authentication

- Store tokens securely (Keychain/Keystore)
- Implement token refresh before expiry
- Use biometric authentication when available
- Never log sensitive data

### 2. Error Handling

- Implement exponential backoff for retries
- Handle network failures gracefully
- Show user-friendly error messages
- Log errors for debugging

### 3. Performance

- Cache frequently accessed data
- Use pagination for large datasets
- Implement request debouncing
- Minimize payload sizes

### 4. Security

- Always use HTTPS
- Validate SSL certificates
- Implement certificate pinning
- Sanitize user inputs

### Example: Robust API Client

```typescript
class DataSphereAPI {
  private baseURL = 'https://api.datasphereguilds.com/v2';
  private accessToken: string;
  private refreshToken: string;

  async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (response.status === 401) {
        await this.refreshAccessToken();
        return this.request(method, endpoint, data);
      }

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return response.json();
    } catch (error) {
      if (error.code === 'NETWORK_ERROR') {
        // Retry with exponential backoff
        return this.retryWithBackoff(() => 
          this.request(method, endpoint, data)
        );
      }
      throw error;
    }
  }

  private async refreshAccessToken() {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    const data = await response.json();
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
  }
}
```

---

## 📚 Additional Resources

- **OpenAPI Specification**: [Download](https://api.datasphereguilds.com/v2/openapi.json)
- **Postman Collection**: [Download](https://api.datasphereguilds.com/v2/postman.json)
- **SDK Libraries**:
  - [JavaScript/TypeScript](https://github.com/datasphere-guilds/js-sdk)
  - [Python](https://github.com/datasphere-guilds/python-sdk)
  - [Swift](https://github.com/datasphere-guilds/swift-sdk)
  - [Kotlin](https://github.com/datasphere-guilds/kotlin-sdk)
- **Status Page**: [status.datasphereguilds.com](https://status.datasphereguilds.com)
- **Support**: api-support@datasphereguilds.com

---

<div align="center">

**Built with ❤️ by DataSphere Guilds Team**

[Website](https://datasphereguilds.com) • [GitHub](https://github.com/datasphere-guilds) • [Discord](https://discord.gg/datasphere)

</div>