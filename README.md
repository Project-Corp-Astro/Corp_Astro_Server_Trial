# Corp Astro Backend Server

<div align="center">
  <img src="docs/assets/corp-astro-logo.png" alt="Corp Astro Logo" width="200"/>
  <h3>Enterprise-Grade Astrological Solutions for Business</h3>
</div>

[![Build Status](https://img.shields.io/github/workflow/status/Project-Corp-Astro/Corp_Astro_Server_Trial/CI)](https://github.com/Project-Corp-Astro/Corp_Astro_Server_Trial/actions)
[![Coverage](https://img.shields.io/codecov/c/github/Project-Corp-Astro/Corp_Astro_Server_Trial)](https://codecov.io/gh/Project-Corp-Astro/Corp_Astro_Server_Trial)
[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)


<div align="center">

**A comprehensive backend server for corporate astrology services**

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.x-blue.svg)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.x-orange.svg)](https://sequelize.org/)

</div>

## 📋 Overview

The Corp Astro Backend Server provides the foundation for the Corp Astro mobile application, delivering corporate astrology services, personalized content, and business astrological insights. This server is built with TypeScript and follows modern backend development practices to ensure scalability, maintainability, and performance.

### 🌟 What is Corp Astro?

Corp Astro is a comprehensive astrology platform focused on corporate and business astrology. It helps business owners and entrepreneurs make informed decisions based on astrological insights tailored specifically for business contexts. The platform offers various features across different subscription tiers, from free basic tools to premium personalized consultations.

### 🧩 Project Components

```mermaid
graph TD
    A[Corp Astro Mobile App] <--> B[Corp Astro Backend Server]
    B <--> C[Astro Engine]
    B <--> D[Astro Ratan AI]
    B <--> E[Super Admin Panel]
    
    style B fill:#f9f,stroke:#333,stroke-width:2px
```

1. **Corp Astro Mobile Application**: The primary client interface for users to access corporate astrology services
2. **Corp Astro Backend Server** (this repository): Provides APIs, content generation, and business logic
3. **Super Admin Panel (SAP)**: Web-based administration interface for content management and analytics (developed separately)
4. **Astro Ratan**: AI agent built using OpenAI Assistant APIs, trained on astrology texts for personalized guidance
5. **Astro Engine**: Core calculation component generating charts and predictions using Swiss Ephemeris with sidereal zodiac system, whole sign system, and lahiri ayanamsa

### 🏗️ System Architecture

```mermaid
graph TD
    subgraph "Client Layer"
        MobileApp[Mobile Application]
        SAP[Super Admin Panel]
        ThirdParty[Third-Party Integrations]
    end

    subgraph "API Gateway Layer"
        APIGateway[API Gateway]
        RateLimit[Rate Limiting]
        Auth[Authentication/Authorization]
        Logging[Request Logging]
    end

    subgraph "Service Layer"
        UserService[User Management]
        ContentService[Content Generation]
        BusinessService[Business Analysis]
        NotificationService[Push Notifications]
        AnalyticsService[Analytics System]
        WebhookService[Webhook System]
        WorkflowService[Workflow Engine]
    end

    subgraph "Integration Layer"
        AstroEngine[Astro Engine]
        AstroRatan[Astro Ratan AI]
        Queue[Message Queue]
        Cache[Redis Cache]
    end

    subgraph "Data Layer"
        Database[(PostgreSQL)]
        FileStorage[(File Storage)]
        AnalyticsDB[(Analytics DB)]
    end

    MobileApp --> APIGateway
    SAP --> APIGateway
    ThirdParty --> APIGateway

    APIGateway --> RateLimit
    RateLimit --> Auth
    Auth --> Logging
    Logging --> ServiceLayer

    ServiceLayer --> UserService
    ServiceLayer --> ContentService
    ServiceLayer --> BusinessService
    ServiceLayer --> NotificationService
    ServiceLayer --> AnalyticsService
    ServiceLayer --> WebhookService
    ServiceLayer --> WorkflowService

    UserService --> Database
    ContentService --> Database
    BusinessService --> Database
    NotificationService --> Database
    AnalyticsService --> AnalyticsDB
    WebhookService --> Database
    WorkflowService --> Database

    ContentService --> AstroEngine
    ContentService --> AstroRatan
    BusinessService --> AstroEngine
    NotificationService --> Queue
    WebhookService --> Queue

    UserService --> Cache
    ContentService --> Cache
    BusinessService --> Cache
    ContentService --> FileStorage

    style APIGateway fill:#f9f,stroke:#333,stroke-width:2px
    style Database fill:#bbf,stroke:#333,stroke-width:2px
    style AstroEngine fill:#bfb,stroke:#333,stroke-width:2px
    style AstroRatan fill:#bfb,stroke:#333,stroke-width:2px
```

The Corp Astro Backend Server follows a modular, service-oriented architecture designed for scalability, maintainability, and performance. The system is divided into distinct layers, each with specific responsibilities:

### 🚀 Key Features

<table>
  <tr>
    <td width="50%">
      <h4>🔮 Content Generation System</h4>
      <ul>
        <li>Daily horoscopes tailored for business contexts</li>
        <li>Monthly business forecast reports</li>
        <li>Personalized content based on user's birth chart</li>
        <li>Content delivery based on subscription tier</li>
      </ul>
    </td>
    <td width="50%">
      <h4>💰 Subscription Tier Management</h4>
      <ul>
        <li><b>Free Tier:</b> Basic tools and limited content</li>
        <li><b>Basic Tier:</b> Daily horoscopes, monthly reports, Astro Ratan chat</li>
        <li><b>Premium Tier:</b> All features plus business forecasts and human consultations</li>
        <li>Seamless subscription handling with secure payment processing</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h4>💼 Business Astrology Features</h4>
      <ul>
        <li>Business natal charts based on founding date/time</li>
        <li>Strategic timing recommendations for business decisions</li>
        <li>Team compatibility analysis</li>
        <li>Detailed business profile management</li>
      </ul>
    </td>
    <td>
      <h4>🔧 Free Tools</h4>
      <ul>
        <li>Business name numerology analysis using Chaldean system</li>
        <li>Tagline compatibility checking</li>
        <li>Brand color analysis and recommendations</li>
        <li>Basic business compatibility assessments</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h4>📊 Analytics System</h4>
      <ul>
        <li>Comprehensive user behavior tracking</li>
    </td>
    <td width="33%" align="center">
      <h4>📱 Mobile Optimizations</h4>
      <p>Batch processing, response compression, and offline support</p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <h4>📨 Push Notifications</h4>
      <p>Cross-platform push notification delivery system</p>
    </td>
    <td align="center">
      <h4>🔄 Webhooks</h4>
      <p>Real-time integration with external systems</p>
    </td>
    <td align="center">
      <h4>⚙️ Workflow Engine</h4>
      <p>Automated business processes and content generation</p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <h4>💼 Business Analysis</h4>
      <p>Corporate astrological insights and recommendations</p>
    </td>
    <td align="center">
      <h4>📈 Scalability</h4>
      <p>Horizontal scaling with load balancing and clustering</p>
    </td>
    <td align="center">
      <h4>🔍 Monitoring</h4>
      <p>Comprehensive logging and performance monitoring</p>
    </td>
  </tr>
</table>

## 🔒 Authentication System

```mermaid
sequenceDiagram
    participant User
    participant Mobile as Mobile App
    participant Backend as Backend Server
    participant DB as Database
    
    User->>Mobile: Enter Credentials
    Mobile->>Backend: POST /api/auth/login
    Backend->>DB: Validate Credentials
    DB->>Backend: User Data
    Backend->>Backend: Generate JWT
    Backend->>Mobile: Return JWT + User Data
    Mobile->>Mobile: Store JWT
    
    Note over Mobile,Backend: Subsequent Authenticated Requests
    
    Mobile->>Backend: Request with JWT Header
    Backend->>Backend: Verify JWT
    Backend->>Mobile: Protected Resource
```

The Corp Astro Backend Server implements a robust JWT-based authentication system with role-based access control. The system supports:

- **User Registration & Login**: Secure account creation and authentication
- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Role-Based Access Control**: Different permission levels (user, admin, etc.)
- **Token Refresh**: Automatic token renewal without requiring re-login
- **Password Reset**: Secure password recovery workflow
- **Multi-device Support**: Simultaneous login from multiple devices
- **Session Management**: View and revoke active sessions

For detailed implementation, see the [Authentication Guide](/docs/authentication-guide.md).

## 📨 Push Notification System

```mermaid
flowchart TD
    Backend[Backend Server] -->|Trigger Event| NotificationService[Notification Service]
    NotificationService -->|Format Payload| FCM[Firebase Cloud Messaging]
    NotificationService -->|Format Payload| APNS[Apple Push Notification Service]
    FCM -->|Deliver| Android[Android Devices]
    APNS -->|Deliver| iOS[iOS Devices]
    
    subgraph Notification Types
        Daily[Daily Horoscopes]
        Monthly[Monthly Reports]
        Business[Business Alerts]
        Content[New Content]
        Subscription[Subscription Alerts]
    end
    
    subgraph Notification Service
        Queue[Message Queue]
        Templates[Notification Templates]
        Scheduler[Notification Scheduler]
        Analytics[Delivery Analytics]
    end
    
    Notification Types --> NotificationService
```

The push notification system enables real-time communication with mobile app users through:

- **Cross-Platform Support**: Integrated with both Firebase Cloud Messaging (Android) and Apple Push Notification Service (iOS)
- **Rich Notifications**: Support for images, action buttons, and deep linking
- **Notification Templates**: Predefined templates for common notification types
- **Scheduled Notifications**: Time-based delivery for future notifications
- **Personalization**: Dynamic content based on user preferences and behavior
- **Delivery Analytics**: Track delivery, open rates, and user engagement
- **Batched Delivery**: Optimized for large-scale notification campaigns

For detailed implementation, see the [Push Notification Guide](/docs/push-notification-guide.md).

## 🔄 Webhooks System

```mermaid
sequenceDiagram
    participant Backend as Backend Server
    participant EventBus as Event Bus
    participant WebhookService as Webhook Service
    participant Queue as Message Queue
    participant External as External Systems
    
    Backend->>EventBus: Emit Event
    EventBus->>WebhookService: Process Event
    WebhookService->>WebhookService: Match Event to Subscriptions
    WebhookService->>Queue: Queue Webhook Delivery
    Queue->>External: HTTP POST Payload
    External->>Queue: Response (200 OK)
    Queue->>WebhookService: Delivery Status
    WebhookService->>Backend: Update Webhook Log
```

The webhooks system enables real-time integration with external systems through:

- **Event-Based Triggers**: Webhooks triggered by system events (user registration, content creation, etc.)
- **Customizable Subscriptions**: Subscribe to specific event types
- **Secure Delivery**: Payload signing for verification
- **Reliable Delivery**: Automatic retries with exponential backoff
- **Delivery Logging**: Comprehensive logs for debugging and auditing
- **Rate Limiting**: Protection against excessive webhook traffic
- **Webhook Management API**: Create, update, and delete webhook subscriptions

For detailed implementation, see the [Webhooks Guide](/docs/webhooks-guide.md).

## ⚙️ Workflow Engine

```mermaid
graph TD
    Trigger[Event Trigger] --> WorkflowEngine[Workflow Engine]
    WorkflowEngine --> ActionExecutor[Action Executor]
    WorkflowEngine --> ConditionEvaluator[Condition Evaluator]
    
    subgraph Actions
        ContentGeneration[Content Generation]
        NotificationSending[Notification Sending]
        ReportGeneration[Report Generation]
        DataProcessing[Data Processing]
        ExternalIntegration[External Integration]
    end
    
    subgraph Conditions
        TimeCondition[Time-based]
        DataCondition[Data-based]
        UserCondition[User-based]
        EventCondition[Event-based]
    end
    
    ActionExecutor --> Actions
    ConditionEvaluator --> Conditions
    
    WorkflowEngine --> WorkflowStorage[Workflow Storage]
    WorkflowEngine --> ExecutionLog[Execution Log]
```

The workflow engine automates complex business processes through:

- **Visual Workflow Designer**: Create workflows without coding
- **Multiple Trigger Types**: Schedule, event, API, and data triggers
- **Conditional Logic**: Complex branching based on data conditions
- **Action Library**: Pre-built actions for common tasks
- **Custom Actions**: Extend with custom JavaScript actions
- **Error Handling**: Configurable error handling and retries
- **Execution Logging**: Detailed logs for debugging and auditing
- **Versioning**: Track changes to workflow definitions

Common workflow types include:

1. **Content Generation Workflows**: Automatically generate daily horoscopes and monthly reports
2. **User Onboarding Workflows**: Guide new users through the setup process
3. **Subscription Management Workflows**: Handle subscription changes and renewals
4. **Report Generation Workflows**: Create personalized business analysis reports

For detailed implementation, see the [Workflows Guide](/docs/workflows-guide.md).

## 📊 Analytics System

```mermaid
flowchart TD
    MobileApp[Mobile App] -->|Track Event| EventCollection[Event Collection API]
    SAP[Super Admin Panel] -->|View Reports| AnalyticsDashboard[Analytics Dashboard]
    
    EventCollection --> EventProcessing[Event Processing]
    EventProcessing --> EventStorage[Event Storage]
    EventStorage --> AnalyticsEngine[Analytics Engine]
    AnalyticsEngine --> AnalyticsDashboard
    
    subgraph Event Types
        UserEvents[User Events]
        ContentEvents[Content Events]
        BusinessEvents[Business Events]
        SubscriptionEvents[Subscription Events]
    end
    
    subgraph Analytics Features
        Segmentation[User Segmentation]
        Funnels[Conversion Funnels]
        Retention[Retention Analysis]
        ABTesting[A/B Testing]
    end
    
    Event Types --> EventCollection
    AnalyticsEngine --> AnalyticsFeatures
```

The analytics system provides comprehensive insights into user behavior and application performance through:

- **Event Tracking**: Track user actions and system events
- **User Segmentation**: Analyze behavior across different user segments
- **Conversion Funnels**: Track user journey through critical paths
- **Retention Analysis**: Measure user engagement over time
- **A/B Testing Framework**: Test different features and content variations
- **Custom Reports**: Generate tailored reports for specific business questions
- **Real-time Dashboard**: Monitor key metrics in real-time
- **Export Capabilities**: Export data for external analysis

The A/B testing framework enables:

1. **Feature Testing**: Test new features with a subset of users
2. **Content Optimization**: Test different content variations
3. **UI/UX Improvements**: Test different user interface designs
4. **Pricing Strategies**: Test different pricing models and subscription tiers

For detailed implementation, see the [Analytics System Guide](/docs/analytics-system.md).

## 🔌 Integration Points

```mermaid
flowchart TD
    Backend[Corp Astro Backend Server]
    
    subgraph External Components
        AstroEngine[Astro Engine]
        AstroRatan[Astro Ratan AI]
        SAP[Super Admin Panel]
    end
    
    subgraph Integration Methods
        REST[REST APIs]
        Webhooks[Webhooks]
        Queue[Message Queue]
        SDK[Client SDKs]
    end
    
    Backend <--> REST
    Backend <--> Webhooks
    Backend <--> Queue
    Backend <--> SDK
    
    REST <--> AstroEngine
    REST <--> SAP
    Webhooks <--> SAP
    Queue <--> AstroRatan
    SDK <--> MobileApp[Mobile App]
```

### Astro Engine Integration

The Corp Astro Backend Server integrates with the Astro Engine for astrological calculations:

- **Chart Generation**: Request natal, transit, and composite charts
- **Prediction Calculations**: Generate predictions based on transits and progressions
- **Dasha Calculations**: Calculate Vimshottari Dasha periods
- **Compatibility Analysis**: Calculate business compatibility between entities

Example integration code:

```typescript
// Example: Requesting a business natal chart from Astro Engine
async function generateBusinessChart(businessId: string): Promise<ChartData> {
  const business = await Business.findByPk(businessId);
  
  if (!business) {
    throw new Error('Business not found');
  }
  
  const chartRequest = {
    entity_type: 'business',
    date: business.registration_date,
    time: business.registration_time,
    location: business.registration_place,
    options: {
      house_system: 'whole_sign',
      zodiac_type: 'sidereal',
      ayanamsa: 'lahiri'
    }
  };
  
  const response = await axios.post(
    `${process.env.ASTRO_ENGINE_URL}/api/charts/generate`,
    chartRequest,
    {
      headers: {
        'Authorization': `Bearer ${process.env.ASTRO_ENGINE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data;
}
```

### Astro Ratan AI Integration

The backend server integrates with Astro Ratan AI for personalized astrological guidance:

- **Content Generation**: Generate personalized horoscopes and reports
- **Business Insights**: Generate business-specific astrological insights
- **User Queries**: Process natural language queries about astrological matters
- **Personalized Recommendations**: Generate tailored recommendations based on charts

Example integration code:

```typescript
// Example: Generating personalized content with Astro Ratan AI
async function generatePersonalizedContent(
  userId: string,
  contentType: string
): Promise<string> {
  const user = await User.findByPk(userId, {
    include: [Business, UserPreferences]
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Get user's chart from Astro Engine
  const userChart = await astroEngineService.getUserChart(userId);
  
  // Get current transits
  const currentTransits = await astroEngineService.getCurrentTransits();
  
  // Prepare context for AI
  const context = {
    user_data: {
      subscription_tier: user.subscription_tier,
      preferences: user.UserPreferences
    },
    business_data: user.Business ? {
      name: user.Business.name,
      industry: user.Business.industry
    } : null,
    astrological_data: {
      natal_chart: userChart,
      current_transits: currentTransits
    },
    content_type: contentType
  };
  
  // Request content from Astro Ratan AI
  const response = await axios.post(
    `${process.env.ASTRO_RATAN_URL}/api/generate`,
    context,
    {
      headers: {
        'Authorization': `Bearer ${process.env.ASTRO_RATAN_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data.content;
}
```

### Super Admin Panel (SAP) Integration

The backend server integrates with the Super Admin Panel for administration and analytics:

- **User Management**: Manage user accounts and subscriptions
- **Content Management**: Create and manage content
- **Analytics Dashboard**: View analytics data and reports
- **A/B Test Management**: Create and monitor A/B tests
- **System Configuration**: Configure system settings

For detailed implementation of all integration points, see the [Integration Guide](/docs/integration-guide.md).

## 🗄️ Database Schema

```mermaid
erDiagram
    USERS ||--o{ USER_DEVICES : has
    USERS ||--o{ BUSINESSES : owns
    USERS ||--o{ SUBSCRIPTIONS : has
    USERS ||--o{ USER_PREFERENCES : has
    BUSINESSES ||--o{ BUSINESS_ANALYSES : has
    USERS ||--o{ REPORTS : receives
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ ANALYTICS_EVENTS : generates
    REPORTS ||--o{ REPORT_SECTIONS : contains
    ANALYTICS_EVENTS ||--o{ EVENT_PROPERTIES : has
    USERS ||--o{ AB_TEST_ASSIGNMENTS : participates
    AB_TESTS ||--o{ AB_TEST_VARIANTS : has
    AB_TESTS ||--o{ AB_TEST_ASSIGNMENTS : assigns
    WEBHOOKS ||--o{ WEBHOOK_DELIVERIES : triggers
    WORKFLOWS ||--o{ WORKFLOW_EXECUTIONS : executes
    WORKFLOW_EXECUTIONS ||--o{ WORKFLOW_EXECUTION_STEPS : contains
```

The Corp Astro Backend Server uses PostgreSQL as its primary database with a well-structured schema:

### Core Tables

- **users**: Stores user account information and authentication details
- **businesses**: Stores business profiles for corporate astrology
- **subscriptions**: Tracks user subscription plans and billing
- **reports**: Stores generated astrological reports

### Feature-Specific Tables

- **analytics_events**: Stores user behavior and system events
- **notifications**: Tracks push notifications sent to users
- **webhooks**: Stores webhook configurations and delivery logs
- **workflows**: Stores workflow definitions and execution logs

For a complete database schema with all tables, relationships, and indexes, see the [Database Schema Documentation](/docs/database-schema.md).

## 🌐 API Reference

```mermaid
graph TD
    subgraph "API Categories"
        Auth[Authentication API]
        User[User API]
        Content[Content API]
        Business[Business API]
        Analytics[Analytics API]
        Notification[Notification API]
        Webhook[Webhook API]
        Integration[Integration API]
    end
    
    Client[Client Applications] --> Auth
    Client --> User
    Client --> Content
    Client --> Business
    Client --> Analytics
    Client --> Notification
    Client --> Webhook
    Client --> Integration
```

The Corp Astro Backend Server provides a comprehensive set of RESTful APIs:

### Authentication API

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and get JWT
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `GET /api/auth/me` - Get current user information

### Content API

- `GET /api/content/horoscopes/daily` - Get daily horoscope
- `GET /api/content/horoscopes/monthly` - Get monthly horoscope
- `GET /api/content/reports` - List available reports
- `GET /api/content/reports/:id` - Get specific report

### Business API

- `GET /api/business/profile` - Get business profile
- `POST /api/business/profile` - Create business profile
- `PUT /api/business/profile` - Update business profile
- `GET /api/business/analysis` - Get business analysis

### Analytics API

- `POST /api/analytics/events` - Track analytics event
- `GET /api/analytics/dashboard` - Get analytics dashboard data
- `GET /api/analytics/reports` - Get analytics reports

For a complete API reference with all endpoints, request/response formats, and examples, see the [API Reference Documentation](/docs/api-reference.md).

#### Feature Implementation Status

```mermaid
gantt
    title Feature Implementation Status
    dateFormat  YYYY-MM-DD
    section Core Features
    Content Generation System       :done, 2025-01-15, 2025-04-01
    Subscription Management         :done, 2025-01-20, 2025-03-15
    Business Astrology Features     :done, 2025-02-01, 2025-04-15
    Free Tools Backend             :done, 2025-02-15, 2025-04-10
    section Mobile Features
    Mobile API Optimizations        :done, 2025-03-01, 2025-05-01
    Offline Support                 :done, 2025-03-15, 2025-05-10
    Push Notifications              :done, 2025-04-01, 2025-05-15
    section Analytics
    Analytics System                :done, 2025-04-15, 2025-05-17
    A/B Testing Framework           :done, 2025-04-20, 2025-05-17
```

## 🛠️ Architecture

The Corp Astro backend is built with a modular architecture, organized by service domains and following clean architecture principles for separation of concerns. This architecture makes the codebase maintainable, testable, and scalable.

### 🔍 System Architecture Overview

```mermaid
flowchart TD
    Client[Mobile Client] <--> API[API Layer]
    API <--> Auth[Authentication & Authorization]
    API <--> Services[Service Layer]
    Services <--> Models[Data Models]
    Services <--> External[External Services]
    Models <--> DB[(Database)]
    External <--> AstroEngine[Astro Engine]
    External <--> AstroRatan[Astro Ratan AI]
    
    subgraph Backend Server
        API
        Auth
        Services
        Models
    end
```

### 📁 Directory Structure

The codebase follows a domain-driven structure, organized by feature modules and service boundaries:

```
src/
├── config/           # Configuration files
│   ├── database.ts           # Database connection configuration
│   ├── sequelize.config.ts   # Sequelize ORM configuration
│   ├── redis.config.ts       # Redis cache configuration
│   ├── jwt.config.ts         # JWT authentication configuration
│   └── app.config.ts         # Main application configuration
│
├── middleware/       # Global middleware components
│   ├── auth.ts               # Authentication middleware
│   ├── roleCheck.ts          # Role-based authorization
│   ├── rateLimit.ts          # API rate limiting
│   ├── error.middleware.ts   # Error handling middleware
│   └── validation.ts         # Request validation middleware
│
├── database/         # Database management
│   ├── migrations/           # Database schema migrations
│   └── seeders/              # Seed data for development
│
├── models/           # Shared data models
│   └── index.ts              # Model exports
│
├── services/         # Domain-specific services
│   ├── content/              # Content generation and delivery
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Content-specific models
│   │   ├── routes/           # API routes
│   │   └── utils/            # Helper functions
│   │
│   ├── user-management/      # User account management
│   │   ├── controllers/      # User-related controllers
│   │   ├── models/           # User models
│   │   └── routes/           # User API routes
│   │
│   ├── analytics/            # Analytics system
│   │   ├── controllers/      # Analytics endpoints
│   │   ├── models/           # Analytics data models
│   │   ├── utils/            # Analytics utilities
│   │   └── routes/           # Analytics API routes
│   │
│   ├── mobile/               # Mobile-specific features
│   │   ├── middleware/       # Mobile optimizations
│   │   ├── controllers/      # Mobile API controllers
│   │   └── routes/           # Mobile API routes
│   │
│   └── free-tools/           # Free tools implementation
│       ├── controllers/      # Tool controllers
│       ├── utils/            # Tool utilities
│       └── routes/           # Tool API routes
│
├── utils/            # Shared utility functions
│   ├── logger.ts             # Logging utilities
│   ├── errorHandler.ts       # Error handling utilities
│   └── validators.ts         # Input validation helpers
│
├── types/            # TypeScript type definitions
│   ├── models.d.ts           # Model type definitions
│   ├── requests.d.ts         # Request type definitions
│   └── responses.d.ts        # Response type definitions
│
├── app.ts            # Application entry point
└── server.ts         # HTTP server setup
```

### 📚 Code Organization Principles

<table>
  <tr>
    <td width="50%">
      <h4>🔥 Domain-Driven Design</h4>
      <p>The codebase is organized around business domains (content, users, analytics) rather than technical concerns. Each domain has its own models, controllers, and business logic.</p>
    </td>
    <td width="50%">
      <h4>🔨 Separation of Concerns</h4>
      <p>Each component has a single responsibility. Controllers handle HTTP requests, services contain business logic, and models represent data structures.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h4>🔗 Dependency Injection</h4>
      <p>Services and controllers receive their dependencies rather than creating them, making testing and maintenance easier.</p>
    </td>
    <td>
      <h4>💬 Type Safety</h4>
      <p>TypeScript is used throughout the codebase to ensure type safety and provide better developer experience with autocompletion and error checking.</p>
    </td>
  </tr>
</table>
├── services/         # Domain-specific services
│   ├── content/              # Content generation and delivery
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Content-specific models
│   │   ├── routes/           # Content-specific routes
│   │   ├── services/         # Business logic
│   │   └── utils/            # Helper functions
│   ├── mobile/               # Mobile-specific optimizations
│   │   ├── controllers/      # Mobile API controllers
│   │   ├── middleware/       # Mobile-specific middleware
│   │   │   ├── batchProcessing.ts    # Batch request handling
│   │   │   ├── deviceDetection.ts    # Device capability detection
│   │   │   ├── offlineSupport.ts     # Offline data synchronization
│   │   │   └── responseOptimization.ts # Response size optimization
│   │   ├── routes/           # Mobile API routes
│   │   └── utils/            # Mobile-specific utilities
│   │       └── pushNotificationService.ts # Push notification handling
│   ├── performance/          # Performance optimization
│   │   ├── middleware/       # Performance middleware
│   │   └── utils/            # Performance utilities
│   │       ├── cacheManager.ts        # Response caching
│   │       └── rateLimiter.ts         # API rate limiting
│   ├── scalability/          # Scalability services
│   │   ├── config/           # Scalability configuration
│   │   └── utils/            # Scalability utilities
│   │       ├── clusterManager.ts      # Node.js cluster management
│   │       ├── connectionPoolManager.ts # Database connection pooling
│   │       └── monitoring.ts          # System metrics monitoring
│   ├── subscription/         # Subscription management
│   │   ├── controllers/      # Subscription controllers
│   │   ├── models/           # Subscription models
│   │   ├── routes/           # Subscription routes
│   │   └── services/         # Subscription business logic
│   └── user-management/      # User management
│       ├── controllers/      # User controllers
│       ├── models/           # User models
│       ├── routes/           # User routes
│       └── services/         # User business logic
├── types/            # TypeScript type definitions
│   ├── common.ts            # Common type definitions
│   ├── mobile.ts            # Mobile-specific types
│   ├── redis.ts             # Redis-related types
│   ├── business.ts          # Business-related types
│   ├── content.ts           # Content-related types
│   ├── subscription.ts      # Subscription-related types
│   └── index.ts             # Type exports
├── utils/            # Utility functions
│   ├── errorHandler.ts      # Error handling utilities
│   ├── logger.ts            # Logging utilities
│   ├── redisHelper.ts       # Redis helper functions
│   └── swagger.ts           # Swagger documentation
├── __tests__/        # Test files
│   ├── e2e/               # End-to-end tests
│   ├── integration/       # Integration tests
│   ├── unit/              # Unit tests
│   └── utils/             # Test utilities
└── app.ts            # Main application entry point
```

### Key Components

#### Core Services

- **Content Service**: Generates and delivers astrological content
  - Daily horoscopes tailored to user's astrological profile
  - Monthly reports with business insights
  - Business-specific astrological analysis
  - Content caching and delivery optimization

- **Mobile Service**: Provides mobile-specific API optimizations
  - Device detection for adaptive responses
  - Response optimization to reduce data transfer
  - Batch processing for multiple API requests
  - Offline support with data synchronization
  - Push notification management for iOS and Android

- **Performance Service**: Implements performance optimizations
  - Response caching with Redis
  - API rate limiting to prevent abuse
  - Response compression to reduce bandwidth usage
  - Query optimization for database operations

- **Scalability Service**: Manages application scaling
  - Node.js cluster management for multi-core utilization
  - Database connection pooling for efficient resource usage
  - System metrics monitoring for performance tracking
  - Health checks for load balancer integration

- **Subscription Service**: Handles subscription management
  - Subscription plan definition and management
  - User subscription tracking and renewal
  - Payment processing integration
  - Feature access control based on subscription tier

- **User Management Service**: Manages user accounts
  - User registration and authentication
  - Profile management
  - Device tracking
  - Authentication logs

#### Supporting Components

- **TypeScript Type System**: Comprehensive type definitions for improved code quality
  - Common interfaces for shared functionality
  - Service-specific type definitions
  - API request and response typing

- **Error Handling**: Centralized error management
  - Custom error classes with status codes
  - Global error handling middleware
  - Async error catching utilities

- **Middleware**: Request processing pipeline
  - Authentication and authorization
  - Request logging
  - Input validation
  - Error handling

- **Configuration**: Environment-specific settings
  - Database connections
  - Redis cache
  - JWT authentication
  - API documentation
  - Environment variables management

## Mobile API Enhancements

The backend includes several mobile-specific API enhancements to optimize the experience for mobile clients. These enhancements are implemented in the `src/services/mobile` directory.

### Device Detection (`src/services/mobile/middleware/deviceDetection.ts`)

Automatically detects mobile devices and their capabilities based on request headers, allowing for optimized responses based on device characteristics.

#### Key Features

- **Device Type Detection**: Identifies device as phone, tablet, or desktop
- **Operating System Detection**: Recognizes iOS, Android, Windows, and other operating systems
- **Browser Detection**: Identifies browser type and version
- **Screen Dimensions**: Captures screen width, height, and pixel ratio
- **Network Condition Detection**: Identifies network type (WiFi, 5G, 4G, 3G, 2G)
- **Battery Level Monitoring**: Tracks device battery level for power-saving optimizations
- **Low Power Mode Detection**: Identifies when device is in battery-saving mode

#### Implementation Details

```typescript
// Example of device detection middleware usage
app.use(mobileDeviceDetection);

// Access device info in route handlers
app.get('/api/content', (req, res) => {
  const deviceInfo = req.deviceInfo;
  
  // Adapt response based on device capabilities
  if (deviceInfo.isLowBandwidth) {
    // Send optimized response for low bandwidth
  }
});
```

### Response Optimization (`src/services/mobile/middleware/responseOptimization.ts`)

Optimizes API responses for mobile clients to reduce data transfer and improve performance, especially important for devices with limited bandwidth or high data costs.

#### Key Features

- **Field Filtering**: Selectively includes fields based on query parameters
- **Content Pruning**: Removes unnecessary data for mobile clients
- **Image Optimization**: Adjusts image quality and dimensions based on network conditions
- **Response Size Reduction**: Minimizes payload size for faster transfers
- **Content Prioritization**: Delivers critical content first for perceived performance

#### Implementation Details

```typescript
// Example of response optimization
const optimizeForMobile = (content, deviceInfo) => {
  // Base optimization
  const optimized = { ...content };
  
  // Remove verbose fields for mobile
  delete optimized.extendedDescription;
  
  // Optimize images based on network conditions
  if (deviceInfo.isLowBandwidth) {
    optimized.imageUrl = optimized.imageUrl.replace('/full/', '/compressed/');
  }
  
  // Truncate content for low battery devices
  if (deviceInfo.isLowBattery) {
    optimized.content = optimized.content.substring(0, 500);
  }
  
  return optimized;
};
```

### Batch Processing (`src/services/mobile/middleware/batchProcessing.ts`)

Allows mobile clients to send multiple API requests in a single HTTP request, reducing network overhead, connection establishment costs, and battery usage.

#### Key Features

- **Request Batching**: Processes multiple API requests in a single HTTP call
- **Parallel Execution**: Handles batch requests concurrently for efficiency
- **Consolidated Response**: Returns all results in a single response
- **Error Handling**: Manages individual request failures without failing the entire batch
- **Transaction Support**: Optional transactional processing for related operations

#### Implementation Details

```typescript
// Example batch request
// POST /api/mobile/batch
// {
//   "requests": [
//     { "method": "GET", "path": "/api/content/daily-horoscope" },
//     { "method": "GET", "path": "/api/user/profile" },
//     { "method": "POST", "path": "/api/analytics/event", "body": { "event": "app_open" } }
//   ]
// }

// Example batch response
// {
//   "responses": [
//     { "status": 200, "body": { ... daily horoscope data ... } },
//     { "status": 200, "body": { ... user profile data ... } },
//     { "status": 201, "body": { "success": true } }
//   ]
// }
```

### Offline Support (`src/services/mobile/middleware/offlineSupport.ts`)

Provides robust offline support for mobile clients, enabling data synchronization when connectivity is restored.

#### Key Features

- **Data Synchronization**: Bi-directional sync between client and server
- **Conflict Detection**: Identifies and flags conflicting changes
- **Conflict Resolution**: Strategies for resolving data conflicts (server wins, client wins, manual resolution)
- **Differential Updates**: Transfers only changed data to minimize bandwidth usage
- **Timestamp-based Tracking**: Uses timestamps to track changes and determine sync order
- **Batch Synchronization**: Processes multiple changes in a single operation

#### Implementation Details

```typescript
// Example sync request from client after being offline
// POST /api/mobile/sync
// {
//   "lastSyncTimestamp": 1620000000000,
//   "changes": [
//     {
//       "id": "change123",
//       "type": "update",
//       "resourceType": "user_settings",
//       "resourceId": "settings123",
//       "data": { "theme": "dark" },
//       "timestamp": 1620000500000
//     }
//   ]
// }

// Example sync response with server changes and conflict resolution
// {
//   "success": true,
//   "serverChanges": [...],
//   "conflicts": [...],
//   "syncTimestamp": 1620001000000
// }
```

### Push Notifications (`src/services/mobile/utils/pushNotificationService.ts`)

Implements a comprehensive push notification system to keep users engaged and informed about new content and important events.

#### Key Features

- **Multi-Platform Support**: Handles both FCM (Android) and APNS (iOS) notifications
- **Device Token Management**: Registers, stores, and manages device tokens
- **Topic-Based Notifications**: Allows subscribing to specific notification topics
- **Notification Templates**: Pre-defined templates for common notification types
- **Scheduled Notifications**: Support for delayed and recurring notifications
- **Delivery Tracking**: Monitors notification delivery and open rates
- **Personalization**: Customizes notification content based on user preferences

#### Implementation Details

```typescript
// Example of sending a push notification
const sendContentUpdateNotification = async (userId, contentType, contentId) => {
  // Get user's device tokens
  const deviceTokens = await getDeviceTokens(userId);
  
  // Prepare notification payload
  const notification = {
    title: getNotificationTitle(contentType),
    body: getNotificationBody(contentType),
    data: {
      contentType,
      contentId,
      timestamp: Date.now()
    },
    priority: 'high',
    ttl: 3600 // 1 hour
  };
  
  // Send to all user devices
  return Promise.all(deviceTokens.map(token => {
    if (token.platform === 'fcm') {
      return sendFcmNotification(token.token, notification);
    } else if (token.platform === 'apns') {
      return sendApnsNotification(token.token, notification);
    }
    return Promise.resolve({ success: false, error: 'Unknown platform' });
  }));
};
```

### Mobile Configuration Management (`src/services/mobile/config/mobileConfig.ts`)

Provides centralized configuration for mobile-specific features and optimizations.

#### Key Features

- **Device-Specific Settings**: Configuration based on device capabilities
- **Network-Based Optimizations**: Settings for different network conditions
- **Battery Optimization**: Parameters for low battery scenarios
- **Feature Toggles**: Enable/disable mobile features remotely
- **A/B Testing Support**: Configuration for mobile feature experiments

#### Implementation Details

```typescript
// Example mobile configuration
export default {
  deviceAdaptation: {
    lowBatteryThreshold: 20, // Consider low battery when below 20%
    lowBandwidthNetworks: ['2g', '3g'],
    imageQualityFactors: {
      wifi: 90,
      '5g': 80,
      '4g': 70,
      '3g': 50,
      '2g': 30
    }
  },
  offlineSupport: {
    maxOfflineEntries: 1000,
    syncBatchSize: 50,
    conflictResolutionStrategy: 'server-wins'
  },
  batchProcessing: {
    maxBatchSize: 10,
    timeout: 30000 // 30 seconds
  },
  pushNotifications: {
    defaultTTL: 86400, // 24 hours
    defaultPriority: 'high',
    retryAttempts: 3
  }
};
```

## Content Generation System

The content generation system (`src/services/content`) provides personalized astrological content based on user data, business information, and astrological calculations from the Astro Engine.

### Content Types

#### Daily Horoscopes
- Personalized daily predictions based on user's birth chart
- Business-focused insights for the day
- Compatibility guidance with colleagues and partners
- Lucky times, colors, and numbers for business activities

#### Monthly Reports
- Comprehensive monthly astrological forecast
- Business opportunity analysis based on planetary transits
- Strategic planning recommendations aligned with astrological influences
- Key dates for important business decisions

#### Business Insights
- Detailed analysis of business natal chart
- Compatibility assessment with business partners
- Timing recommendations for business initiatives
- Risk assessment based on astrological factors

### Content Generation Process

```mermaid
graph TD
    A[User Request] --> B[Content Type Determination]
    B --> C{Content Type}
    C -->|Daily Horoscope| D[Fetch User Chart Data]
    C -->|Monthly Report| E[Fetch Business Data]
    C -->|Business Insight| F[Fetch Business Chart]
    D --> G[Calculate Current Transits]
    E --> G
    F --> G
    G --> H[Generate Content]
    H --> I[Format for Delivery]
    I --> J[Cache Content]
    J --> K[Deliver to User]
```

### Implementation Details

```typescript
// Example content generation for daily horoscope
async function generateDailyHoroscope(userId: string): Promise<ContentItem> {
  // 1. Get user's birth data
  const user = await userService.getUserProfile(userId);
  
  // 2. Get user's natal chart from Astro Engine
  const natalChart = await astroEngineService.getNatalChart({
    dateOfBirth: user.dateOfBirth,
    timeOfBirth: user.timeOfBirth,
    placeOfBirth: user.placeOfBirth,
    coordinates: user.birthCoordinates
  });
  
  // 3. Calculate current planetary positions
  const currentDate = new Date();
  const transits = await astroEngineService.getTransits({
    natalChart,
    date: currentDate
  });
  
  // 4. Analyze aspects between transit and natal planets
  const aspects = await astroEngineService.calculateAspects({
    natalChart,
    transits
  });
  
  // 5. Generate horoscope content based on aspects
  const content = await contentService.generateHoroscopeContent({
    userId,
    natalChart,
    transits,
    aspects,
    date: currentDate
  });
  
  // 6. Cache the generated content
  await cacheManager.set(
    `horoscope:daily:${userId}:${formatDate(currentDate)}`,
    content,
    86400 // Cache for 24 hours
  );
  
  return content;
}
```

### Content Caching Strategy

The system implements a sophisticated caching strategy to balance freshness and performance:

- **Daily Horoscopes**: Cached for 24 hours with user-specific keys
- **Monthly Reports**: Cached for 7 days with business-specific keys
- **Business Insights**: Cached for 30 days with analysis-specific keys
- **Cache Invalidation**: Automatic invalidation on significant planetary events
- **Staggered Generation**: Pre-generates content during off-peak hours

### Integration with Astro Engine

The content generation system integrates with the Astro Engine for astrological calculations:

- **Chart Calculations**: Natal, transit, progressed, and composite charts
- **Planetary Positions**: Precise positions including retrograde status
- **House Systems**: Primarily uses Whole Sign house system
- **Ayanamsa**: Uses Lahiri ayanamsa for sidereal calculations
- **Aspects**: Calculates major and minor aspects between planets

### Personalization Engine

Content is personalized based on multiple factors:

- **User's Natal Chart**: Birth time, date, and location
- **Business Details**: Founding date, location, and industry
- **User Preferences**: Topics of interest and notification settings
- **Interaction History**: Previously viewed content and engagement patterns
- **Subscription Tier**: Access to premium content features

## Subscription Tier System

The backend implements a tiered subscription approach (`src/services/subscription`) that manages different levels of access to features and content based on the user's subscription status.

### Subscription Tiers

#### Free Tier
- **Features**: 
  - Access to basic free tools (name number analysis, tagline analysis, brand color analysis)
  - Limited daily horoscope content
  - Basic user profile
  - Ad-supported experience
- **Limitations**:
  - No access to detailed business insights
  - No access to Astro Ratan AI chat
  - Limited content refresh frequency
  - No personalized monthly reports

#### Subscription Tier
- **Features**:
  - All free tier features
  - Personalized daily horoscopes
  - Monthly business astrological reports
  - Do's and don'ts based on astrological influences
  - Astro Ratan AI chat access (limited queries per day)
  - Ad-free experience
- **Pricing**: Monthly, quarterly, and annual subscription options
- **Benefits**: Continuous access to personalized astrological guidance for business

#### Premium Tier
- **Features**:
  - All subscription tier features
  - Unlimited Astro Ratan AI chat access
  - Detailed business insights and analysis
  - Appointments with human astrology specialists
  - Priority support
  - Advanced business compatibility analysis
  - Strategic planning based on astrological timing
- **Pricing**: Monthly and annual premium subscription options
- **Benefits**: Comprehensive astrological guidance for critical business decisions

### Subscription Management

```mermaid
graph TD
    A[User] -->|Selects Plan| B[Subscription Service]
    B -->|Processes Payment| C[Payment Gateway]
    C -->|Payment Success| D[Create Subscription]
    C -->|Payment Failure| E[Error Handling]
    D --> F[Update User Permissions]
    D --> G[Schedule Renewal]
    G -->|Renewal Time| H{Auto-Renew?}
    H -->|Yes| B
    H -->|No| I[Expiration Notice]
    I --> J[Downgrade to Free]
```

### Implementation Details

```typescript
// Example subscription service implementation
export class SubscriptionService {
  // Create a new subscription
  async createSubscription(userId: string, planId: string): Promise<UserSubscription> {
    // Get subscription plan details
    const plan = await this.getPlanById(planId);
    
    // Process payment
    const paymentResult = await this.paymentService.processPayment({
      userId,
      amount: plan.price,
      currency: plan.currency,
      description: `${plan.name} Subscription`
    });
    
    if (!paymentResult.success) {
      throw new AppError({
        message: 'Payment processing failed',
        statusCode: 400
      });
    }
    
    // Calculate subscription dates
    const startDate = new Date();
    const endDate = this.calculateEndDate(startDate, plan.billingCycle);
    
    // Create subscription record
    const subscription = await this.subscriptionModel.create({
      userId,
      planId,
      tier: plan.tier,
      startDate,
      endDate,
      autoRenew: true,
      status: SubscriptionStatus.ACTIVE,
      paymentMethod: paymentResult.paymentMethod,
      lastPaymentDate: startDate,
      nextPaymentDate: endDate
    });
    
    // Update user permissions
    await this.updateUserPermissions(userId, plan.tier);
    
    // Create subscription history record
    await this.subscriptionHistoryModel.create({
      userId,
      planId,
      action: SubscriptionAction.SUBSCRIBE,
      newTier: plan.tier,
      amount: plan.price,
      currency: plan.currency,
      paymentMethod: paymentResult.paymentMethod,
      timestamp: new Date()
    });
    
    // Schedule renewal notification
    await this.scheduleRenewalNotification(userId, subscription.id, endDate);
    
    return subscription;
  }
  
  // Additional methods for subscription management...
}
```

### Feature Access Control

The system implements a feature access control mechanism that determines what features and content a user can access based on their subscription tier:

```typescript
// Example feature access check
export async function hasFeatureAccess(
  userId: string,
  featureId: string
): Promise<boolean> {
  // Get user's active subscription
  const subscription = await getActiveSubscription(userId);
  
  // Default to free tier if no active subscription
  const tier = subscription?.tier || SubscriptionTier.FREE;
  
  // Get feature access configuration
  const featureAccess = await getFeatureAccess(featureId, tier);
  
  // Check if user has access to the feature
  if (featureAccess.accessLevel === 'none') {
    return false;
  }
  
  // For limited access, check usage limits
  if (featureAccess.accessLevel === 'limited') {
    const usage = await getFeatureUsage(userId, featureId);
    return usage < featureAccess.limitValue;
  }
  
  // Full access
  return true;
}
```

### Subscription Analytics

The system tracks key subscription metrics to monitor business performance:

- **Conversion Rate**: Percentage of free users converting to paid tiers
- **Churn Rate**: Percentage of subscribers canceling their subscription
- **Lifetime Value (LTV)**: Average revenue generated by a subscriber
- **Monthly Recurring Revenue (MRR)**: Predictable monthly revenue from subscriptions
- **Upgrade/Downgrade Rates**: Movement between subscription tiers

### Payment Processing

The subscription system integrates with payment processors to handle subscription payments:

- **Payment Methods**: Credit/debit cards, digital wallets, and local payment methods
- **Recurring Billing**: Automatic charging for subscription renewals
- **Failed Payment Handling**: Retry logic and grace periods for failed payments
- **Refunds and Cancellations**: Processing refunds and early cancellations
- **Invoicing**: Generating and sending invoices for subscription payments

## API Documentation

API documentation is available through Swagger UI at `/api-docs` when the server is running. The documentation includes:

- Endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/corp-astro-server.git
   cd corp-astro-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration.

5. Build the application:
   ```bash
   npm run build
   ```

6. Start the server:
   ```bash
   npm start
   ```

For development:
```bash
npm run dev
```

### Testing

Run tests:
```bash
npm test
```

Run specific test categories:
```bash
npm run test:unit     # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:mobile   # Run mobile service tests
npm run test:content  # Run content service tests
```

Generate test coverage report:
```bash
npm run test:coverage
```

## Integration Points

### Astro Engine Integration

The backend server integrates with the Astro Engine, which is responsible for:

- Chart calculations (natal, transit, synastry, composite, progressed)
- Planetary position calculations
- House system (Whole Sign)
- Ayanamsa (Lahiri)
- Aspect calculations
- Transit analysis
- Predictive algorithms (Dashas, progressions)

### Astro Ratan Integration

The backend provides integration points for Astro Ratan, an AI agent built using OpenAI Assistant APIs, which provides:

- Conversational interface for astrological queries
- Access to astrological knowledge base
- Personalized astrological insights

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get authentication token
- `POST /api/auth/refresh` - Refresh authentication token

### Content

- `GET /api/content/daily-horoscope` - Get daily horoscope
- `GET /api/content/monthly-report` - Get monthly report
- `GET /api/content/business-insight/:businessId` - Get business insight
- `GET /api/content/free-tools/:toolName` - Use a free astrological tool

### Mobile-Specific

- `POST /api/mobile/device/register` - Register a device for push notifications
- `POST /api/mobile/device/unregister` - Unregister a device
- `GET /api/mobile/config` - Get mobile-specific configuration
- `GET /api/mobile/profile` - Get user profile with mobile-optimized data
- `GET /api/mobile/content/:contentType` - Get mobile-optimized content
- `POST /api/mobile/batch` - Process multiple API requests in a single batch
- `GET /api/mobile/sync` - Get changes since last sync
- `POST /api/mobile/sync` - Submit client changes
- `PUT /api/mobile/sync` - Resolve sync conflicts

## Performance Optimization

The backend includes several performance optimizations:

- **Caching**: Redis-based caching for API responses and database queries
- **Rate Limiting**: Prevents abuse and ensures fair resource allocation
- **Compression**: Reduces response size for faster data transfer
- **Connection Pooling**: Optimizes database connections
- **Query Optimization**: Improves database query performance

## Security

The backend implements several security measures:

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Prevents injection attacks
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: HTTP security headers

## Error Handling

The backend implements a centralized error handling system:

- Consistent error response format
- Detailed error logging
- Error categorization (client errors, server errors)
- Custom error types for specific scenarios

## Monitoring and Logging

The backend includes comprehensive monitoring and logging:

- Request logging with response times
- Error logging with stack traces
- Performance metrics collection
- Health check endpoints

## TypeScript Type System

The Corp Astro Server uses a comprehensive TypeScript type system to ensure code quality, improve developer experience, and catch potential issues at compile time.

### Type Definitions

All type definitions are organized in the `src/types` directory:

```
src/types/
├── common.ts       # Common interfaces and types used across the application
├── mobile.ts       # Mobile-specific types (device info, batch processing, etc.)
├── redis.ts        # Redis-related types for caching and data storage
├── business.ts     # Business entity and analysis types
├── content.ts      # Content generation and delivery types
├── subscription.ts # Subscription management types
└── index.ts        # Exports all types for easier imports
```

### Key Type Definitions

#### Request and Response Types

```typescript
// Extended Request interfaces
export interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    name?: string;
    role?: string;
    subscription?: {
      tier: string;
      expiresAt: Date;
    };
  };
}

export interface DeviceAwareRequest extends AuthenticatedRequest {
  deviceInfo: MobileDeviceInfo;
}

// API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | Error;
  timestamp?: number;
}
```

#### Mobile Device Information

```typescript
export interface MobileDeviceInfo {
  isMobile: boolean;
  deviceType: 'phone' | 'tablet' | 'desktop' | 'unknown';
  os: 'ios' | 'android' | 'windows' | 'other' | 'unknown';
  osVersion: string;
  browser: string;
  browserVersion: string;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  networkType: 'wifi' | '5g' | '4g' | '3g' | '2g' | 'unknown';
  batteryLevel: number | null;
  isLowBandwidth: boolean;
  isLowBattery: boolean;
  appVersion: string;
}
```

#### Error Handling Types

```typescript
export interface AppErrorOptions {
  message: string;
  statusCode?: number;
  isOperational?: boolean;
  stack?: string;
}

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(options: AppErrorOptions) {
    super(options.message);
    this.statusCode = options.statusCode || 500;
    this.isOperational = options.isOperational !== undefined ? options.isOperational : true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### Benefits of the Type System

- **Compile-time Error Detection**: Catches type-related errors before runtime
- **Improved Code Documentation**: Types serve as self-documenting code
- **Enhanced IDE Support**: Better autocompletion and inline documentation
- **Safer Refactoring**: Type checking ensures refactoring doesn't break existing code
- **Reduced Runtime Errors**: Many potential bugs are caught during development

## Development Workflow

The Corp Astro Server follows a structured development workflow to ensure code quality and maintainability.

### Setup Development Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/corp-astro-server.git
   cd corp-astro-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env file with your local configuration
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

### Development Cycle

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement changes**: Follow the code style and architecture patterns

3. **Run TypeScript compiler**:
   ```bash
   npm run build
   ```

4. **Run tests**:
   ```bash
   npm test
   # Or run specific test categories
   npm run test:unit
   npm run test:integration
   npm run test:e2e
   ```

5. **Lint your code**:
   ```bash
   npm run lint
   # Fix auto-fixable issues
   npm run lint:fix
   ```

6. **Commit changes**:
   ```bash
   git add .
   git commit -m 'Add feature: your feature description'
   ```

7. **Push changes**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**: Submit your changes for review

### Code Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Peer Review**: At least one team member reviews the code
3. **Feedback Incorporation**: Address review comments
4. **Final Approval**: Maintainer approves and merges the changes

### Deployment Pipeline

1. **Development**: Local development and testing
2. **Staging**: Deployment to staging environment for QA
3. **Production**: Deployment to production environment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Proprietary - All rights reserved

## Contact

Corp Astro Support - support@corp-astro.com

## GitHub Repository Setup

The Corp Astro Server codebase is hosted on GitHub at [https://github.com/Project-Corp-Astro/Corp_Astro_Server_Trial](https://github.com/Project-Corp-Astro/Corp_Astro_Server_Trial). The repository has been configured with industry best practices for collaborative development.

### Repository Structure

```
├── .github/                # GitHub-specific files
│   ├── ISSUE_TEMPLATE/     # Templates for different issue types
│   ├── workflows/          # GitHub Actions CI/CD workflows
│   ├── CODEOWNERS          # Code ownership definitions
│   ├── CODE_OF_CONDUCT.md  # Community guidelines
│   ├── CONTRIBUTING.md     # Contribution guidelines
│   ├── PULL_REQUEST_TEMPLATE.md # PR template
│   ├── SECURITY.md         # Security policy
│   └── project-board-setup.md # Project board configuration
├── docs/                   # Documentation files
│   ├── deployment-guide.md # Deployment instructions
│   ├── mobile-api-guide.md # Mobile API documentation
│   └── ...                 # Other documentation files
├── src/                    # Source code
│   ├── config/             # Configuration files
│   ├── database/           # Database migrations and seeders
│   ├── services/           # Service-specific code
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── .dockerignore           # Docker ignore file
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore file
├── .sequelizerc            # Sequelize configuration
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
├── ecosystem.config.js     # PM2 configuration
├── deploy-config.js        # Deployment configuration
├── package.json            # Node.js dependencies
└── tsconfig.json           # TypeScript configuration
```

### CI/CD Workflows

The repository includes two main GitHub Actions workflows:

1. **CI Workflow** (`/.github/workflows/ci.yml`)
   - Triggered on pull requests and pushes to main branch
   - Runs on multiple Node.js versions (16.x, 18.x)
   - Installs dependencies, builds the project, runs linting and tests
   - Uploads test coverage reports

2. **Deployment Workflow** (`/.github/workflows/deploy.yml`)
   - Triggered on pushes to main branch and manual triggers
   - Builds and tests the application
   - Deploys to staging environment
   - Sends notifications about deployment status

### Issue Management

The repository includes several templates and configurations for issue management:

1. **Issue Templates**
   - Bug Report Template (`/.github/ISSUE_TEMPLATE/bug_report.md`)
   - Feature Request Template (`/.github/ISSUE_TEMPLATE/feature_request.md`)
   - Documentation Update Template (`/.github/ISSUE_TEMPLATE/documentation_update.md`)

2. **Project Board Setup** (`/.github/project-board-setup.md`)
   - Development Roadmap board for tracking overall progress
   - Bug Tracking board for managing bugs
   - Release Planning board for planning releases

3. **Labels and Milestones**
   - Predefined labels for categorizing issues
   - Milestone configuration for tracking progress towards specific goals

### Contribution Guidelines

The repository includes several files to facilitate collaboration:

- **CODEOWNERS** (`/.github/CODEOWNERS`): Defines code ownership and review requirements
- **CONTRIBUTING.md** (`/.github/CONTRIBUTING.md`): Comprehensive guide for contributors
- **CODE_OF_CONDUCT.md** (`/.github/CODE_OF_CONDUCT.md`): Community guidelines
- **SECURITY.md** (`/.github/SECURITY.md`): Instructions for reporting security vulnerabilities
- **Pull Request Template** (`/.github/PULL_REQUEST_TEMPLATE.md`): Standardized format for pull requests

### Database Configuration

The repository includes a complete database migration system using Sequelize:

1. **Migration Files** (`/src/database/migrations/`)
   - Initial schema creation with tables for users, subscriptions, content, etc.
   - Indexes for performance optimization

2. **Seed Files** (`/src/database/seeders/`)
   - Initial data for testing and development
   - Sample users, businesses, subscription tiers, and content templates

3. **Database Configuration** (`/src/config/database.js`)
   - Environment-specific database connection settings
   - Configuration for development, test, staging, and production environments

4. **NPM Scripts**
   - `npm run db:migrate`: Run pending migrations
   - `npm run db:seed`: Seed the database with initial data
   - `npm run db:reset`: Reset the database and run all migrations and seeders

### Deployment Configuration

The repository includes several files for deployment:

1. **Docker Configuration**
   - `Dockerfile`: Multi-stage build for production deployment
   - `docker-compose.yml`: Local development environment with PostgreSQL and Redis

2. **PM2 Configuration** (`ecosystem.config.js`)
   - Process management for production deployment
   - Cluster mode for horizontal scaling
   - Environment-specific settings

3. **Deployment Guide** (`/docs/deployment-guide.md`)
   - Instructions for deploying to different environments
   - Manual and automated deployment procedures
   - Rollback procedures

4. **Environment Configuration** (`deploy-config.js`)
   - Settings for development, testing, staging, and production environments
   - Database, Redis, scaling, and logging configuration

### Repository Secrets

The repository requires several secrets for CI/CD workflows:

1. **CI/CD Workflow Secrets**
   - `CODECOV_TOKEN`: For uploading test coverage reports
   - `DEPLOY_KEY`: SSH key for deployment
   - `STAGING_SERVER`: Staging server hostname
   - `SLACK_WEBHOOK`: Webhook URL for Slack notifications

2. **Environment-Specific Secrets**
   - Database credentials for different environments
   - Redis credentials for different environments
   - JWT secrets for authentication

Detailed instructions for setting up these secrets are available in `/.github/repository-secrets-setup.md`.

## Analytics System

The Corp Astro Analytics System is a comprehensive backend infrastructure for tracking user behavior, feature usage, and business metrics for the mobile application. It is designed to collect, store, and process data to drive business decisions and improve user experience.

### Key Features

- **Event Tracking**: Records user interactions and app usage events
- **Feature Usage Analysis**: Monitors which features are most popular and how they're used
- **User Journey Tracking**: Follows users through defined flows to identify bottlenecks
- **A/B Testing Framework**: Tests different variants to optimize user experience
- **Offline Support**: Stores analytics events when offline and syncs when connection is restored
- **Batch Processing**: Efficiently processes multiple events in a single request
- **Privacy-Focused**: Implements data minimization and anonymization techniques

### Architecture

The analytics system consists of the following components:

1. **Database Tables**: Store analytics events, user journeys, feature usage, and A/B test data
2. **API Endpoints**: Collect analytics data from the mobile application
3. **Processing Services**: Process and aggregate analytics data
4. **SDK**: Simplifies integration with the mobile application

### Integration

#### Mobile Application Integration

The mobile application should use the Analytics SDK to interact with the analytics system. The SDK provides methods for:

- Tracking events and user interactions
- Recording feature usage
- Managing user journeys
- Participating in A/B tests

Example code for the mobile app integration can be found at:
`/src/services/analytics/examples/mobile-sdk-integration.ts`

#### Super Admin Panel (SAP) Integration

The Super Admin Panel should use the dashboard data endpoints to retrieve analytics data for visualization. These endpoints provide all the necessary data for building comprehensive dashboards and reports.

The SAP should implement its own dashboard components for visualizing the analytics data. The backend only provides the data through API endpoints; it does not include any frontend visualization components.

Detailed API documentation is available at:
`/docs/analytics-api-documentation.md`

### Analytics API Endpoints

- `POST /api/analytics/track`: Track a general analytics event
- `POST /api/analytics/feature-usage`: Track feature usage
- `POST /api/analytics/journey`: Track user journey progress
- `POST /api/analytics/ui-interaction`: Track UI interaction
- `POST /api/analytics/batch`: Batch track multiple events
- `POST /api/analytics/ab-test/convert`: Track A/B test conversion
- `GET /api/analytics/ab-test/variant/:testName`: Get assigned variant for a user
- `GET /api/analytics/dashboard/metrics`: Get overview metrics
- `GET /api/analytics/dashboard/journeys`: Get user journey metrics
- `GET /api/analytics/dashboard/ab-tests/:testName`: Get A/B test results

For more details, see the [Analytics System Documentation](/docs/analytics-system-readme.md).

## Content Generation System

The Corp Astro Content Generation System is a comprehensive backend infrastructure for delivering daily horoscopes and monthly reports. It is designed to provide personalized content to users based on their subscription tier.

### Key Features

- **Content Item Management**: Stores and manages content items, including horoscopes and reports
- **User Content Interactions**: Tracks user interactions with content, including favoriting and rating
- **Business Profile Management**: Stores and manages business profiles, including subscription tiers and content access
- **Personalized Content Delivery**: Delivers personalized content to users based on their subscription tier and content interactions

### Architecture

The content generation system consists of the following components:

1. **Database Tables**: Store content items, user content interactions, and business profiles
2. **API Endpoints**: Provide access to content items and user content interactions
3. **Content Processing Services**: Process and aggregate content data
4. **SDK**: Simplifies integration with the mobile application

### Integration

#### Mobile Application Integration

The mobile application should use the Content SDK to interact with the content generation system. The SDK provides methods for:

- Retrieving personalized content
- Favoriting and rating content
- Managing user content interactions

Example code for the mobile app integration can be found at:
`/src/services/content/examples/mobile-sdk-integration.ts`

#### Super Admin Panel (SAP) Integration

The Super Admin Panel should use the content management endpoints to manage content items and user content interactions. These endpoints provide all the necessary data for building comprehensive content management tools.

The SAP should implement its own content management components for visualizing and managing content data. The backend only provides the data through API endpoints; it does not include any frontend visualization components.

Detailed API documentation is available at:
`/docs/content-api-documentation.md`

### Content API Endpoints

- `GET /api/content/items`: Get a list of content items
- `GET /api/content/items/:id`: Get a specific content item
- `POST /api/content/items`: Create a new content item
- `PUT /api/content/items/:id`: Update a content item
- `DELETE /api/content/items/:id`: Delete a content item
- `GET /api/content/user-interactions`: Get a list of user content interactions
- `POST /api/content/user-interactions`: Create a new user content interaction

For more details, see the [Content Generation System Documentation](/docs/content-generation-system-readme.md).

## Free Tools Backend

The Corp Astro Free Tools Backend is a comprehensive backend infrastructure for providing free tools to users, including numerology services for business name and tagline analysis.

### Key Features

- **Numerology Service**: Provides numerology analysis for business names and taglines
- **Compatibility Checking**: Checks compatibility between business names and taglines
- **Interpretations and Implications**: Provides detailed interpretations and business implications for numerology results

### Architecture

The free tools backend consists of the following components:

1. **Database Tables**: Store numerology data and compatibility results
2. **API Endpoints**: Provide access to numerology services and compatibility checking
3. **Numerology Processing Services**: Process and aggregate numerology data
4. **SDK**: Simplifies integration with the mobile application

### Integration

#### Mobile Application Integration

The mobile application should use the Free Tools SDK to interact with the free tools backend. The SDK provides methods for:

- Retrieving numerology analysis
- Checking compatibility between business names and taglines
- Managing user interactions with free tools

Example code for the mobile app integration can be found at:
`/src/services/free-tools/examples/mobile-sdk-integration.ts`

#### Super Admin Panel (SAP) Integration

The Super Admin Panel should use the free tools management endpoints to manage numerology data and compatibility results. These endpoints provide all the necessary data for building comprehensive free tools management tools.

The SAP should implement its own free tools management components for visualizing and managing free tools data. The backend only provides the data through API endpoints; it does not include any frontend visualization components.

Detailed API documentation is available at:
`/docs/free-tools-api-documentation.md`

### Free Tools API Endpoints

- `GET /api/free-tools/numerology`: Get numerology analysis for a business name or tagline
- `POST /api/free-tools/numerology`: Create a new numerology analysis
- `GET /api/free-tools/compatibility`: Get compatibility results between business names and taglines
- `POST /api/free-tools/compatibility`: Create a new compatibility check

For more details, see the [Free Tools Backend Documentation](/docs/free-tools-backend-readme.md).

## Mobile Analytics API

The Corp Astro Mobile Analytics API is a comprehensive backend infrastructure for tracking user behavior, feature usage, and business metrics for the mobile application.

### Key Features

- **Event Tracking**: Records user interactions and app usage events
- **Feature Usage Analysis**: Monitors which features are most popular and how they're used
- **User Journey Tracking**: Follows users through defined flows to identify bottlenecks
- **A/B Testing Framework**: Tests different variants to optimize user experience
- **Offline Support**: Stores analytics events when offline and syncs when connection is restored
- **Batch Processing**: Efficiently processes multiple events in a single request
- **Privacy-Focused**: Implements data minimization and anonymization techniques

### Architecture

The mobile analytics API consists of the following components:

1. **Database Tables**: Store analytics events, user journeys, feature usage, and A/B test data
2. **API Endpoints**: Collect analytics data from the mobile application
3. **Processing Services**: Process and aggregate analytics data
4. **SDK**: Simplifies integration with the mobile application

### Integration

#### Mobile Application Integration

The mobile application should use the Analytics SDK to interact with the mobile analytics API. The SDK provides methods for:

- Tracking events and user interactions
- Recording feature usage
- Managing user journeys
- Participating in A/B tests

Example code for the mobile app integration can be found at:
`/src/services/analytics/examples/mobile-sdk-integration.ts`

#### Super Admin Panel (SAP) Integration

The Super Admin Panel should use the dashboard data endpoints to retrieve analytics data for visualization. These endpoints provide all the necessary data for building comprehensive dashboards and reports.

The SAP should implement its own dashboard components for visualizing the analytics data. The backend only provides the data through API endpoints; it does not include any frontend visualization components.

Detailed API documentation is available at:
`/docs/analytics-api-documentation.md`

### Analytics API Endpoints

- `POST /api/analytics/track`: Track a general analytics event
- `POST /api/analytics/feature-usage`: Track feature usage
- `POST /api/analytics/journey`: Track user journey progress
- `POST /api/analytics/ui-interaction`: Track UI interaction
- `POST /api/analytics/batch`: Batch track multiple events
- `POST /api/analytics/ab-test/convert`: Track A/B test conversion
- `GET /api/analytics/ab-test/variant/:testName`: Get assigned variant for a user
- `GET /api/analytics/dashboard/metrics`: Get overview metrics
- `GET /api/analytics/dashboard/journeys`: Get user journey metrics
- `GET /api/analytics/dashboard/ab-tests/:testName`: Get A/B test results

For more details, see the [Mobile Analytics API Documentation](/docs/mobile-analytics-api-readme.md).

## Implementation Status

The Corp Astro backend server has been implemented with the following key features:

### Version 1.6.0 (2025-05-17)

1. **Content Generation System**
   - ✅ Implemented infrastructure for delivering daily horoscopes and monthly reports
   - ✅ Created models for content items, user content interactions, and business profiles
   - ✅ Added API endpoints for retrieving personalized content based on subscription tier
   - ✅ Implemented content favoriting and rating functionality

2. **Free Tools Backend**
   - ✅ Developed numerology service for business name and tagline analysis using Chaldean numerology
   - ✅ Created API endpoints for free tools with no authentication required
   - ✅ Implemented compatibility checking between business names and taglines
   - ✅ Added detailed interpretations and business implications for numerology results

3. **Mobile Analytics API**
   - ✅ Implemented comprehensive tracking of user interactions, screen views, and app lifecycle events
   - ✅ Added support for A/B testing with variant assignment and conversion tracking
   - ✅ Created batch processing for efficient data handling and offline support
   - ✅ Developed feature usage tracking for data-driven decision making

4. **Integration Points**
   - ✅ Prepared integration points with Astro Engine for chart calculations
   - ✅ Set up infrastructure for Astro Ratan AI agent integration
   - ✅ Created endpoints for Super Admin Panel (SAP) integration

### May 2025 Updates

1. **TypeScript Type System Implementation**
   - Added comprehensive type definitions in `/src/types/`
   - Created interfaces for all major components of the system
   - Fixed TypeScript errors throughout the codebase

2. **Error Handling System**
   - Implemented centralized error handling with `AppError` class
   - Added global error handling middleware
   - Standardized error responses across the API

3. **Documentation Enhancements**
   - Updated README.md with detailed project information
   - Added service-specific documentation in `/docs/`
   - Included code examples and API usage guides

4. **Test Updates**
   - Updated tests to use new type definitions
   - Improved test utilities in `testUtils.ts`
   - Enhanced test coverage for mobile API components

5. **GitHub Repository Setup**
   - Initialized Git repository with proper structure
   - Configured CI/CD workflows with GitHub Actions
   - Added contribution guidelines and templates
   - Set up deployment configuration for different environments

6. **Database Migration System**
   - Created Sequelize migration system for database schema management
   - Implemented initial schema with tables for users, subscriptions, content, etc.
   - Added seed data for testing and development
   - Added npm scripts for database management

7. **Docker and PM2 Configuration**
   - Added Docker configuration for containerized deployment
   - Created docker-compose.yml for local development
   - Implemented PM2 configuration for production deployment
   - Added deployment guide with instructions for different environments

8. **Analytics System Implementation**
   - Developed comprehensive analytics tracking infrastructure
   - Implemented A/B testing framework for feature optimization
   - Created mobile SDK for easy integration with the mobile app
   - Added API documentation for analytics endpoints
   - Designed database schema for analytics data storage

## 🚀 Getting Started

This section will guide you through setting up the Corp Astro Backend Server for development on your local machine.

### 💻 Prerequisites

<table>
  <tr>
    <td width="33%" align="center">
      <img src="https://nodejs.org/static/images/logo.svg" width="50" height="50"><br>
      <b>Node.js v18+</b>
    </td>
    <td width="33%" align="center">
      <img src="https://www.postgresql.org/media/img/about/press/elephant.png" width="50" height="50"><br>
      <b>PostgreSQL 14+</b>
    </td>
    <td width="33%" align="center">
      <img src="https://redis.io/images/redis-white.png" width="50" height="50"><br>
      <b>Redis (optional)</b>
    </td>
  </tr>
</table>

### 👷 Development Setup

Follow these steps to set up your development environment:

<details open>
<summary><b>1. Clone the Repository</b></summary>

```bash
git clone https://github.com/Project-Corp-Astro/Corp_Astro_Server_Trial.git
cd Corp_Astro_Server_Trial
```
</details>

<details open>
<summary><b>2. Install Dependencies</b></summary>

```bash
npm install
```

This will install all the required packages defined in `package.json`.
</details>

<details open>
<summary><b>3. Set Up Environment Variables</b></summary>

```bash
cp .env.example .env
```

Open the `.env` file in your favorite editor and configure the following variables:

```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=corpastro
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```
</details>

<details open>
<summary><b>4. Set Up the Database</b></summary>

Ensure PostgreSQL is running, then create the database:

```bash
psql -U postgres -c "CREATE DATABASE corpastro;"
```

Run the database migrations to create the schema:

```bash
npm run db:migrate
```

Seed the database with initial data (optional):

```bash
npm run db:seed
```
</details>

<details open>
<summary><b>5. Start the Development Server</b></summary>

```bash
npm run dev
```

The server will start at `http://localhost:3000` with hot-reloading enabled.

You should see output similar to:

```
[2025-05-17 12:00:00] [INFO] Server started on port 3000
[2025-05-17 12:00:00] [INFO] Connected to database: corpastro
[2025-05-17 12:00:00] [INFO] Environment: development
```
</details>

### 💯 Verifying Your Setup

To verify that your setup is working correctly, you can access the following endpoints:

- API Root: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health
- API Documentation: http://localhost:3000/api-docs

### 💡 Development Tips

- Use `npm run test` to run the test suite
- Use `npm run lint` to check for code style issues
- The server uses TypeScript for type safety
- All API endpoints are prefixed with `/api`
- Use the Swagger documentation at `/api-docs` to explore the API

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Project-Corp-Astro/Corp_Astro_Server_Trial.git
   cd Corp_Astro_Server_Trial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your local configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

### Docker Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Project-Corp-Astro/Corp_Astro_Server_Trial.git
   cd Corp_Astro_Server_Trial
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your local configuration
   ```

3. **Start the Docker containers**
   ```bash
   npm run docker:up
   ```

4. **Access the application**
   - API: http://localhost:3000
   - pgAdmin: http://localhost:5050 (admin@corp-astro.com / admin)

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test categories
npm run test:unit
npm run test:mobile
npm run test:content
```

## Deployment

Detailed deployment instructions are available in the [Deployment Guide](/docs/deployment-guide.md).

### Quick Deployment Steps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy using PM2**
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

3. **Deploy using Docker**
   ```bash
   npm run docker:build
   docker run -p 3000:3000 --env-file .env corp-astro-server
   ```

## User Flows & Interaction Diagrams

### User Onboarding Flow

```mermaid
sequenceDiagram
    participant User
    participant Mobile as Mobile App
    participant Backend as Backend Server
    participant AstroEngine as Astro Engine
    participant AstroRatan as Astro Ratan AI
    
    User->>Mobile: Install App
    Mobile->>Mobile: Show Welcome Screen
    User->>Mobile: Sign Up
    Mobile->>Backend: POST /api/auth/register
    Backend->>Backend: Create User Account
    Backend->>Mobile: Return User Data
    
    Mobile->>Mobile: Request Business Details
    User->>Mobile: Enter Business Details
    Mobile->>Backend: POST /api/business/profile
    Backend->>Backend: Create Business Profile
    
    Backend->>AstroEngine: Request Business Chart
    AstroEngine->>Backend: Return Chart Data
    
    Backend->>AstroRatan: Generate Initial Insights
    AstroRatan->>Backend: Return Business Insights
    
    Backend->>Backend: Generate Welcome Report
    Backend->>Mobile: Return Business Profile & Initial Report
    Mobile->>User: Show Dashboard with Initial Insights
    
    Backend->>Backend: Trigger Onboarding Workflow
    Backend->>Mobile: Send Welcome Notification
    Mobile->>User: Show Push Notification
```

### Daily User Interaction Flow

```mermaid
sequenceDiagram
    participant User
    participant Mobile as Mobile App
    participant Backend as Backend Server
    participant AstroEngine as Astro Engine
    participant AstroRatan as Astro Ratan AI
    
    Note over Backend: Overnight Processing
    Backend->>AstroEngine: Get Daily Transits
    AstroEngine->>Backend: Return Transit Data
    Backend->>AstroRatan: Generate Daily Horoscopes
    AstroRatan->>Backend: Return Personalized Content
    Backend->>Backend: Store Daily Horoscopes
    
    Note over User,Mobile: Morning
    Backend->>Mobile: Send Daily Horoscope Notification
    Mobile->>User: Show Push Notification
    User->>Mobile: Open Notification
    Mobile->>Backend: GET /api/content/horoscopes/daily
    Backend->>Mobile: Return Daily Horoscope
    Mobile->>User: Display Daily Horoscope
    
    Note over User,Mobile: During Day
    User->>Mobile: Check Business Recommendations
    Mobile->>Backend: GET /api/business/recommendations
    Backend->>Mobile: Return Recommendations
    Mobile->>User: Display Recommendations
    
    User->>Mobile: Use Free Tool (e.g., Name Analysis)
    Mobile->>Backend: POST /api/content/tools/name-analysis
    Backend->>Backend: Process Analysis
    Backend->>Mobile: Return Analysis Results
    Mobile->>User: Display Analysis Results
    
    Note over Backend: Analytics Tracking
    Mobile->>Backend: POST /api/analytics/events
    Backend->>Backend: Store User Interaction Data
```

### Subscription Upgrade Flow

```mermaid
sequenceDiagram
    participant User
    participant Mobile as Mobile App
    participant Backend as Backend Server
    participant Payment as Payment Gateway
    
    User->>Mobile: View Subscription Options
    Mobile->>Backend: GET /api/subscriptions/plans
    Backend->>Mobile: Return Available Plans
    Mobile->>User: Display Subscription Plans
    
    User->>Mobile: Select Premium Plan
    Mobile->>Payment: Process Payment
    Payment->>Mobile: Payment Confirmation
    Mobile->>Backend: POST /api/users/subscription
    Backend->>Backend: Update Subscription Status
    Backend->>Backend: Trigger Subscription Workflow
    
    Backend->>Mobile: Return Updated User Data
    Mobile->>User: Show Subscription Confirmation
    
    Backend->>Backend: Generate Premium Welcome Pack
    Backend->>Mobile: Send Welcome Notification
    Mobile->>User: Show Premium Features Unlocked
```

## Internal System Interactions

### Content Generation Process

```mermaid
flowchart TD
    subgraph Scheduler
        Cron[Cron Job] --> ContentGen[Content Generation Job]
    end
    
    subgraph Backend Server
        ContentGen --> UserSegmentation[User Segmentation]
        UserSegmentation --> BatchProcessor[Batch Processor]
        BatchProcessor --> ContentService[Content Service]
        ContentService --> TemplateEngine[Template Engine]
        ContentService --> AstroEngineClient[Astro Engine Client]
        ContentService --> AstroRatanClient[Astro Ratan Client]
        TemplateEngine --> ContentFormatter[Content Formatter]
        AstroEngineClient --> ChartProcessor[Chart Processor]
        AstroRatanClient --> AIContentGenerator[AI Content Generator]
        ChartProcessor --> ContentAssembler[Content Assembler]
        AIContentGenerator --> ContentAssembler
        ContentFormatter --> ContentAssembler
        ContentAssembler --> ContentStorage[Content Storage]
        ContentStorage --> NotificationTrigger[Notification Trigger]
    end
    
    subgraph External Services
        AstroEngineClient --> AstroEngine[Astro Engine API]
        AstroRatanClient --> AstroRatan[Astro Ratan AI API]
        NotificationTrigger --> NotificationService[Notification Service]
    end
    
    AstroEngine --> AstroEngineClient
    AstroRatan --> AstroRatanClient
    NotificationService --> PushDelivery[Push Notification Delivery]
```

### Real-time Analytics Processing

```mermaid
flowchart TD
    subgraph Client
        MobileApp[Mobile App] --> EventTracking[Event Tracking]
        EventTracking --> BatchSender[Batch Event Sender]
    end
    
    subgraph Backend Server
        APIGateway[API Gateway] --> EventCollector[Event Collector]
        EventCollector --> Validator[Event Validator]
        Validator --> EventEnricher[Event Enricher]
        EventEnricher --> EventRouter[Event Router]
        
        EventRouter --> RealtimeProcessor[Realtime Processor]
        EventRouter --> BatchProcessor[Batch Processor]
        EventRouter --> StreamProcessor[Stream Processor]
        
        RealtimeProcessor --> AlertingSystem[Alerting System]
        BatchProcessor --> AnalyticsDB[Analytics Database]
        StreamProcessor --> DataWarehouse[Data Warehouse]
        
        AnalyticsDB --> ReportGenerator[Report Generator]
        DataWarehouse --> MLPipeline[ML Pipeline]
        
        ReportGenerator --> DashboardAPI[Dashboard API]
        MLPipeline --> PredictionService[Prediction Service]
    end
    
    subgraph Admin Interface
        DashboardAPI --> AnalyticsDashboard[Analytics Dashboard]
        PredictionService --> RecommendationEngine[Recommendation Engine]
    end
    
    BatchSender --> APIGateway
```

### Error Handling & Recovery Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as API Gateway
    participant Service as Service Layer
    participant ErrorHandler as Error Handler
    participant Logger as Logging Service
    participant Monitoring as Monitoring System
    participant Notification as Alert Notification
    
    Client->>API: API Request
    API->>Service: Process Request
    
    alt Successful Case
        Service->>API: Success Response
        API->>Client: 200 OK with Data
    else Error Case
        Service->>ErrorHandler: Throw Exception
        ErrorHandler->>ErrorHandler: Classify Error
        ErrorHandler->>Logger: Log Error Details
        Logger->>Monitoring: Update Error Metrics
        
        alt Critical Error
            Monitoring->>Notification: Send Alert
            Notification->>Notification: Notify On-Call Engineer
        end
        
        ErrorHandler->>API: Formatted Error Response
        API->>Client: Error Response with Code
        
        alt Recoverable Error
            ErrorHandler->>Service: Trigger Recovery Process
            Service->>Service: Execute Recovery Steps
            Service->>Logger: Log Recovery Attempt
        end
    end
```

### Deployment Architecture

```mermaid
flowchart TD
    subgraph Development
        DevEnv[Development Environment]
        LocalTests[Local Tests]
        DevEnv --> LocalTests
    end
    
    subgraph CI/CD Pipeline
        GitRepo[Git Repository] --> GithubActions[GitHub Actions]
        GithubActions --> BuildStep[Build Step]
        BuildStep --> TestStep[Test Step]
        TestStep --> SecurityScan[Security Scan]
        SecurityScan --> DockerBuild[Docker Build]
    end
    
    subgraph Staging Environment
        DockerBuild --> StagingDeploy[Staging Deployment]
        StagingDeploy --> IntegrationTests[Integration Tests]
        IntegrationTests --> LoadTests[Load Tests]
        LoadTests --> UAT[User Acceptance Testing]
    end
    
    subgraph Production Environment
        UAT --> BlueGreen[Blue-Green Deployment]
        BlueGreen --> LoadBalancer[Load Balancer]
        LoadBalancer --> ProdServer1[Production Server 1]
        LoadBalancer --> ProdServer2[Production Server 2]
        LoadBalancer --> ProdServerN[Production Server N]
        
        ProdServer1 --> Redis[Redis Cache]
        ProdServer2 --> Redis
        ProdServerN --> Redis
        
        ProdServer1 --> DBCluster[Database Cluster]
        ProdServer2 --> DBCluster
        ProdServerN --> DBCluster
        
        DBCluster --> PrimaryDB[(Primary DB)]
        DBCluster --> ReplicaDB1[(Replica DB 1)]
        DBCluster --> ReplicaDB2[(Replica DB 2)]
    end
    
    subgraph Monitoring & Ops
        ProdServer1 --> Prometheus[Prometheus]
        ProdServer2 --> Prometheus
        ProdServerN --> Prometheus
        Prometheus --> Grafana[Grafana Dashboards]
        Prometheus --> AlertManager[Alert Manager]
        AlertManager --> PagerDuty[PagerDuty]
    end
```

### Security Flow & Authentication

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API as API Gateway
    participant Auth as Auth Service
    participant JWT as JWT Processor
    participant RBAC as Role-Based Access Control
    participant Service as Protected Service
    participant Audit as Audit Logger
    
    User->>Client: Enter Credentials
    Client->>API: POST /api/auth/login
    API->>Auth: Validate Credentials
    Auth->>Auth: Check Rate Limiting
    Auth->>Auth: Validate Username/Password
    Auth->>JWT: Generate Tokens
    JWT->>JWT: Create Access Token
    JWT->>JWT: Create Refresh Token
    JWT->>Auth: Return Tokens
    Auth->>API: Return Auth Response
    API->>Client: Return JWT Tokens
    Client->>Client: Store Tokens Securely
    
    Note over User,Client: Later - Authenticated Request
    
    User->>Client: Request Protected Resource
    Client->>API: Request with JWT Header
    API->>JWT: Validate Token
    JWT->>JWT: Check Signature
    JWT->>JWT: Verify Not Expired
    JWT->>RBAC: Check Permissions
    RBAC->>RBAC: Verify User Role
    RBAC->>RBAC: Check Resource Access
    RBAC->>Service: Allow Access
    Service->>Audit: Log Access
    Service->>API: Return Protected Data
    API->>Client: Return Response
    Client->>User: Show Protected Resource
    
    Note over User,Client: Token Refresh Flow
    
    Client->>API: POST /api/auth/refresh
    API->>JWT: Validate Refresh Token
    JWT->>JWT: Verify Refresh Token
    JWT->>JWT: Generate New Access Token
    JWT->>API: Return New Access Token
    API->>Client: Return New JWT
    Client->>Client: Update Stored Token
```

### Offline Data Synchronization

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant SyncManager as Sync Manager
    participant LocalDB as Local Database
    participant API as Backend API
    participant ServerDB as Server Database
    
    Note over User,Client: Online Operation
    
    User->>Client: Perform Action
    Client->>API: Send Request
    API->>ServerDB: Update Data
    ServerDB->>API: Confirm Update
    API->>Client: Success Response
    Client->>LocalDB: Update Local Data
    Client->>User: Show Updated UI
    
    Note over User,Client: Connection Lost
    
    User->>Client: Perform Action Offline
    Client->>SyncManager: Queue Operation
    SyncManager->>LocalDB: Store Pending Change
    SyncManager->>LocalDB: Update Optimistic UI
    LocalDB->>Client: Return Updated Data
    Client->>User: Show Updated UI (Offline)
    
    Note over User,Client: Connection Restored
    
    SyncManager->>SyncManager: Detect Connection
    SyncManager->>SyncManager: Process Queue
    SyncManager->>API: Sync Pending Changes
    API->>ServerDB: Apply Changes
    ServerDB->>API: Confirm Updates
    API->>SyncManager: Sync Response
    SyncManager->>LocalDB: Update Sync Status
    SyncManager->>LocalDB: Resolve Conflicts
    LocalDB->>Client: Update UI if needed
    Client->>User: Show Sync Status
```

### A/B Testing Workflow

```mermaid
flowchart TD
    subgraph Admin Panel
        CreateTest[Create A/B Test] --> DefineVariants[Define Variants]
        DefineVariants --> SetDistribution[Set Traffic Distribution]
        SetDistribution --> DefineMetrics[Define Success Metrics]
        DefineMetrics --> ActivateTest[Activate Test]
    end
    
    subgraph Backend Server
        ActivateTest --> TestStorage[Test Configuration Storage]
        TestStorage --> AssignmentService[Variant Assignment Service]
        AssignmentService --> UserAssignment[User Assignment Logic]
        UserAssignment --> PersistAssignment[Persist Assignment]
        PersistAssignment --> TrackExposure[Track Exposure Event]
    end
    
    
    subgraph Mobile App
        AppRequest[App Request] --> CheckVariant[Check Variant Assignment]
        CheckVariant --> RenderVariantA[Render Variant A]
        CheckVariant --> RenderVariantB[Render Variant B]
        RenderVariantA --> TrackInteraction[Track Interaction]
        RenderVariantB --> TrackInteraction
        TrackInteraction --> TrackConversion[Track Conversion]
    end
    
    subgraph Analytics
        TrackExposure --> AnalyticsStorage[Analytics Storage]
        TrackInteraction --> AnalyticsStorage
        TrackConversion --> AnalyticsStorage
        AnalyticsStorage --> AnalysisEngine[Analysis Engine]
        AnalysisEngine --> ResultsDashboard[Results Dashboard]
        ResultsDashboard --> StatSignificance[Statistical Significance Check]
        StatSignificance --> TestConclusion[Test Conclusion]
    end
    
    AppRequest --> AssignmentService
```

## Comprehensive Documentation

The Corp Astro Backend Server includes detailed documentation for all major components and features. These guides are designed to help developers understand, use, and extend the system.

### Core Documentation

<table>
  <tr>
    <td width="50%">
      <h4>📚 <a href="/docs/integration-guide.md">Integration Guide</a></h4>
      <p>Comprehensive guide for integrating the backend server with other components of the Corp Astro ecosystem, including:</p>
      <ul>
        <li>Astro Engine Integration</li>
        <li>Astro Ratan AI Integration</li>
        <li>Super Admin Panel (SAP) Integration</li>
        <li>Mobile App Integration</li>
      </ul>
    </td>
    <td width="50%">
      <h4>📈 <a href="/docs/analytics-system.md">Analytics System</a></h4>
      <p>Detailed documentation of the analytics system, including:</p>
      <ul>
        <li>Event Tracking</li>
        <li>A/B Testing Framework</li>
        <li>Analytics Dashboard Integration</li>
        <li>Data Visualization</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h4>⚡ <a href="/docs/performance-scalability-guide.md">Performance & Scalability</a></h4>
      <p>Guide to performance optimization and scalability, including:</p>
      <ul>
        <li>Caching Strategies</li>
        <li>Database Optimization</li>
        <li>Horizontal Scaling</li>
        <li>Load Testing Results</li>
      </ul>
    </td>
    <td>
      <h4>📦 <a href="/docs/docker-cicd-guide.md">Docker & CI/CD</a></h4>
      <p>Guide to containerization and continuous integration/deployment, including:</p>
      <ul>
        <li>Docker Configuration</li>
        <li>Container Architecture</li>
        <li>CI/CD Pipeline</li>
        <li>Deployment Environments</li>
      </ul>
    </td>
  </tr>
</table>

### API Documentation

<table>
  <tr>
    <td width="50%">
      <h4>🔍 <a href="/docs/api-reference.md">API Reference</a></h4>
      <p>Complete API reference documentation, including:</p>
      <ul>
        <li>Authentication Endpoints</li>
        <li>Content Endpoints</li>
        <li>Business Endpoints</li>
        <li>Analytics Endpoints</li>
      </ul>
    </td>
    <td width="50%">
      <h4>📱 <a href="/docs/mobile-api-integration-guide.md">Mobile API Guide</a></h4>
      <p>Guide to mobile-specific API features, including:</p>
      <ul>
        <li>Batch Processing</li>
        <li>Response Optimization</li>
        <li>Offline Support</li>
        <li>Push Notifications</li>
      </ul>
    </td>
  </tr>
</table>

### Development Guides

<table>
  <tr>
    <td width="50%">
      <h4>👷 <a href="/docs/development-guide.md">Development Guide</a></h4>
      <p>Guide for developers working on the codebase, including:</p>
      <ul>
        <li>Code Style Guidelines</li>
        <li>Testing Practices</li>
        <li>Pull Request Process</li>
        <li>Release Process</li>
      </ul>
    </td>
    <td width="50%">
      <h4>📝 <a href="/docs/database-schema.md">Database Schema</a></h4>
      <p>Documentation of the database schema, including:</p>
      <ul>
        <li>Table Definitions</li>
        <li>Relationships</li>
        <li>Indexes</li>
        <li>Migration Process</li>
      </ul>
    </td>
  </tr>
</table>

## Contributing

Please read [CONTRIBUTING.md](/.github/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Security

For information about reporting security vulnerabilities, please read [SECURITY.md](/.github/SECURITY.md).

## License

Proprietary - All rights reserved
