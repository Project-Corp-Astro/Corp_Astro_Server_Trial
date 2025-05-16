**Database Architecture for Corp Astro Ecosystem** 

**Table of Contents Specification** 

1. **Executive Summary** 
- 1.1. Project Overview and Technical Parameters 
- 1.2. Architectural Highlights and Performance Metrics 
- 1.3. Implementation Synopsis and Strategic Recommendations 
2. **Database Technology Selection and Justification** 
- 2.1. Requirements Analysis and Specification  
  - 2.1.1. Data Complexity Spectrum Characterization 
  - 2.1.2. Query Pattern Profiling and Load Analysis 
  - 2.1.3. Scalability Requirements Quantification 
  - 2.1.4. Performance Criteria and Benchmarking Methodology 
- 2.2. Technology Evaluation Matrix  
  - 2.2.1. Relational Integrity Assessment 
  - 2.2.2. Schema Flexibility Measurement 
  - 2.2.3. Query Complexity Support Analysis 
  - 2.2.4. Throughput and Latency Benchmarks 
- 2.3. Polyglot Persistence Architecture Rationale  
- 2.3.1. PostgreSQL Implementation Parameters 
- 2.3.2. MongoDB Configuration Specifications 
- 2.3.3. Redis Caching Framework Integration 
- 2.3.4. TimescaleDB Extension Implementation 
3. **Core Schema Implementation** 
- 3.1. PostgreSQL Base Configuration  
  - 3.1.1. Extension Configuration and Initialization 
  - 3.1.2. Schema Segmentation Strategy 
- 3.2. User Management Schema  
  - 3.2.1. Authentication Mechanisms 
  - 3.2.2. Device Registration Framework 
- 3.3. Subscription Management Structures  
  - 3.3.1. Plan Configuration Tables 
  - 3.3.2. Transaction Tracking System 
- 3.4. Constraint Implementation and Validation Protocols 
4. **Astrological Data Modeling** 
- 4.1. Chart Type System Infrastructure  
  - 4.1.1. Chart Classification Taxonomy 
  - 4.1.2. Divisional Factor Configuration 
- 4.2. Natal and Derived Chart Structures  
  - 4.2.1. Entity Reference Architecture 
  - 4.2.2. Chart Data Storage Optimization 
- 4.3. Positional Data Management  
  - 4.3.1. Planetary Position Representation 
  - 4.3.2. House System Implementation 
- 4.4. Angular Measurement Framework  
  - 4.4.1. Dual-Format Storage Methodology 
  - 4.4.2. Conversion Function Implementation 
- 4.5. Transit and Progression Infrastructure  
  - 4.5.1. Temporal Positional Data Tracking 
  - 4.5.2. Aspect Calculation Optimization 
- 4.6. TimescaleDB Implementation for Temporal Data  
  - 4.6.1. Chunk Interval Configuration 
  - 4.6.2. Compression Policy Specification 
5. **Specialized Astrological Systems** 
- 5.1. KP System (Krishnamurti Paddhati) Infrastructure  
  - 5.1.1. Star Lord Table Schema 
  - 5.1.2. Significator Calculation Framework 
- 5.2. Numerology System Implementation  
  - 5.2.1. System Configuration Framework 
  - 5.2.2. Calculation Rule Parameterization 
- 5.3. Lo Shu Grid Analysis Architecture  
  - 5.3.1. Grid Representation Model 
  - 5.3.2. Elemental Balance Calculation Framework 
- 5.4. Hierarchical Dasha Period System  
  - 5.4.1. Multi-Level Period Tracking 
  - 5.4.2. Temporal Precision Implementation 
- 5.5. Muhurta Analysis Infrastructure  
- 5.5.1. Auspicious Period Calculation Framework 
- 5.5.2. Time Window Optimization System 
6. **Business Integration Components** 
- 6.1. Business Profile Management  
  - 6.1.1. Entity Relationship Structure 
  - 6.1.2. Geospatial Data Integration 
- 6.2. Business Relationship Chart Framework  
  - 6.2.1. Synastry Implementation 
  - 6.2.2. Composite Chart Generation System 
- 6.3. Business Compatibility Analysis  
  - 6.3.1. Multi-Entity Comparison Framework 
  - 6.3.2. Compatibility Scoring Algorithm 
- 6.4. Astrological Timing for Business Activities  
- 6.4.1. Muhurta Selection Optimization 
- 6.4.2. Temporal Quality Assessment System 
7. **Document-Oriented Data Architecture (MongoDB)** 
- 7.1. Collection Design Methodology  
  - 7.1.1. Document Structure Optimization 
  - 7.1.2. Reference Strategy Implementation 
- 7.2. Divisional Chart Collection Specification  
  - 7.2.1. Document Schema and Validation Rules 
  - 7.2.2. Planetary Position Embedding Strategy 
- 7.3. KP Analysis Collection Configuration  
  - 7.3.1. Sub-Lord Analysis Structure 
  - 7.3.2. Predictive Analysis Framework 
- 7.4. Dasha Period Analysis Collection Design  
  - 7.4.1. Hierarchical Period Representation 
  - 7.4.2. Forecast Integration System 
- 7.5. Muhurta Analysis Collection Implementation  
  - 7.5.1. Temporal Window Representation 
  - 7.5.2. Quality Assessment Framework 
8. **Caching Architecture Implementation (Redis)** 
- 8.1. Multi-Database Organization  
  - 8.1.1. Functional Segmentation Strategy 
  - 8.1.2. Database Allocation Parameters 
- 8.2. Key Design Patterns and Namespace Configuration  
  - 8.2.1. Key Structure Standardization 
  - 8.2.2. Namespacing Hierarchy 
- 8.3. TTL and Eviction Strategy Implementation  
  - 8.3.1. TTL Optimization by Data Category 
  - 8.3.2. Eviction Policy Configuration 
- 8.4. Specialized Astrological Caching Framework  
  - 8.4.1. Ephemeris Data Caching System 
  - 8.4.2. Chart Calculation Result Caching 
- 8.5. Batch Operation Optimization  
- 8.5.1. Pipeline Implementation Methodology 
- 8.5.2. Multi-Key Operation Strategies 
9. **Implementation and Optimization Strategy** 
- 9.1. Phased Deployment Methodology  
  - 9.1.1. Phase Delimitation and Milestone Definition 
  - 9.1.2. Incremental Implementation Protocol 
- 9.2. Database Performance Optimization  
  - 9.2.1. PostgreSQL Configuration Parameters 
  - 9.2.2. MongoDB Performance Tuning 
  - 9.2.3. Redis Optimization Framework 
- 9.3. Angular Measurement Processing Optimization  
  - 9.3.1. Computational Efficiency Enhancement 
  - 9.3.2. Conversion Function Performance Tuning 
- 9.4. Time-Series Data Management Optimization  
  - 9.4.1. Chunk Size Configuration Methodology 
  - 9.4.2. Compression Strategy Implementation 
- 9.5. Cross-Database Consistency Framework  
- 9.5.1. UUID Reference Architecture 
- 9.5.2. Validation Mechanism Implementation 
10. **Data Flow Architecture** 
- 10.1. Chart Generation Processing Flow  
  - 10.1.1. Natal Chart Generation Protocol 
  - 10.1.2. Divisional Chart Calculation Framework 
- 10.2. KP Analysis Processing Framework  
  - 10.2.1. Sequential Processing Stages 
  - 10.2.2. Caching Integration Points 
- 10.3. Business Muhurta Selection System  
- 10.3.1. Temporal Window Evaluation Process 
- 10.3.2. Quality Assessment Methodology 
- 10.4. Cross-Database Transaction Management  
- 10.4.1. Consistency Maintenance Protocol 
- 10.4.2. Failure Recovery Mechanisms 
11. **Indexing and Query Optimization** 
- 11.1. PostgreSQL Indexing Strategy  
  - 11.1.1. B-Tree Index Implementation 
  - 11.1.2. GIN Index Configuration for JSONB 
  - 11.1.3. Spatial Index Implementation 
- 11.2. MongoDB Indexing Framework  
  - 11.2.1. Single-Field Index Configuration 
  - 11.2.2. Compound Index Optimization 
  - 11.2.3. Text Index Implementation 
- 11.3. Query Optimization Techniques  
- 11.3.1. PostgreSQL Query Analysis and Tuning 
- 11.3.2. MongoDB Query Optimization Methodology 
- 11.3.3. Execution Plan Analysis Protocol 
12. **Data Integrity and Security Framework** 
- 12.1. Data Validation Mechanisms  
  - 12.1.1. Constraint Implementation 
  - 12.1.2. Trigger-Based Validation 
- 12.2. Data Encryption Strategy  
  - 12.2.1. At-Rest Encryption Implementation 
  - 12.2.2. In-Transit Security Protocol 
- 12.3. Access Control Framework  
  - 12.3.1. Role-Based Permission System 
  - 12.3.2. Row-Level Security Implementation 
- 12.4. Audit Logging Mechanism  
- 12.4.1. Transaction Tracking System 
- 12.4.2. Change History Management 
13. **Backup and Disaster Recovery** 
- 13.1. PostgreSQL Backup Configuration  
  - 13.1.1. Full Backup Implementation 
  - 13.1.2. WAL Archiving Strategy 
- 13.2. MongoDB Backup Methodology  
  - 13.2.1. Regular Backup Protocol 
  - 13.2.2. Oplog-Based Point-in-Time Recovery 
- 13.3. Redis Persistence Configuration  
  - 13.3.1. RDB Snapshot Configuration 
  - 13.3.2. AOF Persistence Implementation 
- 13.4. Recovery Testing Protocol  
- 13.4.1. Recovery Time Objective Validation 
- 13.4.2. Data Integrity Verification Methodology 
14. **Monitoring and Observability Framework** 
- 14.1. PostgreSQL Monitoring Implementation  
- 14.1.1. Metrics Collection Configuration 
- 14.1.2. Performance Analysis Views 
- 14.2. MongoDB Monitoring System  
  - 14.2.1. Operational Metrics Tracking 
  - 14.2.2. Performance Analysis Methodology 
- 14.3. Redis Monitoring Framework  
  - 14.3.1. INFO Metrics Collection System 
  - 14.3.2. Memory Usage Analysis Protocol 
- 14.4. Alerting and Threshold Management  
- 14.4.1. Threshold Configuration Methodology 
- 14.4.2. Notification System Implementation 
15. **Deployment and Maintenance Procedures** 
- 15.1. Environment Setup Protocol  
  - 15.1.1. PostgreSQL Installation and Configuration 
  - 15.1.2. MongoDB Deployment Methodology 
  - 15.1.3. Redis Setup and Configuration 
- 15.2. Schema Migration Management  
  - 15.2.1. Version Control Implementation 
  - 15.2.2. Rollback Mechanism Design 
- 15.3. Scheduled Maintenance Operations  
- 15.3.1. Vacuum and Analysis Protocol 
- 15.3.2. Index Maintenance Methodology 
- 15.3.3. TimescaleDB Chunk Management 
16. **System Requirements and Performance Specifications** 
- 16.1. Hardware Configuration Requirements  
  - 16.1.1. Development Environment Specifications 
  - 16.1.2. Production Environment Parameters 
- 16.2. Expected Performance Metrics  
  - 16.2.1. Query Response Time Parameters 
  - 16.2.2. System Throughput Specifications 
  - 16.2.3. Caching Efficiency Targets 
- 16.3. Scaling Parameters and Thresholds  
- 16.3.1. Vertical Scaling Guidelines 
- 16.3.2. Horizontal Scaling Implementation 
17. **Future Expansion and Extensibility Framework** 
- 17.1. Schema Evolution Strategy  
  - 17.1.1. Versioning Methodology 
  - 17.1.2. Backward Compatibility Protocol 
- 17.2. Scaling Approach for Increased Load  
  - 17.2.1. Sharding Strategy Implementation 
  - 17.2.2. Read Replica Configuration 
- 17.3. Integration Points for New Astrological Systems  
- 17.3.1. Reference Data Expansion Framework 
- 17.3.2. Calculation Engine Extension Protocol 
18. **Conclusion and Recommendations** 
- 18.1. Architecture Summary and Technical Evaluation 
- 18.2. Implementation Recommendations and Prioritization 
- 18.3. Risk Mitigation Strategies and Contingency Planning 
- 18.4. Technical Future-Proofing Measures and Evolution Path 

**Appendices** 

- A. SQL Schema Definition Scripts 
- B. MongoDB Collection Schemas and Validation Rules 
- C. Redis Key Pattern Reference and Implementation Guide 
- D. Sample Query Patterns and Optimization Examples 
- E. Performance Benchmark Methodology and Results 
- F. Technical Glossary of Astrological Terms and Computational Concepts 

**Database Architecture for Corp Astro Ecosystem**

**Executive Summary** 

This document presents a comprehensive database architecture design for the Corp Astro ecosystem, an enterprise-grade platform integrating advanced astrological calculations with business analytics. The architecture implements a polyglot persistence approach, combining PostgreSQL, MongoDB, and Redis to effectively manage diverse data types including structured relational data, flexible document-oriented data, time-series data, and high-performance caching requirements. 

The architecture supports complex astrological calculations including natal chart generation, divisional charts, KP system analysis, numerology calculations, dasha period predictions, and business muhurta recommendations. Angular measurements are stored in dual formats (decimal and formatted degrees-minutes-seconds) to optimize both computational efficiency and human readability. 

This solution provides quantifiable performance metrics with sub-second response times for chart generation, efficient caching mechanisms for frequent calculations, and specialized time - series optimization for planetary transit data. The implementation strategy includes a phased approach with defined milestones, comprehensive data integrity mechanisms, and detailed maintenance procedures to ensure system reliability and scalability.

**1. Database Technology Selection Analysis**

1. **Requirements Analysis** 

Based on the comprehensive requirements for the Corp Astro ecosystem, I've performed a structured analysis of data characteristics and system needs:

1. **Data Complexity Spectrum**: 
   1. Structured data: User profiles, subscription models, payment records
   1. Semi-structured data: Astrological charts, interpretation templates
   1. Time-series data: Planetary positions, transit calculations
   1. Document-oriented data: Conversational logs with Astro Ratan
1. **Query Pattern Analysis**: 
   1. High-frequency read operations for chart data
   1. Complex relational queries for business intelligence
   1. Text-based semantic searches for interpretations
   1. Time-series analysis for astrological patterns
1. **Scalability Requirements**: 
- Horizontal scaling capabilities for growing user base
- Vertical scaling for computation-intensive operations 
- Multi-tenancy support for future applications
4. **Performance Criteria**: 
- Sub-second response for chart generation
- Real-time conversation capabilities with Astro Ratan
- Efficient caching of frequently accessed data
- Batch processing for reports and forecasts
2. **Technology Selection Decision Matrix** 



|**Requirement** |**PostgreSQL** |**MongoDB** |**Redis** |**Time-series DB** |
| - | - | - | - | - |
|Relational data integrity |✓✓✓ |✓ |✗ |✓ |
|Schema flexibility |✓ |✓✓✓ |✓ |✓ |
|Query complexity |✓✓✓ |✓✓ |✗ |✓ |
|Write throughput |✓✓ |✓✓✓ |✓✓✓ |✓✓✓ |
|Read performance |✓✓ |✓✓ |✓✓✓ |✓✓ |
|Caching capabilities |✓ |✓ |✓✓✓ |✓ |
|Time-series optimization |✓ |✓ |✓ |✓✓✓ |
|Transactional guarantees |✓✓✓ |✓✓ |✗ |✓ |

3. **Selected Database Architecture**

Based on this analysis, the recommended polyglot persistence architecture includes:

1. **Primary Database: PostgreSQL 14+** 
- Handles core relational data (users, subscriptions, payment records)
- Manages transactional integrity for business-critical operations 
- Provides robust querying capabilities for analytics
2. **Complementary Document Store: MongoDB 6.0+** 
- Stores flexible astrological chart data and interpretations
- Manages Astro Ratan conversation logs
- Houses complex nested data structures for astrological reports
3. **Caching Layer: Redis 7.0+** 
- Implements high-performance caching for frequent calculations
- Stores session data and authentication tokens
- Provides pub/sub capabilities for real-time features 
4. **Time-series Extension: TimescaleDB** 
- Extension to PostgreSQL for optimized time-series data 
- Efficiently manages historical planetary positions
- Supports astrological pattern analysis over time
2. **PostgreSQL Schema Design** 

**2.1 Core Schema Tables** 

**-- Enable necessary extensions**

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 

CREATE EXTENSION IF NOT EXISTS "postgis"; 

CREATE EXTENSION IF NOT EXISTS "timescaledb"; 

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; 

**-- Create schemas for logical separation**

CREATE SCHEMA core;       -- Core user and subscription data CREATE SCHEMA astrology;  -- Astrological data and charts CREATE SCHEMA business;   -- Business profiles and analysis CREATE SCHEMA analytics;  -- Reporting and analytics CREATE SCHEMA admin;      -- Super Administration Panel 

**-- Users table - primary user information** 

CREATE TABLE core.users ( 

`    `user\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `phone\_number VARCHAR(15) UNIQUE NOT NULL,  -- Primary authentication identifier     email VARCHAR(255) UNIQUE, 

`    `full\_name VARCHAR(100) NOT NULL, 

`    `gender VARCHAR(20), 

`    `date\_of\_birth DATE NOT NULL, 

time\_of\_birth TIME NOT NULL, 

place\_of\_birth VARCHAR(255) NOT NULL, 

birth\_coordinates GEOMETRY(Point, 4326) NOT NULL,  -- Using PostGIS for geospatial data birth\_timezone VARCHAR(50) NOT NULL, 

timezone\_offset NUMERIC(4, 2) NOT NULL,  -- Added timezone offset for precise calculations profile\_photo\_url VARCHAR(255), 

preferred\_language VARCHAR(10) DEFAULT 'en', 

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, last\_login\_at TIMESTAMP WITH TIME ZONE, 

account\_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', 

notification\_preferences JSONB DEFAULT '{"push": true, "email": true, "sms": true}'::jsonb, 

`    `CONSTRAINT valid\_account\_status CHECK (account\_status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED')), 

`    `CONSTRAINT valid\_timezone\_offset CHECK (timezone\_offset BETWEEN -12.0 AND 14.0) ); 

**-- Authentication records** 

CREATE TABLE core.authentication\_logs ( 

`    `log\_id BIGSERIAL PRIMARY KEY, 

`    `user\_id UUID REFERENCES core.users(user\_id), 

`    `authentication\_type VARCHAR(20) NOT NULL,  -- OTP, TOKEN, etc.     ip\_address INET NOT NULL, 

`    `device\_identifier VARCHAR(255), 

`    `success BOOLEAN NOT NULL, 

`    `failure\_reason VARCHAR(255), 

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_auth\_type CHECK (authentication\_type IN ('OTP', 'TOKEN', 'PASSWORD', 'SSO')) 

); 

**-- User devices for push notifications**

CREATE TABLE core.user\_devices ( 

`    `device\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `user\_id UUID NOT NULL REFERENCES core.users(user\_id) ON DELETE CASCADE,     device\_token VARCHAR(255) NOT NULL, 

`    `device\_type VARCHAR(50) NOT NULL,  -- IOS, ANDROID 

`    `device\_model VARCHAR(100), 

`    `os\_version VARCHAR(50), 

`    `app\_version VARCHAR(50), 

`    `push\_enabled BOOLEAN DEFAULT TRUE, 

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `last\_used\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_device\_type CHECK (device\_type IN ('IOS', 'ANDROID', 'WEB')) ); 

**-- Subscription plans** 

CREATE TABLE core.subscription\_plans ( 

`    `plan\_id SERIAL PRIMARY KEY, 

`    `plan\_name VARCHAR(100) NOT NULL, 

`    `plan\_description TEXT, 

`    `monthly\_price DECIMAL(10, 2) NOT NULL, 

`    `quarterly\_price DECIMAL(10, 2), 

`    `biannual\_price DECIMAL(10, 2), 

`    `annual\_price DECIMAL(10, 2), 

`    `currency VARCHAR(3) DEFAULT 'INR', 

`    `features JSONB NOT NULL, 

`    `is\_active BOOLEAN DEFAULT TRUE, 

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP,     updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP 

); 

**-- User subscriptions** 

CREATE TABLE core.user\_subscriptions ( 

`    `subscription\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `user\_id UUID NOT NULL REFERENCES core.users(user\_id) ON DELETE CASCADE, 

`    `plan\_id INTEGER NOT NULL REFERENCES core.subscription\_plans(plan\_id), 

`    `start\_date TIMESTAMP WITH TIME ZONE NOT NULL, 

`    `end\_date TIMESTAMP WITH TIME ZONE NOT NULL, 

`    `billing\_cycle VARCHAR(20) NOT NULL,  -- MONTHLY, QUARTERLY, BIANNUAL, ANNUAL     auto\_renew BOOLEAN DEFAULT TRUE, 

`    `status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', 

`    `payment\_method VARCHAR(50), 

`    `payment\_reference VARCHAR(255),  -- Reference to external payment gateway

`    `cancellation\_date TIMESTAMP WITH TIME ZONE, 

`    `cancellation\_reason TEXT, 

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_subscription\_status CHECK (status IN ('ACTIVE', 'CANCELED', 'EXPIRED', 'PENDING')), 

`    `CONSTRAINT valid\_billing\_cycle CHECK (billing\_cycle IN ('MONTHLY', 'QUARTERLY', 'BIANNUAL', 'ANNUAL')) 

); 

**-- Payment transactions** 

CREATE TABLE core.payment\_transactions ( 

`    `transaction\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `user\_id UUID NOT NULL REFERENCES core.users(user\_id), 

`    `subscription\_id UUID REFERENCES core.user\_subscriptions(subscription\_id),

`    `transaction\_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

amount DECIMAL(10, 2) NOT NULL, 

currency VARCHAR(3) DEFAULT 'INR', 

payment\_method VARCHAR(50) NOT NULL,  -- PHONEPAY, CREDIT\_CARD, etc. gateway\_reference VARCHAR(255) NOT NULL,  -- Reference ID from payment gateway gateway\_response JSONB,  -- Full response from payment gateway

status VARCHAR(20) NOT NULL, 

failure\_reason TEXT, 

metadata JSONB, 

`    `CONSTRAINT valid\_payment\_status CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')) 

); 

3. **Enhanced Astrological Schema Implementation**
1. **Chart Type System** 

**-- Chart type reference table (for both natal and divisional charts)**

CREATE TABLE astrology.chart\_types ( 

`    `chart\_type\_id SERIAL PRIMARY KEY, 

`    `chart\_code VARCHAR(20) NOT NULL UNIQUE, -- D-1, D-9, D-10, etc. 

`    `chart\_name VARCHAR(100) NOT NULL,        -- Rasi, Navamsha, Dashamsha

`    `chart\_category VARCHAR(50) NOT NULL,     -- NON\_DIVISIONAL, DIVISIONAL, LAGNA     divisional\_factor INTEGER,               -- Null for non-divisional, numerical factor for divisional     description TEXT, 

`    `calculation\_method VARCHAR(50) NOT NULL, -- STANDARD, SRIPATI, KP\_SYSTEM, etc.     created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_chart\_category CHECK (chart\_category IN ('NON\_DIVISIONAL', 'DIVISIONAL', 'LAGNA', 'BUSINESS', 'SPECIAL')) 

); 

**-- Pre-populate with standard chart types** 

INSERT INTO astrology.chart\_types (chart\_code, chart\_name, chart\_category, divisional\_factor, calculation\_method, description) VALUES 

-- Non-Divisional Charts 

('D-1', 'Rasi Chart', 'NON\_DIVISIONAL', NULL, 'STANDARD', 'Birth Chart showing planetary positions at time of birth'), 

('MOON', 'Moon Chart', 'NON\_DIVISIONAL', NULL, 'STANDARD', 'Chart with Moon as the ascendant'), 

('SUN', 'Sun Chart', 'NON\_DIVISIONAL', NULL, 'STANDARD', 'Chart with Sun as the ascendant'), ('BHAVA', 'Bhava Chart', 'NON\_DIVISIONAL', NULL, 'SRIPATI', 'Sripati house-based chart'), 

**-- Divisional Charts** 

('D-2', 'Hora', 'DIVISIONAL', 2, 'STANDARD', 'Wealth and economic prosperity'), 

('D-3', 'Drekkana', 'DIVISIONAL', 3, 'STANDARD', 'Siblings and courage'), 

('D-4', 'Chaturthamsha', 'DIVISIONAL', 4, 'STANDARD', 'Fortune and fixed assets'), 

('D-7', 'Saptamsha', 'DIVISIONAL', 7, 'STANDARD', 'Children and progeny'), 

('D-9', 'Navamsha', 'DIVISIONAL', 9, 'STANDARD', 'Spouse and general fortune'), 

('D-10', 'Dashamsha', 'DIVISIONAL', 10, 'STANDARD', 'Career and professional life'), 

('D-12', 'Dwadashamsha', 'DIVISIONAL', 12, 'STANDARD', 'Parents and ancestry'), 

('D-16', 'Shodashamsha', 'DIVISIONAL', 16, 'STANDARD', 'Vehicles and comforts'), 

('D-20', 'Vimshamsha', 'DIVISIONAL', 20, 'STANDARD', 'Spiritual pursuits and religious activities'), ('D-24', 'Chaturvimshamsha', 'DIVISIONAL', 24, 'STANDARD', 'Educational pursuits and learning'), ('D-27', 'Saptavimshamsha', 'DIVISIONAL', 27, 'STANDARD', 'Strengths and weaknesses'),

('D-30', 'Trimshamsha', 'DIVISIONAL', 30, 'STANDARD', 'Misfortunes and challenges'), 

('D-40', 'Khavedamsha', 'DIVISIONAL', 40, 'STANDARD', 'Auspicious and inauspicious effects'), 

('D-45', 'Akshavedamsha', 'DIVISIONAL', 45, 'STANDARD', 'All aspects of life'), 

('D-60', 'Shashtiamsha', 'DIVISIONAL', 60, 'STANDARD', 'Overall analysis and specific karmic influences'), 

**-- Lagna Charts** 

('ARUDHA', 'Arudha Lagna', 'LAGNA', NULL, 'STANDARD', 'Material manifestation of the ascendant'), 

('BHAVA\_L', 'Bhava Lagna', 'LAGNA', NULL, 'STANDARD', 'Progression of house cusps'), ('HORA\_L', 'Hora Lagna', 'LAGNA', NULL, 'STANDARD', 'Wealth and resources timing'), ('GHATIKA\_L', 'Ghatika Lagna', 'LAGNA', NULL, 'STANDARD', 'Power and authority timing'), 

('UPAGRAHA', 'Upagraha', 'LAGNA', NULL, 'STANDARD', 'Chart showing positions of secondary planets and mathematical points'),

-- Business Charts 

('SYNASTRY', 'Synastry Chart', 'BUSINESS', NULL, 'STANDARD', 'Comparison between two or more entities for compatibility'), 

('COMPOSITE', 'Composite Chart', 'BUSINESS', NULL, 'STANDARD', 'Midpoint chart representing relationship as a single entity'), 

('PROGRESSIVE', 'Progressive Chart', 'BUSINESS', NULL, 'STANDARD', 'Chart showing progression based on selected time factor');

2. **Natal and Derived Charts** 

**-- Natal charts with enhanced chart type support**

CREATE TABLE astrology.natal\_charts ( 

`    `chart\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `entity\_type VARCHAR(20) NOT NULL, -- USER, BUSINESS, PARTNER 

`    `user\_id UUID REFERENCES core.users(user\_id), 

`    `business\_id UUID REFERENCES business.business\_profiles(business\_id),

`    `partner\_id UUID REFERENCES business.business\_partners(partner\_id),

`    `birth\_date DATE NOT NULL, 

`    `birth\_time TIME NOT NULL, 

`    `birth\_location VARCHAR(255) NOT NULL, 

`    `birth\_coordinates GEOMETRY(Point, 4326) NOT NULL, 

`    `timezone\_offset NUMERIC(4, 2) NOT NULL,  -- Added timezone offset for precise calculations     ayanamsa VARCHAR(20) DEFAULT 'LAHIRI', 

`    `ayanamsa\_value DECIMAL(10, 6) NOT NULL,  -- Added for storing precise ayanamsa value at birth time 

house\_system VARCHAR(20) DEFAULT 'WHOLE\_SIGN', 

zodiac\_system VARCHAR(20) DEFAULT 'SIDEREAL', 

ascendant\_sign VARCHAR(20) NOT NULL,  -- Added for quick reference of ascendant sign ascendant\_degree DECIMAL(10, 6) NOT NULL,  -- Store as decimal degrees for calculations

`    `ascendant\_degree\_formatted VARCHAR(30),  -- Store formatted DMS for display (e.g., "1° 12' 31.28\"") 

`    `chart\_data JSONB NOT NULL,  -- Complete chart data including planets, houses, etc.

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT entity\_reference\_check CHECK ( 

`        `(entity\_type = 'USER' AND user\_id IS NOT NULL) OR 

`        `(entity\_type = 'BUSINESS' AND business\_id IS NOT NULL) OR 

`        `(entity\_type = 'PARTNER' AND partner\_id IS NOT NULL) 

`    `), 

`    `CONSTRAINT valid\_entity\_type CHECK (entity\_type IN ('USER', 'BUSINESS', 'PARTNER')), 

`    `CONSTRAINT valid\_ayanamsa CHECK (ayanamsa IN ('LAHIRI', 'RAMAN', 'KP', 'TROPICAL')), 

`    `CONSTRAINT valid\_house\_system CHECK (house\_system IN ('WHOLE\_SIGN', 'PLACIDUS', 'KOCH', 'EQUAL')), 

`    `CONSTRAINT valid\_zodiac\_system CHECK (zodiac\_system IN ('SIDEREAL', 'TROPICAL')),     CONSTRAINT valid\_timezone\_offset CHECK (timezone\_offset BETWEEN -12.0 AND 14.0) ); 

-- Divisional and specialized charts - extends the natal chart for various divisional systems CREATE TABLE astrology.derived\_charts ( 

`    `derived\_chart\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `base\_chart\_id UUID NOT NULL REFERENCES astrology.natal\_charts(chart\_id) ON DELETE CASCADE, 

chart\_type\_id INTEGER NOT NULL REFERENCES astrology.chart\_types(chart\_type\_id), calculation\_parameters JSONB,  -- Additional parameters specific to this chart type ascendant\_sign VARCHAR(20) NOT NULL, 

ascendant\_degree DECIMAL(10, 6) NOT NULL, 

ascendant\_degree\_formatted VARCHAR(30), 

chart\_data JSONB NOT NULL,  -- Complete chart data for this divisional/specialized chart notes TEXT,  -- Additional interpretative notes 

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `UNIQUE (base\_chart\_id, chart\_type\_id) 

); 

3. **Planetary and House Positions with Dual-Format Angular Storage -- Planetary positions in natal charts** 

   CREATE TABLE astrology.natal\_planets ( 

   `    `position\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

   `    `chart\_id UUID NOT NULL REFERENCES astrology.natal\_charts(chart\_id) ON DELETE CASCADE, 

planet VARCHAR(20) NOT NULL, 

sign VARCHAR(20) NOT NULL, 

house INTEGER NOT NULL CHECK (house BETWEEN 1 AND 12), 

longitude DECIMAL(10, 6) NOT NULL,  -- Store as decimal degrees for calculations degree\_formatted VARCHAR(30),  -- Store formatted DMS for display (e.g., "25° 25' 11.01\"") is\_retrograde BOOLEAN NOT NULL DEFAULT FALSE, 

retrograde\_indicator VARCHAR(1),  -- Store "R" or "" for display purposes 

speed DECIMAL(10, 6),  -- Planet's speed 

nakshatra VARCHAR(30),  -- Added nakshatra for Vedic calculations

nakshatra\_pada INTEGER,  -- Added nakshatra pada 

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_planet CHECK (planet IN ('SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'RAHU', 'KETU', 'URANUS', 'NEPTUNE', 'PLUTO')) 

); 

**-- House positions in natal charts** 

CREATE TABLE astrology.natal\_houses ( 

`    `house\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `chart\_id UUID NOT NULL REFERENCES astrology.natal\_charts(chart\_id) ON DELETE CASCADE, 

house\_number INTEGER NOT NULL CHECK (house\_number BETWEEN 1 AND 12), sign VARCHAR(20) NOT NULL, 

start\_longitude DECIMAL(10, 6) NOT NULL,  -- Store as decimal degrees for calculations

`    `start\_longitude\_formatted VARCHAR(30),  -- Store formatted DMS for display 

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP ); 

4. **Derived Chart Planetary and House Positions** 

**-- Planetary positions in divisional/specialized charts**

CREATE TABLE astrology.derived\_chart\_planets ( 

`    `position\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `derived\_chart\_id UUID NOT NULL REFERENCES astrology.derived\_charts(derived\_chart\_id) ON DELETE CASCADE, 

planet VARCHAR(20) NOT NULL, 

sign VARCHAR(20) NOT NULL, 

house INTEGER NOT NULL CHECK (house BETWEEN 1 AND 12), 

longitude DECIMAL(10, 6) NOT NULL,  -- Store as decimal degrees for calculations degree\_formatted VARCHAR(30),  -- Store formatted DMS for display (e.g., "25° 25' 11.01\"") is\_retrograde BOOLEAN NOT NULL DEFAULT FALSE, 

retrograde\_indicator VARCHAR(1),  -- Store "R" or "" for display purposes 

nakshatra VARCHAR(30),  -- Added nakshatra for Vedic calculations

nakshatra\_pada INTEGER,  -- Added nakshatra pada 

additional\_attributes JSONB,  -- Chart-specific attributes (dignity, strength, etc.)

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_planet CHECK (planet IN ('SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'RAHU', 'KETU', 'URANUS', 'NEPTUNE', 'PLUTO')) 

); 

**-- House positions in divisional/specialized charts**

CREATE TABLE astrology.derived\_chart\_houses ( 

`    `house\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `derived\_chart\_id UUID NOT NULL REFERENCES astrology.derived\_charts(derived\_chart\_id) ON DELETE CASCADE, 

house\_number INTEGER NOT NULL CHECK (house\_number BETWEEN 1 AND 12), sign VARCHAR(20) NOT NULL, 

`    `start\_longitude DECIMAL(10, 6) NOT NULL,  -- Store as decimal degrees for calculations

`    `start\_longitude\_formatted VARCHAR(30),  -- Store formatted DMS for display 

`    `house\_lord VARCHAR(20) NOT NULL,  -- Ruling planet of this house 

`    `additional\_attributes JSONB,  -- Chart-specific house attributes

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP 

); 

5. **Transit Chart System** 

**-- Transit charts and calculations** 

CREATE TABLE astrology.transit\_charts ( 

`    `transit\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `natal\_chart\_id UUID NOT NULL REFERENCES astrology.natal\_charts(chart\_id), 

`    `transit\_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,  -- Exact timestamp of transit     ayanamsa\_value DECIMAL(10, 6) NOT NULL,  -- Ayanamsa value at transit time 

`    `aspects\_data JSONB,  -- Aspects between transit and natal planets

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP 

); 

**-- Transit planetary positions** 

CREATE TABLE astrology.transit\_planets ( 

`    `position\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `transit\_id UUID NOT NULL REFERENCES astrology.transit\_charts(transit\_id) ON DELETE CASCADE, 

planet VARCHAR(20) NOT NULL, sign VARCHAR(20) NOT NULL, 

`    `house INTEGER NOT NULL CHECK (house BETWEEN 1 AND 12),  -- House in relation to natal chart 

longitude DECIMAL(10, 6) NOT NULL,  -- Store as decimal degrees for calculations degree\_formatted VARCHAR(30),  -- Store formatted DMS for display (e.g., "24° 22' 5.20\"") is\_retrograde BOOLEAN NOT NULL DEFAULT FALSE, 

retrograde\_indicator VARCHAR(1),  -- Store "R" or "" for display purposes 

speed DECIMAL(10, 6),  -- Planet's speed 

nakshatra VARCHAR(30),  -- Added nakshatra for Vedic calculations nakshatra\_pada INTEGER,  -- Added nakshatra pada 

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_planet CHECK (planet IN ('SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'RAHU', 'KETU', 'URANUS', 'NEPTUNE', 'PLUTO')) 

); 

6. **Time-Series Planetary Data (TimescaleDB) -- Daily transits (stored as time-series data**) CREATE TABLE astrology.daily\_transits ( 

   `    `transit\_id BIGSERIAL, 

   `    `transit\_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,  -- Combined date and time for precise tracking 

planet VARCHAR(20) NOT NULL, 

longitude DECIMAL(10, 6) NOT NULL, 

latitude DECIMAL(10, 6), 

speed DECIMAL(10, 6), 

acceleration DECIMAL(10, 6),  -- Rate of change of speed is\_retrograde BOOLEAN NOT NULL, 

`    `is\_station BOOLEAN NOT NULL DEFAULT FALSE,  -- Whether this is a stationing point (retrograde or direct) 

station\_type VARCHAR(10),  -- RETROGRADE or DIRECT if is\_station is true zodiac\_sign VARCHAR(20) NOT NULL, 

zodiac\_degree DECIMAL(5, 2) NOT NULL, 

degree\_formatted VARCHAR(30),  -- Store formatted DMS for display nakshatra VARCHAR(30), 

nakshatra\_pada INTEGER, 

ayanamsa VARCHAR(20) DEFAULT 'LAHIRI', 

`    `ayanamsa\_value DECIMAL(10, 6) NOT NULL,  -- Added for storing precise ayanamsa value at transit time 

zodiac\_system VARCHAR(20) DEFAULT 'SIDEREAL', 

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, PRIMARY KEY (transit\_id), 

`    `CONSTRAINT valid\_planet CHECK (planet IN ('SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'RAHU', 'KETU', 'URANUS', 'NEPTUNE', 'PLUTO')), 

`    `CONSTRAINT valid\_station\_type CHECK (station\_type IN ('RETROGRADE', 'DIRECT')) ); 

-- Convert to TimescaleDB hypertable for time-series optimization 

SELECT create\_hypertable('astrology.daily\_transits', 'transit\_timestamp', chunk\_time\_interval => INTERVAL '1 month'); 

4. **Comprehensive Numerology System Implementation**
1. **Numerology System Configuration** 

**-- Numerology systems reference table**

CREATE TABLE astrology.numerology\_systems ( 

`    `system\_id SERIAL PRIMARY KEY, 

`    `system\_name VARCHAR(50) NOT NULL UNIQUE, 

`    `description TEXT, 

`    `base\_numbers INTEGER NOT NULL,  -- Number of core numbers in system (9 for Pythagorean, 8 for Chaldean) 

`    `calculation\_rules JSONB NOT NULL,  -- System-specific calculation rules 

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP ); 

**-- Pre-populate with standard numerology systems**

INSERT INTO astrology.numerology\_systems (system\_name, description, base\_numbers, calculation\_rules) VALUES 

(**'PYTHAGOREAN',** 'Modern Western numerology system based on 1-9 values', 9, '{"character\_values": {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6, "G": 7, "H": 8, "I": 9, "J": 1, "K": 2, "L": 3, "M": 4, "N": 5, "O": 6, "P": 7, "Q": 8, "R": 9, "S": 1, "T": 2, "U": 3, "V": 4, "W": 5, "X": 6, "Y": 7, "Z": 8}, "master\_numbers": [11, 22, 33], "reduction\_method": "DIGITAL\_ROOT"}'::jsonb), 

(**'CHALDEAN'**, 'Ancient system based on vibrational energy using 1-8 values', 8, 

'{"character\_values": {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 8, "G": 3, "H": 5, "I": 1, "J": 1, "K": 2, 

"L": 3, "M": 4, "N": 5, "O": 7, "P": 8, "Q": 1, "R": 2, "S": 3, "T": 4, "U": 6, "V": 6, "W": 6, "X": 5, "Y": 1, "Z": 7}, "master\_numbers": [11, 22, 33, 44], "reduction\_method": "DIGITAL\_ROOT"}'::jsonb), 

(**'KP', 'Krishnamurti Paddhati** numerology system', 9, '{"character\_values": {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6, "G": 7, "H": 8, "I": 9, "J": 1, "K": 2, "L": 3, "M": 4, "N": 5, "O": 6, "P": 7, "Q": 8, "R": 9, "S": 1, "T": 2, "U": 3, "V": 4, "W": 5, "X": 6, "Y": 7, "Z": 8}, "planet\_mappings": {"1": "SUN", "2": "MOON", "3": "JUPITER", "4": "RAHU", "5": "MERCURY", "6": "VENUS", "7": "KETU", "8": "SATURN", "9": "MARS"}, "reduction\_method": "KP\_SPECIAL"}'::jsonb), 

(**'LO\_SHU'**, 'Chinese Lo Shu Grid (Magic Square) numerology', 9, '{"grid\_positions": {"1": 

"WATER", "2": "EARTH", "3": "WOOD", "4": "WOOD", "5": "EARTH", "6": "METAL", "7": "METAL", "8": "EARTH", "9": "FIRE"}, "date\_calculation": "DIGIT\_SUM", "element\_balance": true}'::jsonb); 

2. **Numerology Analysis Tables** 

Continuing from the previous section on Numerology Analysis Tables:

**-- Enhanced numerology analysis table**

CREATE TABLE astrology.numerology\_analyses ( 

`    `analysis\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `entity\_type VARCHAR(20) NOT NULL, -- USER, BUSINESS, PARTNER, NAME, DATE     user\_id UUID REFERENCES core.users(user\_id), 

`    `business\_id UUID REFERENCES business.business\_profiles(business\_id),

`    `partner\_id UUID REFERENCES business.business\_partners(partner\_id),

`    `analysis\_name VARCHAR(100) NOT NULL,  -- Name for this analysis 

`    `input\_text VARCHAR(255) NOT NULL,  -- Name or text being analyzed 

input\_date DATE,  -- Date being analyzed (if applicable) 

`    `numerology\_system\_id INTEGER NOT NULL REFERENCES astrology.numerology\_systems(system\_id),

compound\_number INTEGER NOT NULL,  -- Full calculated number before reduction root\_number INTEGER NOT NULL,  -- Reduced number (except master numbers)

`    `is\_master\_number BOOLEAN NOT NULL DEFAULT FALSE, -- Whether root number is a special master number 

calculation\_details JSONB NOT NULL,  -- Detailed calculation steps lo\_shu\_grid JSONB,  -- Lo Shu grid representation (if applicable) missing\_numbers JSONB,  -- Analysis of missing numbers in Lo Shu Grid planet\_correlations JSONB,  -- Correlations with planetary influences full\_analysis JSONB NOT NULL,  -- Complete analysis results 

recommendations JSONB,  -- Personalized recommendations

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_entity\_type CHECK (entity\_type IN ('USER', 'BUSINESS', 'PARTNER', 'NAME', 'DATE')) 

); 

**-- Specific Lo Shu Grid analysis table** 

CREATE TABLE astrology.lo\_shu\_grid\_analyses ( 

`    `grid\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `numerology\_analysis\_id UUID NOT NULL REFERENCES astrology.numerology\_analyses(analysis\_id) ON DELETE CASCADE, 

`    `birth\_date DATE NOT NULL,  -- Date used to generate grid 

`    `grid\_numbers INTEGER[] NOT NULL,  -- 3x3 array of grid numbers 

`    `grid\_representation JSONB NOT NULL,  -- Visual representation of grid 

`    `missing\_numbers INTEGER[] NOT NULL,  -- Numbers missing from grid 

`    `excess\_numbers JSONB,  -- Numbers appearing multiple times with count

`    `diagonal\_analysis JSONB,  -- Analysis of diagonal relationships 

`    `element\_balance JSONB,  -- Balance of elements based on grid positions

`    `personality\_assessment TEXT,  -- Overall personality assessment

`    `strength\_assessment TEXT,  -- Overall strength assessment

`    `recommendation TEXT,  -- Recommended actions based on grid

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP ); 

5. **KP System (Krishnamurti Paddhati) Implementation** 

**5.1 KP Star Lord Tables** 

**-- KP star lords/sub-lords system** 

CREATE TABLE astrology.kp\_star\_lords ( 

star\_lord\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `chart\_id UUID NOT NULL REFERENCES astrology.natal\_charts(chart\_id) ON DELETE CASCADE, 

horoscope\_point VARCHAR(50) NOT NULL,  -- PLANET, HOUSE\_CUSP, etc. point\_position DECIMAL(10, 6) NOT NULL,  -- Zodiacal longitude constellation\_lord VARCHAR(20) NOT NULL,  -- Nakshatra lord 

sub\_lord VARCHAR(20) NOT NULL,  -- Sub-division lord 

sub\_sub\_lord VARCHAR(20) NOT NULL,  -- Sub-sub division lord significance JSONB,  -- Significance of these lordships 

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_planet CHECK (constellation\_lord IN ('SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'RAHU', 'KETU')) 

); 

**-- KP house significators** 

CREATE TABLE astrology.kp\_significators ( 

`    `significator\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `chart\_id UUID NOT NULL REFERENCES astrology.natal\_charts(chart\_id) ON DELETE CASCADE, 

`    `house\_number INTEGER NOT NULL CHECK (house\_number BETWEEN 1 AND 12), 

`    `primary\_significators VARCHAR(20)[] NOT NULL,  -- Planets as primary significators 

`    `secondary\_significators VARCHAR(20)[] NOT NULL,  -- Planets as secondary significators     tertiary\_significators VARCHAR(20)[] NOT NULL,  -- Planets as tertiary significators 

`    `specific\_significator VARCHAR(20),  -- The most specific significator 

`    `interpretation TEXT,  -- Interpretation of these significators

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP 

); 

**-- KP ruling planets** 

CREATE TABLE astrology.kp\_ruling\_planets ( 

`    `ruling\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `chart\_id UUID NOT NULL REFERENCES astrology.natal\_charts(chart\_id) ON DELETE CASCADE, 

kp\_chart\_type VARCHAR(20) NOT NULL DEFAULT 'NATAL',  -- NATAL, HORARY, TRANSIT 

`    `fruitful\_planet VARCHAR(20),  -- Most fruitful planet 

`    `current\_ruling\_planets JSONB,  -- Current ruling planets (time-based) 

`    `event\_ruling\_planets JSONB,  -- Ruling planets for specific events 

`    `interpretation TEXT, 

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_kp\_chart\_type CHECK (kp\_chart\_type IN ('NATAL', 'HORARY', 'TRANSIT')) ); 

6. **Business Chart and Compatibility Systems**
1. **Business Relationship Charts** 

-- Business relationship charts (synastry, composite, etc.)

CREATE TABLE astrology.relationship\_charts ( 

`    `relationship\_chart\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `chart\_type\_id INTEGER NOT NULL REFERENCES astrology.chart\_types(chart\_type\_id), 

`    `chart\_name VARCHAR(100) NOT NULL,  -- User-friendly name for this relationship chart

`    `description TEXT, 

`    `entity\_pairs JSONB NOT NULL,  -- Array of entity pairs being compared (can be >2 for group charts) 

calculation\_method VARCHAR(50) NOT NULL,  -- SYNASTRY, COMPOSITE, DAVISON, etc. calculation\_parameters JSONB,  -- Additional parameters used for calculation

chart\_data JSONB NOT NULL,  -- Complete chart data 

analysis\_summary TEXT,  -- Overall summary of relationship dynamics

compatibility\_score DECIMAL(4, 2) CHECK (compatibility\_score BETWEEN 0 AND 10), key\_aspects JSONB,  -- Most significant planetary aspects between charts

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_calculation\_method CHECK (calculation\_method IN ('SYNASTRY', 'COMPOSITE', 'DAVISON', 'RELATIONSHIP', 'COMBINED')) 

); 

**-- Progressive charts (time-based progressions of natal charts)**

CREATE TABLE astrology.progressive\_charts ( 

`    `progressive\_chart\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `base\_chart\_id UUID NOT NULL REFERENCES astrology.natal\_charts(chart\_id) ON DELETE CASCADE, 

progression\_type VARCHAR(50) NOT NULL,  -- SECONDARY, SOLAR\_ARC, TERTIARY, etc. progression\_date DATE NOT NULL,  -- Date for which progression is calculated

years\_progressed DECIMAL(6, 2) NOT NULL,  -- Number of years progressed from birth calculation\_parameters JSONB,  -- Additional parameters used for progression

ascendant\_sign VARCHAR(20) NOT NULL, 

ascendant\_degree DECIMAL(10, 6) NOT NULL, 

ascendant\_degree\_formatted VARCHAR(30), 

chart\_data JSONB NOT NULL,  -- Complete progressed chart data

key\_transitions JSONB,  -- Significant transitions identified in the progression

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_progression\_type CHECK (progression\_type IN ('SECONDARY', 'SOLAR\_ARC', 'TERTIARY', 'DAY\_FOR\_YEAR', 'CONVERSE')) 

); 

2. **Business Astrological Integration** 

**-- Business profiles** 

CREATE TABLE business.business\_profiles ( 

`    `business\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `user\_id UUID NOT NULL REFERENCES core.users(user\_id) ON DELETE CASCADE, 

`    `business\_name VARCHAR(255) NOT NULL, 

`    `industry\_type VARCHAR(100), 

`    `incorporation\_date DATE NOT NULL, 

`    `incorporation\_time TIME NOT NULL DEFAULT '12:00:00',  -- Default noon if not specified     incorporation\_place VARCHAR(255) NOT NULL, 

`    `incorporation\_coordinates GEOMETRY(Point, 4326) NOT NULL, 

`    `incorporation\_timezone VARCHAR(50) NOT NULL, 

`    `timezone\_offset NUMERIC(4, 2) NOT NULL,  -- Added timezone offset for precise calculations     business\_description TEXT, 

`    `logo\_url VARCHAR(255), 

`    `website\_url VARCHAR(255), 

`    `company\_size VARCHAR(50),  -- SMALL, MEDIUM, LARGE 

`    `annual\_revenue\_range VARCHAR(50), 

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_timezone\_offset CHECK (timezone\_offset BETWEEN -12.0 AND 14.0) ); 

**-- Business numerology analysis (updated version with enhanced systems)** CREATE TABLE business.business\_numerology ( 

`    `analysis\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `business\_id UUID NOT NULL REFERENCES business.business\_profiles(business\_id) ON DELETE CASCADE, 

`    `analysis\_type VARCHAR(50) NOT NULL,  -- NAME, FOUNDING\_DATE, REGISTRATION\_NUMBER, ADDRESS, etc. 

input\_value VARCHAR(255) NOT NULL,  -- The actual value being analyzed 

`    `numerology\_system\_id INTEGER NOT NULL REFERENCES astrology.numerology\_systems(system\_id),

compound\_number INTEGER NOT NULL, 

root\_number INTEGER NOT NULL, 

is\_master\_number BOOLEAN NOT NULL DEFAULT FALSE, calculation\_details JSONB NOT NULL,  -- Detailed calculation steps business\_interpretation TEXT NOT NULL,  -- Business-specific interpretation recommendations JSONB NOT NULL,  -- Business recommendations lo\_shu\_grid JSONB,  -- If Lo Shu analysis was performed 

`    `compatibility\_with\_owner DECIMAL(4, 2) CHECK (compatibility\_with\_owner BETWEEN 0 AND 

10), 

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_analysis\_type CHECK (analysis\_type IN ('NAME', 'FOUNDING\_DATE', 'REGISTRATION\_NUMBER', 'ADDRESS', 'PRODUCT\_NAME', 'BRAND\_NAME')) 

); 

**-- Business astrological timing** 

CREATE TABLE business.business\_astrological\_timing ( 

`    `timing\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `business\_id UUID NOT NULL REFERENCES business.business\_profiles(business\_id) ON DELETE CASCADE, 

`    `timing\_type VARCHAR(50) NOT NULL, -- LAUNCH, MARKETING, HIRING, INVESTMENT, CONTRACT, etc. 

activity\_description TEXT NOT NULL, recommended\_start\_time TIMESTAMP WITH TIME ZONE, recommended\_end\_time TIMESTAMP WITH TIME ZONE, 

astrological\_factors JSONB NOT NULL,  -- Factors contributing to this recommendation

`    `muhurta\_quality INTEGER CHECK (muhurta\_quality BETWEEN 1 AND 10),  -- Quality of this timing (1-10) 

transits\_analysis JSONB,  -- Relevant transit analysis dashas\_analysis JSONB,  -- Relevant dasha analysis alternatives JSONB,  -- Alternative timing options 

precautions TEXT,  -- Precautions to take even with good timing

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_timing\_type CHECK (timing\_type IN ('LAUNCH', 'MARKETING', 'HIRING', 'INVESTMENT', 'CONTRACT', 'PARTNERSHIP', 'EXPANSION', 'RESTRUCTURE')) 

); 

**-- Business compatibility with partners, clients, or employees**

CREATE TABLE business.business\_compatibility ( 

`    `compatibility\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 


business\_id UUID NOT NULL REFERENCES business.business\_profiles(business\_id), 

entity\_type VARCHAR(50) NOT NULL, -- PARTNER\_BUSINESS, CLIENT, EMPLOYEE, INVESTOR entity\_id UUID,  -- Optional reference to another entity in system

entity\_name VARCHAR(255) NOT NULL,  -- Name of entity if not in system 

entity\_birth\_details JSONB,  -- Birth details if applicable 

`    `astrological\_compatibility DECIMAL(4, 2) CHECK (astrological\_compatibility BETWEEN 0 AND 10), 

`    `numerological\_compatibility DECIMAL(4, 2) CHECK (numerological\_compatibility BETWEEN 0 AND 10), 

composite\_chart\_id UUID REFERENCES astrology.relationship\_charts(relationship\_chart\_id), synastry\_chart\_id UUID REFERENCES astrology.relationship\_charts(relationship\_chart\_id), strength\_areas JSONB,  -- Areas of strong compatibility 

challenge\_areas JSONB,  -- Areas of potential challenges 

recommendations TEXT NOT NULL,  -- Recommendations for optimizing relationship created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_entity\_type CHECK (entity\_type IN ('PARTNER\_BUSINESS', 'CLIENT', 'EMPLOYEE', 'INVESTOR', 'VENDOR', 'CUSTOMER')) 

); 

7. **Dasha Period System** 
1. **Dasha Systems Configuration** 

**-- Dasha systems reference**

CREATE TABLE astrology.dasha\_systems ( 

`    `dasha\_system\_id SERIAL PRIMARY KEY, 

`    `system\_name VARCHAR(50) NOT NULL, 

`    `description TEXT, 

`    `calculation\_method VARCHAR(50) NOT NULL, 

`    `applicable\_charts TEXT[],  -- Chart types where this dasha system is applicable

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP,     UNIQUE (system\_name) 

); 

**-- Pre-populate with standard dasha systems**

INSERT INTO astrology.dasha\_systems (system\_name, description, calculation\_method, applicable\_charts) VALUES 

('VIMSHOTTARI', 'Most common 120-year dasha system based on natal Moon nakshatra', 'NAKSHATRA\_BASED', ARRAY['D-1', 'D-9']), 

('YOGINI', '36-year dasha system based on Moon nakshatra and lunar day (tithi)', 'NAKSHATRA\_TITHI', ARRAY['D-1']), 

('KALACHAKRA', 'Based on Kalachakra cycle related to nakshatras', 'KALACHAKRA\_NAADI', ARRAY['D-1', 'D-9']), 

('ASHTOTTARI', '108-year dasha system alternate to Vimshottari', 'NAKSHATRA\_BASED', ARRAY['D-1']), 

('CHARA', 'Based on Lagna', 'RASI\_BASED', ARRAY['D-1']); 

2. **Hierarchical Dasha Structure** 

**-- Dasha periods for a natal chart** 

CREATE TABLE astrology.dasha\_periods ( 

`    `dasha\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `chart\_id UUID NOT NULL REFERENCES astrology.natal\_charts(chart\_id) ON DELETE CASCADE, 

`    `dasha\_system\_id INTEGER NOT NULL REFERENCES astrology.dasha\_systems(dasha\_system\_id),

`    `calculation\_parameters JSONB,  -- Parameters used for calculating this dasha series

`    `start\_date TIMESTAMP WITH TIME ZONE NOT NULL,  -- Birth timestamp 

`    `end\_date TIMESTAMP WITH TIME ZONE NOT NULL,  -- End of 120 years (or system period)     created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `UNIQUE (chart\_id, dasha\_system\_id) 

); 

**-- Mahadashas (main periods)** 

CREATE TABLE astrology.mahadasha\_periods ( 

`    `mahadasha\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `dasha\_id UUID NOT NULL REFERENCES astrology.dasha\_periods(dasha\_id) ON DELETE CASCADE, 

sequence\_number INTEGER NOT NULL,  -- Order in the dasha sequence

planet VARCHAR(20) NOT NULL, 

start\_date TIMESTAMP WITH TIME ZONE NOT NULL, 

end\_date TIMESTAMP WITH TIME ZONE NOT NULL, 

duration\_years DECIMAL(5, 2) NOT NULL,  -- Duration in years 

planet\_state JSONB,  -- Planet state (sign, dignity, etc.) at birth time

effects\_summary TEXT, 

significance\_factors JSONB,  -- Factors affecting the significance of this period created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_planet CHECK (planet IN ('SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'RAHU', 'KETU')) 

); 

**-- Antardashas (sub-periods)** 

CREATE TABLE astrology.antardasha\_periods ( 

`    `antardasha\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `mahadasha\_id UUID NOT NULL REFERENCES astrology.mahadasha\_periods(mahadasha\_id) ON DELETE CASCADE, 

sequence\_number INTEGER NOT NULL,  -- Order in the antardasha sequence planet VARCHAR(20) NOT NULL, 

start\_date TIMESTAMP WITH TIME ZONE NOT NULL, 

end\_date TIMESTAMP WITH TIME ZONE NOT NULL, 

duration\_years DECIMAL(5, 2) NOT NULL,  -- Duration in years effects\_summary TEXT, 

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_planet CHECK (planet IN ('SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'RAHU', 'KETU')) 

); 

**-- Pratyantar dashas (sub-sub-periods)** 

CREATE TABLE astrology.pratyantardasha\_periods ( 

`    `pratyantardasha\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `antardasha\_id UUID NOT NULL REFERENCES astrology.antardasha\_periods(antardasha\_id) ON DELETE CASCADE, 

sequence\_number INTEGER NOT NULL,  -- Order in the pratyantardasha sequence planet VARCHAR(20) NOT NULL, 

start\_date TIMESTAMP WITH TIME ZONE NOT NULL, 

end\_date TIMESTAMP WITH TIME ZONE NOT NULL, 

duration\_days INTEGER NOT NULL,  -- Duration in days 

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_planet CHECK (planet IN ('SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'RAHU', 'KETU')) 

); 

**-- Sookshma dashas (sub-sub-sub-periods) - for precision timing** CREATE TABLE astrology.sookshmadasha\_periods ( 

`    `sookshmadasha\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `pratyantardasha\_id UUID NOT NULL REFERENCES astrology.pratyantardasha\_periods(pratyantardasha\_id) ON DELETE CASCADE,

sequence\_number INTEGER NOT NULL,  -- Order in the sequence planet VARCHAR(20) NOT NULL, 

start\_date TIMESTAMP WITH TIME ZONE NOT NULL, end\_date TIMESTAMP WITH TIME ZONE NOT NULL, duration\_hours DECIMAL(6, 2) NOT NULL,  -- Duration in hours 

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_planet CHECK (planet IN ('SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'RAHU', 'KETU')) 

); 

8. **Angular Measurement Handling Functions** 
1. **Bidirectional Conversion Functions** 

**-- Function to convert decimal degrees to DMS format**

CREATE OR REPLACE FUNCTION astrology.decimal\_to\_dms(decimal\_degrees DECIMAL) RETURNS VARCHAR AS $ 

DECLARE 

`    `sign\_prefix VARCHAR := ''; 

`    `degrees INTEGER; 

`    `minutes INTEGER; 

`    `seconds DECIMAL; 

`    `absolute\_value DECIMAL; 

BEGIN 

`    `absolute\_value := ABS(decimal\_degrees); 

`    `IF decimal\_degrees < 0 THEN         sign\_prefix := '-'; 

`    `END IF; 

degrees := FLOOR(absolute\_value)::INTEGER; 

minutes := FLOOR((absolute\_value - degrees) \* 60)::INTEGER; seconds := ROUND(((absolute\_value - degrees) \* 60 - minutes) \* 60, 2); 

`    `**-- Handle case where seconds round to 60**     IF seconds >= 60 THEN 

`        `seconds := 0; 

`        `minutes := minutes + 1; 

`    `END IF; 

**-- Handle case where minutes reach 60** IF minutes >= 60 THEN 

`        `minutes := 0; 

`        `degrees := degrees + 1;     END IF; 

`    `RETURN sign\_prefix || degrees || '° ' || minutes || ''' ' || seconds || '"'; END; 

$ LANGUAGE plpgsql IMMUTABLE; 

**-- Function to convert DMS format to decimal degrees**

CREATE OR REPLACE FUNCTION astrology.dms\_to\_decimal(dms\_string VARCHAR) RETURNS DECIMAL AS $ 

DECLARE 

`    `sign\_multiplier DECIMAL := 1; 

`    `degrees\_part VARCHAR; 

`    `minutes\_part VARCHAR; 

`    `seconds\_part VARCHAR; 

`    `degrees DECIMAL; 

`    `minutes DECIMAL; 

`    `seconds DECIMAL; 

`    `pattern VARCHAR := '^(-?)(\d+)[°\s]+(\d+)[\''\s]+(\d+\.?\d\*)["\s]\*'; 

BEGIN 

`    `**-- Check if negative** 

`    `IF dms\_string LIKE '-%' THEN 

`        `sign\_multiplier := -1; 

`    `END IF; 

**-- Extract parts using regex** 

degrees\_part := (SELECT (regexp\_matches(dms\_string, pattern))[2]); minutes\_part := (SELECT (regexp\_matches(dms\_string, pattern))[3]); seconds\_part := (SELECT (regexp\_matches(dms\_string, pattern))[4]);

**-- Convert to numbers** 

degrees := degrees\_part::DECIMAL; minutes := minutes\_part::DECIMAL; seconds := seconds\_part::DECIMAL; 

`    `**-- Validate values** 

`    `IF minutes >= 60 OR seconds >= 60 THEN 

`        `RAISE EXCEPTION 'Invalid DMS value: minutes and seconds must be less than 60';     END IF; 

`    `RETURN sign\_multiplier \* (degrees + minutes/60 + seconds/3600);

EXCEPTION 

`    `WHEN OTHERS THEN 

`        `RAISE EXCEPTION 'Invalid DMS format. Expected format: DD° MM'' SS.SS"'; END; 

$ LANGUAGE plpgsql IMMUTABLE; 

2. **Automatic Formatting Triggers** 

**-- Trigger function to automatically format degree values**

CREATE OR REPLACE FUNCTION astrology.format\_degree\_trigger() RETURNS TRIGGER AS $ 

BEGIN 

`    `**-- For natal\_planets table** 

`    `IF TG\_TABLE\_NAME = 'natal\_planets' THEN 

`        `NEW.degree\_formatted := astrology.decimal\_to\_dms(NEW.longitude);     **-- For transit\_planets table** 

`    `ELSIF TG\_TABLE\_NAME = 'transit\_planets' THEN 

`        `NEW.degree\_formatted := astrology.decimal\_to\_dms(NEW.longitude);     **-- For daily\_transits table** 

`    `ELSIF TG\_TABLE\_NAME = 'daily\_transits' THEN 

`        `NEW.degree\_formatted := astrology.decimal\_to\_dms(NEW.longitude);

`    `**-- For natal\_houses table** 

`    `ELSIF TG\_TABLE\_NAME = 'natal\_houses' THEN 

`        `NEW.start\_longitude\_formatted := astrology.decimal\_to\_dms(NEW.start\_longitude);

`    `**-- For natal\_charts table (ascendant)** 

`    `ELSIF TG\_TABLE\_NAME = 'natal\_charts' THEN 

`        `NEW.ascendant\_degree\_formatted := astrology.decimal\_to\_dms(NEW.ascendant\_degree);     END IF; 

`    `RETURN NEW; END; 

$ LANGUAGE plpgsql; 

**-- Trigger function to set retrograde indicator based on boolean**

CREATE OR REPLACE FUNCTION astrology.set\_retrograde\_indicator\_trigger() RETURNS TRIGGER AS $ 

BEGIN 

`    `IF NEW.is\_retrograde THEN 

`        `NEW.retrograde\_indicator := 'R'; 

`    `ELSE 

`        `NEW.retrograde\_indicator := ''; 

`    `END IF; 

`    `RETURN NEW; END; 

$ LANGUAGE plpgsql; 

**-- Create triggers for natal planets** 

CREATE TRIGGER format\_natal\_planet\_degrees 

BEFORE INSERT OR UPDATE ON astrology.natal\_planets 

FOR EACH ROW EXECUTE FUNCTION astrology.format\_degree\_trigger(); 

CREATE TRIGGER set\_natal\_planet\_retrograde 

BEFORE INSERT OR UPDATE ON astrology.natal\_planets 

FOR EACH ROW EXECUTE FUNCTION astrology.set\_retrograde\_indicator\_trigger(); 

**-- Create triggers for transit planets** 

CREATE TRIGGER format\_transit\_planet\_degrees 

BEFORE INSERT OR UPDATE ON astrology.transit\_planets 

FOR EACH ROW EXECUTE FUNCTION astrology.format\_degree\_trigger(); 

CREATE TRIGGER set\_transit\_planet\_retrograde 

BEFORE INSERT OR UPDATE ON astrology.transit\_planets 

FOR EACH ROW EXECUTE FUNCTION astrology.set\_retrograde\_indicator\_trigger(); 

9. **MongoDB Collections Specification**
1. **Divisional Chart Collection** 

// Collection: divisional\_charts 

{ 

`  `"\_id": ObjectId("..."), 

`  `"chartId": "UUID reference to derived\_charts in PostgreSQL", 

`  `"baseChartId": "UUID reference to natal\_charts in PostgreSQL",   "chartType": "D-9",  // Divisional chart type code 

`  `"chartName": "Navamsha", 

`  `"calculationMethod": "STANDARD", 

`  `"calculationParameters": { 

`    `"ayanamsa": "LAHIRI", 

`    `"ayanamsaValue": 24.210375, 

`    `"divisionalFactor": 9, 

`    `"houseSystem": "WHOLE\_SIGN" 

`  `}, 

`  `"chartDescription": "Marriage and general fortune chart",   "planets": [ 

`    `{ 

`      `"name": "Sun", 

`      `"sign": "Aries", 

`      `"house": 4, 

`      `"longitude": 12.5, 

`      `"longitudeFormatted": "12° 30' 0.00\"", 

`      `"isRetrograde": false, 

`      `"nakshatra": "Ashwini", 

`      `"nakshatraPada": 4, 

`      `"signLord": "Mars", 

`      `"houseLord": "Moon", 

`      `"aspectsReceived": [ 

`        `{ 

`          `"fromPlanet": "Jupiter", 

`          `"aspectType": "TRINE", 

`          `"orb": 2.3, 

`          `"influence": "BENEFIC" 

`        `} 

`      `] 

`    `} 

`    `// Additional planets... 

`  `], 

`  `"houses": [ 

`    `{ 

`      `"houseNumber": 1, 

`      `"sign": "Capricorn", 

`      `"startLongitude": 270.0, 

`      `"endLongitude": 300.0, 

`      `"signLord": "Saturn", 

`      `"occupants": ["Mars", "Venus"] 

`    `} 

`    `// Additional houses... 

`  `], 

`  `"interpretationSummary": { 

`    `"majorThemes": ["Professional success", "Marriage challenges"],     "planetaryStrengths": { 

`      `"strongest": "Jupiter", 

`      `"weakest": "Saturn" 

`    `}, 

`    `"significantFeatures": [ 

`      `"Exalted Jupiter in 5th house", 

`      `"Debilitated Venus in 8th house" 

`    `] 

`  `}, 

`  `"createdAt": ISODate("2023-01-15T10:30:00Z"), 

`  `"updatedAt": ISODate("2023-01-15T10:30:00Z") 

} 

2. **KP Analysis Collection** 

// Collection: kp\_analysis 

{ 

`  `"\_id": ObjectId("..."), 

`  `"chartId": "UUID reference to natal\_charts in PostgreSQL", 

`  `"entityType": "USER", 

`  `"entityId": "UUID reference to user/business", 

`  `"kpSystem": "CLASSICAL\_KP", 

`  `"subLordAnalysis": { 

`    `"cusps": [ 

`      `{ 

`        `"cuspNumber": 1, 

`        `"longitude": 276.45, 

`        `"longitudeFormatted": "276° 27' 0.00\"", 

`        `"starLord": "Venus", 

`        `"subLord": "Saturn", 

`        `"subSubLord": "Mercury", 

`        `"significators": ["Venus", "Saturn", "Mercury", "Sun"], 

`        `"cuspInterpretation": "Saturn as sublord of ascendant indicates career challenges..."       } 

`      `// Additional cusps... 

`    `], 

`    `"planets": [ 

`      `{ 

`        `"planet": "Sun", 

`        `"longitude": 98.45, 

`        `"longitudeFormatted": "98° 27' 0.00\"", 

`        `"starLord": "Mercury", 

`        `"subLord": "Jupiter", 

`        `"subSubLord": "Venus", 

`        `"significators": ["Mercury", "Jupiter", "Venus"], 

`        `"planetInterpretation": "Sun in Mercury star and Jupiter sublord indicates educational success" 

`      `} 

`      `// Additional planets...     ] 

`  `}, 

`  `"rulingPlanets": { 

`    `"birthTime": ["Moon", "Jupiter", "Mercury"], 

`    `"current": ["Venus", "Mars", "Rahu"] 

`  `}, 

`  `"significators": { 

`    `"house1": { 

`      `"primary": ["Saturn", "Sun"], 

`      `"secondary": ["Mars", "Jupiter"], 

`      `"tertiary": ["Moon", "Venus"] 

`    `} 

`    `// Additional houses... 

`  `}, 

`  `"predictiveAnalysis": { 

`    `"career": { 

`      `"favorablePeriods": [ 

`        `{ 

`          `"startDate": ISODate("2024-03-15T00:00:00Z"), 

`          `"endDate": ISODate("2024 -05-20T00:00:00Z"), 

`          `"rulingPlanets": ["Jupiter", "Venus", "Mercury"], 

`          `"prediction": "Excellent period for career advancement and recognition"

`        `} 

`      `], 

`      `"challengingPeriods": [ 

`        `{ 

`          `"startDate": ISODate("2024-08-10T00:00:00Z"), 

`          `"endDate": ISODate("2024 -09-15T00:00:00Z"), 

`          `"rulingPlanets": ["Saturn", "Rahu", "Mars"], 

`          `"prediction": "Potential obstacles in work environment, conflicts with authority"         } 

`      `] 

`    `} 

`    `// Additional life areas... 

`  `} 

} 

3. **Lo Shu Grid Analysis Collection** 

// Collection: lo\_shu\_grid\_analysis 

{ 

`  `"\_id": ObjectId("..."), 

`  `"analysisId": "UUID reference to numerology\_analyses in PostgreSQL",   "entityType": "BUSINESS", 

`  `"entityId": "UUID reference to business", 

`  `"birthDate": "1997-07-22", 

`  `"gridStructure": [ 

`    `[4, 9, 2], 

`    `[3, 5, 7], 

`    `[8, 1, 6] 

`  `], 

`  `"missingNumbers": [], 

`  `"excessNumbers": { 

`    `"5": 2  // Number 5 appears twice 

`  `}, 

`  `"elementalBalance": { 

`    `"water": 1,  // Number 1 

`    `"fire": 1,   // Number 9 

`    `"earth": 3,  // Numbers 2, 5, 8 

`    `"metal": 2,  // Numbers 6, 7 

`    `"wood": 2    // Numbers 3, 4 

`  `}, 

`  `"lifePathAnalysis": { 

`    `"number": 8, 


`    `"interpretation": "Life path 8 indicates strong material and business focus"   }, 

`  `"personalityAnalysis": { 

`    `"strengths": [ 

`      `"Strong central number (5)", 

`      `"Balanced across most elements",

`      `"Good flow of energy between numbers" 

`    `], 

`    `"challenges": [ 

`      `"Missing number 0", 

`      `"Excess of number 5 indicates potential imbalance in earth element"

`    `] 

`  `}, 

Continuing with extreme precision from the previous section on the Lo Shu Grid Analysis Collection: 

`  `"businessApplicability": { 

`    `"favorablePursuits": [ 

`      `"Financial services", 

`      `"Real estate development", 

`      `"Manufacturing" 

`    `], 

`    `"challenges": [ 

`      `"Creative industries may require additional support",

`      `"Need to maintain balance between ambition and practicality"

`    `], 

`    `"recommendations": [ 

`      `"Leverage strong material energy for business expansion",

`      `"Incorporate more creative elements to balance the excess earth energy",       "Focus on systematic growth with methodical planning"

`    `] 

`  `"compatibilityWithOwner": 8.5,  // On scale of 0-10 

`  `"createdAt": ISODate("2023-01-15T10:30:00Z"), 

`  `"updatedAt": ISODate("2023-01-15T10:30:00Z") 

} 

4. **Dasha Period Analysis Collection** 

// Collection: dasha\_period\_analysis

{ 

`  `"\_id": ObjectId("..."), 

`  `"dashaId": "UUID reference to dasha\_periods in PostgreSQL",   "chartId": "UUID reference to natal\_charts", 

`  `"entityType": "BUSINESS", 

`  `"entityId": "UUID reference to business entity", 

`  `"dashaSystem": "VIMSHOTTARI", 

`  `"currentPeriods": { 

`    `"mahadashaLord": "Jupiter", 

`    `"mahadashaStartDate": ISODate("2018-05-10T00:00:00Z"),     "mahadashaEndDate": ISODate("2034-05-10T00:00:00Z"),     "antardashaLord": "Venus", 

`    `"antardashaStartDate": ISODate("2022-01-15T00:00:00Z"),     "antardashaEndDate": ISODate("2024-09-15T00:00:00Z"),     "pratyanterLord": "Mercury", 

`    `"pratyanterStartDate": ISODate("2023-06-10T00:00:00Z"),     "pratyanterEndDate": ISODate("2023-11-05T00:00:00Z") 

`  `}, 

`  `"planetaryStates": { 

`    `"Jupiter": { 

`      `"natally": { 

`        `"sign": "Capricorn", 

`        `"house": 11, 


`        `"isRetrograde": true, 

`        `"dignity": "FALL" 

`      `}, 

`      `"currently": { 

`        `"transitSign": "Taurus", 

`        `"transitHouse": 3, 

`        `"isRetrograde": false, 

`        `"dignity": "NEUTRAL" 

`      `}, 

`      `"significator": { 

`        `"houses": [2, 5, 9, 11], 

`        `"strength": 7.5 

`      `} 

`    `}, 

`    `"Venus": { 

`      `"natally": { 

`        `"sign": "Leo", 

`        `"house": 6, 

`        `"isRetrograde": false, 

`        `"dignity": "NEUTRAL" 

`      `}, 

`      `"currently": { 

`        `"transitSign": "Pisces", 

`        `"transitHouse": 1, 

`        `"isRetrograde": false, 

`        `"dignity": "EXALTATION"       }, 

`      `"significator": { 

`        `"houses": [1, 6, 7], 

`        `"strength": 8.2 

`      `} 

`    `} 

`    `// Additional planets...   }, 

`  `"periodAnalysis": { 

`    `"jupiterMahaDasha": { 

"generalTheme": "Period of expansion, philosophical growth, and broadening horizons",

`      `"businessSignificance": "Major business expansion, new market penetration, increased international presence", 

`      `"favorableActivities": [ 

`        `"Expanding business ventures", 

`        `"Entering new markets", 

`        `"Legal matters and contracts",

`        `"Higher education and research initiatives"

`      `], 

`      `"challenges": [ 

`        `"Potential for overextension", 

`        `"Need to balance growth with consolidation",

`        `"Managing increased operational complexity"

`      `], 

`      `"planetaryInfluences": { 

`        `"houseLordships": [2, 5], 

`        `"aspectedHouses": [6, 8, 10], 

`        `"significance": "As 2nd and 5th lord, Jupiter influences finance and creative ventures"       } 

`    `}, 

`    `"venusAntardasha": { 

`      `"generalTheme": "Period of relationship enhancement, aesthetic improvements, and comfort", 

`      `"businessSignificance": "Improved partnerships, enhanced product design, luxury market opportunities", 

`      `"favorableActivities": [ 

`        `"Partnership negotiations", 

`        `"Product design and aesthetics",

`        `"Customer experience enhancements",

`        `"Luxury market initiatives" 

`      `], 

`      `"challenges": [ 

`        `"Tendency toward excessive spending",

`        `"Potential complacency in competitive matters",

`        `"Balancing luxury with practicality" 

`      `], 

`      `"planetaryInfluences": { 

`        `"houseLordships": [1, 6], 

`        `"aspectedHouses": [7, 8, 11], 

`        `"significance": "As 1st and 6th lord, Venus influences identity and operational effectiveness"       } 

`    `} 

`    `// Additional dasha periods... 

`  `}, 

`  `"forecasts": { 

`    `"shortTerm": [ 

`      `{ 

`        `"period": "Next 3 months", 

`        `"theme": "Brand enhancement and partnership opportunities",

`        `"keyDates": [ 

`          `{ 

`            `"date": "2023 -05-15", 

`            `"event": "Venus-Jupiter conjunction", 

`            `"significance": "Highly favorable for partnership discussions and brand launches",

`            `"recommendation": "Schedule important partner meetings and brand initiatives"

`          `} 

`          `// Additional key dates... 

`        `], 

`        `"focusAreas": [ 

`          `"Brand development", 

`          `"Partnership negotiations", 

`          `"Product aesthetics" 

`        `] 

`      `} 

`    `], 

`    `"mediumTerm": [ 

`      `{ 

`        `"period": "Next 1 year", 

`        `"theme": "Operational optimization and market expansion",

`        `"keyPeriods": [ 

`          `{ 

`            `"startDate": "2023 -08-10", 

`            `"endDate": "2023 -10-25", 

`            `"lordship": "Mercury-Saturn", 

`            `"significance": "Focus on operational details and structural improvements",

`            `"recommendation": "Implement systems improvements and operational audits"           } 

`          `// Additional key periods... 

`        `], 

`        `"focusAreas": [ 

`          `"Operational efficiency", 

`          `"Market research and expansion planning",

`          `"Technical infrastructure" 

`        `] 

`      `} 

`    `], 

`    `"longTerm": [ 

`      `{ 

`        `"period": "Next 5 years", 

`        `"majorTransitions": [ 

`          `{ 

`            `"date": "2024 -09-15", 

`            `"event": "Venus antardasha to Sun antardasha",

`            `"significance": "Shift from relationship focus to identity and leadership",

`            `"businessImpact": "Greater emphasis on corporate identity and leadership positioning"           } 

`          `// Additional transitions... 

`        `], 

`        `"projectedGrowthPhases": [ 

`          `{ 

`            `"phase": "Expansion Phase", 

`            `"period": "2023-2025", 

`            `"dashaInfluence": "Jupiter-Venus to Jupiter-Sun", 

`            `"businessStrategy": "Aggressive growth and market positioning"

`          `}, 

`          `{ 

`            `"phase": "Consolidation Phase", 

`            `"period": "2025-2027", 

`            `"dashaInfluence": "Jupiter-Moon to Jupiter-Mars", 

`            `"businessStrategy": "Operational optimization and internal strengthening"

`          `} 

`          `// Additional phases... 

`        `] 

`      `} 

`    `] 

`  `} 

} 

5. **Muhurta Analysis Collection** 

// Collection: muhurta\_analysis

{ 

`  `"\_id": ObjectId("..."), 

`  `"timingId": "UUID reference to business\_astrological\_timing in PostgreSQL",   "businessId": "UUID of business entity", 

`  `"timingPurpose": "PRODUCT\_LAUNCH", 

`  `"targetDate": ISODate("2023-07-15T00:00:00Z"), 

`  `"lunarDay": { 

`    `"tithi": "Shukla Panchami", 

`    `"tithiNumber": 5, 

`    `"paksha": "Shukla", 

`    `"tithiQuality": 8.5, 

`    `"tithiSignificance": "Favorable for creative launches and new beginnings"

`  `}, 

`  `"nakshatra": { 

`    `"name": "Pushya", 

`    `"lord": "Saturn", 

`    `"quality": 9.2, 

`    `"significance": "Highly auspicious for business prosperity and stability"

`  `}, 

`  `"yoga": { 

`    `"name": "Siddhi", 

`    `"quality": 9.0, 

`    `"significance": "Accomplishment and successful completion of endeavors"

`  `}, 

`  `"karana": { 

`    `"name": "Vanija", 

`    `"quality": 8.7, 

`    `"significance": "Specifically favorable for business and trading activities"

`  `}, 

`  `"weekdayAnalysis": { 

`    `"day": "Thursday", 

`    `"lord": "Jupiter", 

`    `"quality": 8.5, 

`    `"significance": "Favorable for growth and expansion activities"

`  `}, 

`  `"planetaryPositions": [ 

`    `{ 

`      `"planet": "Sun", 

`      `"sign": "Cancer", 

`      `"degree": "29° 15'", 

`      `"strength": 7.2, 

`      `"significance": "Strong leadership presence and visibility"

`    `} 

`    `// Additional planets... 

`  `], 

`  `"muhurtaWindows": [ 

`    `{ 

`      `"name": "Abhijit Muhurta", 

`      `"startTime": "2023 -07-15T12:05:00Z", 

`      `"endTime": "2023-07-15T12:52:00Z", 

`      `"quality": 9.8, 

`      `"significance": "Most auspicious time of the day, ideal for important beginnings",       "recommendation": "Primary recommended window for the product launch event"     }, 

`    `{ 

`      `"name": "Vijaya Muhurta", 

`      `"startTime": "2023 -07-15T14:30:00Z", 

`      `"endTime": "2023-07-15T15:15:00Z", 

`      `"quality": 8.5, 

`      `"significance": "Victory and success in new ventures",

`      `"recommendation": "Secondary option with favorable outcomes"

`    `} 

`    `// Additional muhurta windows... 

`  `], 

`  `"choghadiyaPeriods": [ 

`    `{ 

`      `"name": "Amrit", 

`      `"startTime": "2023 -07-15T10:45:00Z", 

`      `"endTime": "2023-07-15T12:15:00Z", 

`      `"quality": 9.5, 

`      `"significance": "Nectar period, brings success and prosperity",

`      `"recommendation": "Excellent for initiating important activities"

`    `} 

`    `// Additional periods... 

`  `], 

`  `"horaPeriods": [ 

`    `{ 

`      `"planetaryHour": "Jupiter Hora", 

`      `"startTime": "2023 -07-15T11:30:00Z", 

`      `"endTime": "2023-07-15T12:30:00Z", 

`      `"quality": 8.7, 

`      `"significance": "Hour ruled by Jupiter brings growth and expansion energy",       "recommendation": "Favorable for business expansion activities"

`    `} 

`    `// Additional planetary hours... 

`  `], 

`  `"overallRecommendation": { 

`    `"optimalTimestamp": "2023-07-15T12:15:00Z",     "quality": 9.7,  // Scale of 0-10 

`    `"rationale": "Confluence of Abhijit Muhurta, Amrit Choghadiya, and Jupiter Hora during Pushya nakshatra", 

`    `"implementationGuidelines": [ 

`      `"Begin the main launch announcement precisely at 12:15 PM",

`      `"Have contracts/documents signed during this window",

`      `"Conduct the first sales transaction during this period",

`      `"Incorporate the color blue in launch materials to amplify Jupiter's influence"

`    `] 

`  `}, 

`  `"alternateTimings": [ 

`    `{ 

`      `"timestamp": "2023-07-15T14:45:00Z", 

`      `"quality": 8.6, 

`      `"rationale": "Vijaya Muhurta during favorable Moon transit" 

`    `}, 

`    `{ 

`      `"timestamp": "2023-07-16T10:30:00Z", 

`      `"quality": 8.2, 

`      `"rationale": "Alternative date with strong Mercury position favoring communication"     } 

`  `] 

} 

10. **Redis Caching Architecture** 
1. **Database Structure and Key Patterns** 
- Redis Database Structure and Key Patterns with Optimized TTLs and Specialized Astrological Caching 
- Database 0: Authentication and Session Data
- Pattern: auth:token:{token} "auth:token:a1b2c3d4-e5f6-g7h8-i9j0" -> { 

`  `"user\_id": "UUID of user", 

`  `"expires\_at": 1683647400, 

`  `"device\_id": "UUID of device", 

`  `"created\_at": 1683043800 

} 

- TTL: 24 hours 
- Pattern: user:session:{user\_id} "user:session:f8e7d6c5-b4a3-2109-8765-432109876543" -> {   "last\_activity": 1683043800, 

`  `"device\_id": "UUID of device", 

`  `"app\_version": "1.2.0", 

`  `"subscription\_status": "ACTIVE", 

`  `"subscription\_end\_date": 1693043800

} 

- TTL: 30 minutes, refreshed on activity 
- Database 1: Astrological Data Cache
- Pattern: planet:positions:{date} "planet:positions:2023-07-15" -> { 

`  `"sun": { 

`    `"longitude": 113.5, 

`    `"longitude\_formatted": "113° 30' 0.00\"",     "sign": "Cancer", 

`    `"degree": 23.5, 

`    `"nakshatra": "Ashlesha", 

`    `"nakshatra\_pada": 2, 

`    `"is\_retrograde": false 

`  `}, 

`  `"moon": { 

`    `"longitude": 75.2, 

`    `"longitude\_formatted": "75° 12' 0.00\"",     "sign": "Gemini", 

`    `"degree": 15.2, 

`    `"nakshatra": "Ardra", 

`    `"nakshatra\_pada": 1, 

`    `"is\_retrograde": false 

`  `} 

- Additional planets... 

} 

- TTL: 7 days 
- Pattern: natal:chart:{chart\_id} "natal:chart:a1b2c3d4-e5f6-g7h8-i9j0" -> { 

`  `"chart\_data": { /\* Compressed JSON representation of chart \*/ },   "houses": { /\* House data \*/ }, 

`  `"planets": { /\* Planet positions \*/ }, 

`  `"aspects": { /\* Chart aspects \*/ } 

} 

- TTL: 24 hours 
- Pattern: divisional:chart:{chart\_id}:{div\_type} "divisional:chart:a1b2c3d4-e5f6-g7h8-i9j0:D-9" -> { 

`  `"chart\_data": { /\* Compressed JSON representation of navamsha chart \*/ },   "houses": { /\* House data \*/ }, 

`  `"planets": { /\* Planet positions \*/ }, 

`  `"aspects": { /\* Chart aspects \*/ } 

} 

- TTL: 24 hours 
- Pattern: transit:aspects:{natal\_chart\_id}:{date} "transit:aspects:a1b2c3d4-e5f6-g7h8-i9j0:2023-07-15" -> {   "sun": [ 

`    `{ 

`      `"natal\_planet": "jupiter", 

`      `"aspect\_type": "trine", 

`      `"orb": 2.3, 

`      `"applying": true 

`    `} 

- Additional aspects... 

`  `] 

- Additional transiting planets... 

} 

- TTL: 24 hours 
2. **Specialized Astrological Caching**
- Database 8: Ephemeris Cache
- Pattern: ephemeris:day:{date} "ephemeris:day:2023-07-15" -> { 

`  `"sunrise": "05:42:18", 

`  `"sunset": "19:24:36", 

`  `"moonrise": "10:15:42", 

`  `"moonset": "22:30:18", 

`  `"tithi": "Shukla Panchami", 

`  `"nakshatra": "Pushya", 

`  `"yoga": "Siddhi", 

`  `"karana": "Vanija" 

} 

- TTL: 90 days 
- Database 9: Divisional Chart Cache 
- Pattern: divisional:{chart\_id}:{divisional\_type} "divisional:a1b2c3d4-e5f6-g7h8-i9j0:D-9" -> { 

`  `"ascendant": { 

`    `"sign": "Libra", 

`    `"degree": "15° 30' 0 \"" 

`  `}, 

`  `"planets": { 

`    `"sun": { 

`      `"sign": "Aries", 

`      `"house": 7, 

`      `"longitude": 25.5, 

`      `"longitude\_formatted": "25° 30' 0.00\"" 

`    `} 

- Additional planets... 

`  `} 

} 

- TTL: 24 hours 
- Database 10: Numerology Calculation Cache
- Pattern: numerology:name:{name}:{system} "numerology:name:Goutham Kadamuru:CHALDEAN" -> { 

`  `"compound\_number": 52, 

`  `"root\_number": 7, 

`  `"calculation\_steps": [ 

`    `{"G": 3}, {"o": 7}, {"u": 6}, {"t": 4}, {"h": 5}, {"a": 1}, {"m": 4} 

- Additional steps... 

`  `], 

`  `"planet\_correlations": { 

`    `"root\_planet": "Neptune", 

`    `"compound\_influences": ["Saturn", "Moon"]   } 

} 

- TTL: 30 days 
- Database 11: KP Analysis Cache 
- Pattern: kp:chart:{chart\_id} "kp:chart:a1b2c3d4-e5f6-g7h8-i9j0" -> {   "cusps": [ 

`    `{ 

`      `"number": 1, 

`      `"longitude": 276.45, 

`      `"star\_lord": "Venus", 

`      `"sub\_lord": "Saturn", 

`      `"sub\_sub\_lord": "Mercury" 

`    `} 

- Additional cusps... 

`  `], 

`  `"planets": [ 

`    `{ 

`      `"planet": "Sun", 

`      `"longitude": 98.45, 

`      `"star\_lord": "Mercury", 

`      `"sub\_lord": "Jupiter", 

`      `"sub\_sub\_lord": "Venus" 

`    `} 

- Additional planets... 

`  `], 

`  `"ruling\_planets": ["Moon", "Jupiter", "Mercury"] } 

- TTL: 24 hours 
- Database 12: Muhurta Cache 
- Pattern: muhurta:day:{date} "muhurta:day:2023-07-15" -> {   "day\_quality": 8.5, 

`  `"auspicious\_periods": [ 

`    `{ 

`      `"name": "Abhijit Muhurta",       "start": "12:05:00", 

`      `"end": "12:52:00", 

`      `"quality": 9.8 

`    `}, 

`    `{ 

`      `"name": "Vijaya Muhurta", 

`      `"start": "14:30:00", 

`      `"end": "15:15:00", 

`      `"quality": 8.5 

`    `} 

- Additional periods... 

`  `], 

`  `"choghadiya": [ 

`    `{ 

`      `"name": "Amrit", 

`      `"start": "10:45:00", 

`      `"end": "12:15:00", 

`      `"quality": 9.5 

`    `} 

- Additional periods... 

`  `], 

`  `"inauspicious\_periods": [     { 

`      `"name": "Rahu Kalam",       "start": "09:00:00", 

`      `"end": "10:30:00", 

`      `"quality": 2.5 

`    `} 

- Additional periods... 

`  `] 

} 

- TTL: 7 days 
- Database 13: Dasha Period Cache
- Pattern: dasha:current:{chart\_id} "dasha:current:a1b2c3d4-e5f6-g7h8-i9j0" -> {   "system": "VIMSHOTTARI", 

`  `"maha\_dasha": { 

`    `"planet": "Jupiter", 

`    `"start\_date": "2018-05-10T00:00:00Z", 

`    `"end\_date": "2034-05-10T00:00:00Z", 

`    `"remaining": "11 years, 2 months, 15 days"   }, 

`  `"antar\_dasha": { 

`    `"planet": "Venus", 

`    `"start\_date": "2022-01-15T00:00:00Z", 

`    `"end\_date": "2024-09-15T00:00:00Z", 

`    `"remaining": "1 year, 6 months, 3 days" 

`  `}, 

`  `"pratyantar\_dasha": { 

`    `"planet": "Mercury", 

`    `"start\_date": "2023-06-10T00:00:00Z", 

`    `"end\_date": "2023-11-05T00:00:00Z", 

`    `"remaining": "3 months, 22 days" 

`  `} 

} 

- TTL: 1 day 
11. **Implementation and Optimization Strategy** 
1. **Phased Implementation Approach** 

**Phase 1: Core Schema Setup (Weeks 1-2)** 

1. Set up PostgreSQL with all required extensions 
   1. Enable uuid-ossp, postgis, timescaledb, pgcrypto
   1. Configure work\_mem and effective\_cache\_size parameters
   1. Set up connection pooling with PgBouncer
1. Initialize core schema tables (users, authentication, subscriptions) 
   1. Create table structures with appropriate constraints
   1. Configure indexing strategy for core entities 
   1. Implement audit triggers for change tracking
1. Create MongoDB database and establish connection 
   1. Set up collections with validation schemas
   1. Configure indexes for frequent query patterns
   1. Establish connection pooling with optimal settings
1. Configure Redis instances with appropriate database divisions 
   1. Set up Redis Sentinel for high availability 
   1. Configure persistence strategy for critical data
   1. Implement connection management with optimal timeouts
1. Implement initial indexing strategy  
- Create standard B-tree indexes for lookup fields 
- Implement GIN indexes for JSONB data 
- Set up spatial indexes for geolocation data

**Phase 2: Astrological Data Implementation (Weeks 3-4)** 

1. Create astrology schema tables in PostgreSQL 
   1. Set up natal\_charts, derived\_charts, and planetary tables
   1. Implement triggers for automatic conversions
   1. Create constraints and foreign key relationships
1. Set up MongoDB collections for detailed chart data 
   1. Implement divisional\_charts collection with validation
   1. Configure kp\_analysis collection with subdocument structure
   1. Set up appropriate indexing for regular query patterns
1. Initialize Redis caching for planetary positions  
   1. Configure TTL strategies for astronomical data 
   1. Set up cache invalidation mechanisms
   1. Implement batch retrieval patterns
1. Establish data synchronization between PostgreSQL and MongoDB 
   1. Create consistent UUID reference mechanism
   1. Implement event-based update propagation
   1. Set up validation for cross-database integrity 
1. Implement TimescaleDB hypertables for time-series data  
- Configure chunk optimization for historical data
- Set up retention policies for transits
- Implement specialized time-series indexes 

**Phase 3: Numerology and Business Integration (Weeks 5-6)** 

1. Implement comprehensive numerology structures 
   1. Set up numerology\_systems reference data
   1. Create numerology\_analyses table with system-specific parameters 
   1. Implement lo\_shu\_grid\_analyses with appropriate structure
1. Create business astrological integration 
- Set up business\_profiles with astrological parameters
- Implement business\_numerology with enhanced fields
  1. Create business\_astrological\_timing with muhurta precision
3. Set up relationship chart structures 
   1. Implement relationship\_charts for synastry analysis
   1. Create progressive\_charts for temporal projections
   1. Set up appropriate indexing and constraints
3. Configure MongoDB collections for detailed analyses 
   1. Implement business\_synastry\_charts collection
   1. Set up lo\_shu\_grid\_analysis with business focus
   1. Create muhurta\_analysis with precision timing windows

**Phase 4: Dasha System and Specialized Features (Weeks 7-8)** 

1. Implement comprehensive dasha system 
   1. Create dasha\_systems reference data
   1. Set up hierarchical tables for period analysis
   1. Implement appropriate constraints and relationships
1. Create KP system tables  
   1. Set up kp\_star\_lords with sub-lord structure 
   1. Implement kp\_significators with house mapping
   1. Create kp\_ruling\_planets with temporal analysis
1. Set up muhurta and timing systems 
   1. Create hindu\_calendar with event tracking
   1. Implement specialized muhurta windows
   1. Set up appropriate indexing for time-based queries 
1. Implement MongoDB collections for predictive analytics 
   1. Create dasha\_period\_analysis with forecast structure
   1. Set up muhurta\_analysis with detailed timing windows
   1. Configure appropriate indexing and validation rules
1. Configure Redis caching for predictive data  
- Set up ephemeris caching with long TTLs 
- Implement dasha position with refresh mechanisms
- Create muhurta windows with specialized caching
2. **Optimization Strategy** 

**Database Performance Optimization** 

1. **PostgreSQL Optimization**: 
   1. Implement appropriate connection pooling (32-64 connections) 
   1. Configure work\_mem=128MB for complex join operations 
   1. Set effective\_cache\_size to 70% of available memory
   1. Configure autovacuum for optimal performance
   1. Implement parallel query execution for complex operations
1. **MongoDB Optimization**: 
   1. Use covered queries for high-volume operations 
   1. Implement proper index intersection techniques
   1. Set appropriate write concern levels (w:1, j:true)
   1. Configure read preference modes for query distribution
   1. Implement document validation rules for data integrity
1. **Redis Optimization**: 
- Configure maxmemory policy (volatile-ttl recommended) 
- Set appropriate eviction strategies for different databases
- Implement pipelining for batch operations
- Configure persistence with RDB snapshots and AOF logging
- Use Redis Cluster for distributed caching when needed

**Angular Measurement Optimization** 

1. **Storage Efficiency**: 
   1. Store decimal degrees internally for calculation precision
   1. Cache formatted DMS values to avoid repetitive conversions
   1. Implement triggers for automatic format synchronization
   1. Use appropriate precision levels (6 decimal places for calculation)
1. **Calculation Performance**: 
- Implement specialized functions for common conversions
- Use lookup tables for frequent angle operations
- Cache intermediate results for complex calculations
- Optimize DMS parsing with regular expressions 

**Time-Series Data Optimization** 

1. **Chunk Sizing Strategy**: 
   1. Configure chunk\_time\_interval=INTERVAL '1 month' for transits 
   1. Set compression policy for historical data
   1. Implement retention policy for ephemeral data
   1. Optimize chunk size for balanced query performance
1. **Indexing Strategy**: 
   1. Create composite indexes on (planet, transit\_timestamp)
   1. Set up partial indexes for retrograde data
   1. Implement specialized indexes for planetary position ranges
   1. Optimize time-bucket queries for aggregation operations
3. **Data Integrity Framework** 

**Cross-Database Consistency** 

1. **UUID Reference Architecture**: 
   1. Use consistent UUIDs across all databases
   1. Implement validation for cross-database references
   1. Create synchronization mechanisms for cascading updates
   1. Set up integrity checking procedures
1. **Astrological Data Validation**: 
   1. Validate angular measurements within appropriate ranges
   1. Ensure house numbers are within 1-12 range 
   1. Validate planetary positions against ephemeris data
   1. Implement chart coherence validation for house signs
1. **Numerological System Validation**: 
   1. Validate calculation results against system rules
   1. Ensure Lo Shu grid follows mathematical constraints
   1. Validate compound to root number reduction
   1. Implement character mapping validation for different systems
1. **Cache Consistency**: 
- Implement write-through caching for critical data 
- Create hierarchical invalidation for dependent caches
- Set up TTL optimization by data volatility 
- Implement partial cache updates for efficiency
12. **Integration and Data Flow Architecture** 
1. **Divisional Chart Generation Flow** 

sequenceDiagram 

`    `participant Mobile App 

`    `participant API Server 

`    `participant Redis Cache 

`    `participant Astro Engine 

`    `participant PostgreSQL 

`    `participant MongoDB 

`    `Mobile App->>API Server: Request Divisional Chart (chart\_id, div\_type)     API Server->>Redis Cache: Check Divisional Chart Cache

`    `alt Cache Hit 

`        `Redis Cache-->>API Server: Return Cached Chart 

`    `else Cache Miss 

`        `API Server->>PostgreSQL: Get Base Chart Data 

`        `PostgreSQL-->>API Server: Return Base Chart 

`        `API Server->>Astro Engine: Calculate Divisional Chart 

`        `Astro Engine->>Astro Engine: Apply Divisional Calculations 

`        `Astro Engine->>PostgreSQL: Store Divisional Chart Data 

`        `Astro Engine->>PostgreSQL: Store Planet Positions 

`        `Astro Engine->>PostgreSQL: Store House Positions 

`        `Astro Engine->>MongoDB: Store Detailed Chart Analysis 

`        `Astro Engine->>Redis Cache: Cache Divisional Chart 

`        `Astro Engine-->>API Server: Return Divisional Chart 

`    `end 

`    `API Server-->>Mobile App: Return Divisional Chart Data 

2. **KP System Analysis Flow** 

sequenceDiagram 

`    `participant Mobile App 

`    `participant API Server 

`    `participant Redis Cache 

`    `participant KP Engine 

`    `participant PostgreSQL 

`    `participant MongoDB 

`    `Mobile App->>API Server: Request KP Analysis 

`    `API Server->>Redis Cache: Check KP Analysis Cache     alt Cache Hit 

`        `Redis Cache-->>API Server: Return Cached Analysis     else Cache Miss 

`        `API Server->>PostgreSQL: Get Chart Data 

`        `PostgreSQL-->>API Server: Return Chart Data 

`        `API Server->>KP Engine: Perform KP Analysis 

`        `KP Engine->>KP Engine: Calculate Star Lords 

`        `KP Engine->>KP Engine: Calculate Sub Lords 

`        `KP Engine->>KP Engine: Determine Significators 

`        `KP Engine->>KP Engine: Identify Ruling Planets 

`        `KP Engine->>PostgreSQL: Store Basic KP Data 

`        `KP Engine->>MongoDB: Store Detailed KP Analysis         KP Engine->>Redis Cache: Cache KP Analysis 

`        `KP Engine-->>API Server: Return KP Analysis 

`    `end 

`    `API Server-->>Mobile App: Return KP Analysis 

3. **Business Muhurta Selection Flow** sequenceDiagram 

   `    `participant Mobile App 

   `    `participant API Server 

   `    `participant Redis Cache 

   `    `participant Muhurta Engine 

   `    `participant PostgreSQL 

   `    `participant MongoDB 

   `    `Mobile App->>API Server: Request Muhurta (business\_id, activity, date\_range)

   `    `API Server->>Redis Cache: Check Recent Muhurta Analysis

   `    `alt Cache Hit 

   `        `Redis Cache-->>API Server: Return Cached Analysis 

   `    `else Cache Miss 

   `        `API Server->>PostgreSQL: Get Business Chart Data 

   `        `PostgreSQL-->>API Server: Return Business Chart 

   `        `API Server->>Muhurta Engine: Calculate Auspicious Times 

   `        `Muhurta Engine->>Muhurta Engine: Analyze Planetary Positions 

   `        `Muhurta Engine->>Muhurta Engine: Calculate Daily Muhurtas 

   `        `Muhurta Engine->>Muhurta Engine: Evaluate Specific Tithis/Nakshatras

   `        `Muhurta Engine->>Muhurta Engine: Score Time Windows 

   `        `Muhurta Engine->>PostgreSQL: Store Basic Muhurta Data 

   `        `Muhurta Engine->>MongoDB: Store Detailed Muhurta Analysis 

   `        `Muhurta Engine->>Redis Cache: Cache Muhurta Analysis 

   `        `Muhurta Engine-->>API Server: Return Muhurta Recommendations 

   `    `end 

   `    `API Server-->>Mobile App: Return Optimal Timing Data 

13. **Indexing Strategy** 
1. **PostgreSQL Indexing** 

Continuing with the PostgreSQL Indexing section: 

-- Core schema indexes 

CREATE INDEX idx\_users\_dob ON core.users(date\_of\_birth); 

CREATE INDEX idx\_users\_status ON core.users(account\_status);

CREATE INDEX idx\_auth\_logs\_user\_id ON core.authentication\_logs(user\_id); CREATE INDEX idx\_auth\_logs\_created\_at ON core.authentication\_logs(created\_at);

CREATE INDEX idx\_user\_devices\_user\_id ON core.user\_devices(user\_id); 

CREATE INDEX idx\_user\_subscriptions\_user\_id ON core.user\_subscriptions(user\_id); CREATE INDEX idx\_user\_subscriptions\_status ON core.user\_subscriptions(status);

CREATE INDEX idx\_user\_subscriptions\_dates ON core.user\_subscriptions(start\_date, end\_date); 

CREATE INDEX idx\_payment\_transactions\_user\_id ON core.payment\_transactions(user\_id); CREATE INDEX idx\_payment\_transactions\_status ON core.payment\_transactions(status);

-- Astrology schema indexes 

CREATE INDEX idx\_natal\_charts\_entity ON astrology.natal\_charts(entity\_type, user\_id, business\_id, partner\_id); 

CREATE INDEX idx\_natal\_charts\_birth\_date ON astrology.natal\_charts(birth\_date);

CREATE INDEX idx\_natal\_charts\_ascendant ON astrology.natal\_charts(ascendant\_sign, ascendant\_degree); 

CREATE INDEX idx\_natal\_planets\_chart\_id ON astrology.natal\_planets(chart\_id); 

CREATE INDEX idx\_natal\_planets\_zodiac ON astrology.natal\_planets(planet, sign, house); CREATE INDEX idx\_natal\_planets\_retrograde ON astrology.natal\_planets(planet, is\_retrograde); CREATE INDEX idx\_natal\_houses\_chart\_id ON astrology.natal\_houses(chart\_id); 

CREATE INDEX idx\_transit\_charts\_natal\_chart ON astrology.transit\_charts(natal\_chart\_id); CREATE INDEX idx\_transit\_charts\_timestamp ON astrology.transit\_charts(transit\_timestamp); CREATE INDEX idx\_transit\_planets\_transit\_id ON astrology.transit\_planets(transit\_id); CREATE INDEX idx\_transit\_planets\_planet ON astrology.transit\_planets(planet, sign, house);

CREATE INDEX idx\_daily\_transits\_planet\_time ON astrology.daily\_transits(planet, transit\_timestamp); 

CREATE INDEX idx\_daily\_transits\_zodiac ON astrology.daily\_transits(zodiac\_sign, planet); 

CREATE INDEX idx\_derived\_charts\_base\_type ON astrology.derived\_charts(base\_chart\_id, chart\_type\_id); 

CREATE INDEX idx\_derived\_chart\_planets\_chart ON astrology.derived\_chart\_planets(derived\_chart\_id);

-- KP system indexes 

CREATE INDEX idx\_kp\_star\_lords\_chart ON astrology.kp\_star\_lords(chart\_id, horoscope\_point);

CREATE INDEX idx\_kp\_significators\_chart\_house ON astrology.kp\_significators(chart\_id, house\_number); 

CREATE INDEX idx\_kp\_ruling\_planets\_chart ON astrology.kp\_ruling\_planets(chart\_id, kp\_chart\_type); 

-- Numerology indexes 

CREATE INDEX idx\_numerology\_analyses\_entity ON astrology.numerology\_analyses(entity\_type, user\_id, business\_id, partner\_id);

CREATE INDEX idx\_numerology\_analyses\_system ON astrology.numerology\_analyses(numerology\_system\_id, root\_number);

CREATE INDEX idx\_lo\_shu\_grid\_analyses\_analysis ON astrology.lo\_shu\_grid\_analyses(numerology\_analysis\_id);

-- Dasha system indexes 

CREATE INDEX idx\_dasha\_periods\_chart ON astrology.dasha\_periods(chart\_id, dasha\_system\_id); 

CREATE INDEX idx\_mahadasha\_periods\_dasha ON astrology.mahadasha\_periods(dasha\_id, planet); 

CREATE INDEX idx\_mahadasha\_periods\_dates ON astrology.mahadasha\_periods(start\_date, end\_date); 

CREATE INDEX idx\_antardasha\_periods\_mahadasha ON astrology.antardasha\_periods(mahadasha\_id, planet);

CREATE INDEX idx\_antardasha\_periods\_dates ON astrology.antardasha\_periods(start\_date, end\_date); 

CREATE INDEX idx\_pratyantardasha\_periods\_antardasha ON astrology.pratyantardasha\_periods(antardasha\_id, planet);

-- Partial and specialized indexes 

CREATE INDEX idx\_active\_users ON core.users(user\_id) WHERE account\_status = 'ACTIVE'; 

CREATE INDEX idx\_current\_subscriptions ON core.user\_subscriptions(user\_id, plan\_id) WHERE end\_date > CURRENT\_DATE; 

CREATE INDEX idx\_retrograde\_planets ON astrology.natal\_planets(chart\_id, planet) WHERE is\_retrograde = TRUE; 

CREATE INDEX idx\_future\_transits ON astrology.transit\_charts(natal\_chart\_id, transit\_timestamp) WHERE transit\_timestamp > CURRENT\_TIMESTAMP; 

-- GIN indexes for JSONB fields 

CREATE INDEX idx\_chart\_data\_gin ON astrology.natal\_charts USING GIN (chart\_data); 

CREATE INDEX idx\_numerology\_analysis\_gin ON astrology.numerology\_analyses USING GIN (full\_analysis); 

CREATE INDEX idx\_business\_timing\_factors\_gin ON business.business\_astrological\_timing USING GIN (astrological\_factors); 

CREATE INDEX idx\_dasha\_planet\_state\_gin ON astrology.mahadasha\_periods USING GIN (planet\_state); 

-- Spatial indexes 

CREATE INDEX idx\_users\_birth\_coordinates ON core.users USING GIST (birth\_coordinates); 

CREATE INDEX idx\_business\_coordinates ON business.business\_profiles USING GIST (incorporation\_coordinates); 

2. **MongoDB Indexing Strategy** 

// Divisional charts collection indexes

db.divisional\_charts.createIndex({ "chartId": 1 }, { unique: true }); db.divisional\_charts.createIndex({ "baseChartId": 1 }); db.divisional\_charts.createIndex({ "chartType": 1, "baseChartId": 1 }); db.divisional\_charts.createIndex({ "planets.name": 1, "planets.sign": 1 });

// KP analysis collection indexes 

db.kp\_analysis.createIndex({ "chartId": 1 }, { unique: true }); db.kp\_analysis.createIndex({ "entityType": 1, "entityId": 1 }); db.kp\_analysis.createIndex({ "subLordAnalysis.cusps.cuspNumber": 1, "chartId": 1 }); db.kp\_analysis.createIndex({ "subLordAnalysis.planets.planet": 1, "chartId": 1 });

// Lo Shu grid analysis collection indexes db.lo\_shu\_grid\_analysis.createIndex({ "analysisId": 1 }, { unique: true }); db.lo\_shu\_grid\_analysis.createIndex({ "entityType": 1, "entityId": 1 }); db.lo\_shu\_grid\_analysis.createIndex({ "missingNumbers": 1 });

// Dasha period analysis collection indexes db.dasha\_period\_analysis.createIndex({ "dashaId": 1 }, { unique: true }); db.dasha\_period\_analysis.createIndex({ "chartId": 1, "dashaSystem": 1 }); db.dasha\_period\_analysis.createIndex({ "currentPeriods.mahadashaLord": 1 }); db.dasha\_period\_analysis.createIndex({ "currentPeriods.antardashaLord": 1 });

// Muhurta analysis collection indexes

db.muhurta\_analysis.createIndex({ "timingId": 1 }, { unique: true }); db.muhurta\_analysis.createIndex({ "businessId": 1, "timingPurpose": 1 }); db.muhurta\_analysis.createIndex({ "targetDate": 1 });

db.muhurta\_analysis.createIndex({ "muhurtaWindows.quality": -1 });  // Descending for highest quality first 

// Compound indexes for frequent query patterns

db.divisional\_charts.createIndex({ "baseChartId": 1, "chartType": 1, "createdAt": -1 }); db.kp\_analysis.createIndex({ "chartId": 1, "kpSystem": 1, "subLordAnalysis.planets.planet": 1 }); db.dasha\_period\_analysis.createIndex({ 

`    `"entityType": 1,  

`    `"entityId": 1,  

`    `"currentPeriods.mahadashaLord": 1, 

`    `"currentPeriods.antardashaLord": 1 

}); 

// Text indexes for search functionality db.kp\_analysis.createIndex({  

`    `"predictiveAnalysis.career.favorablePeriods.prediction": "text",

`    `"predictiveAnalysis.career.challengingPeriods.prediction": "text"

}, {  

`    `weights: { 

`        `"predictiveAnalysis.career.favorablePeriods.prediction": 2,

`        `"predictiveAnalysis.career.challengingPeriods.prediction": 1

`    `}, 

`    `name: "career\_predictions\_text"

}); 

14. **Performance Optimization Framework** 
1. **Query Optimization Techniques** 
1. **PostgreSQL Query Optimization** 

-- Optimized query for retrieving natal chart with planets and houses EXPLAIN ANALYZE 

SELECT  

`    `nc.chart\_id, 

`    `nc.entity\_type, 

`    `nc.ascendant\_sign, 

`    `nc.ascendant\_degree\_formatted,

`    `nc.ayanamsa, 

`    `nc.ayanamsa\_value, 

`    `nc.house\_system, 

`    `JSONB\_BUILD\_OBJECT( 

`        `'planets', ( 

`            `SELECT JSONB\_AGG(JSONB\_BUILD\_OBJECT( 

`                `'planet', np.planet, 

`                `'sign', np.sign, 

`                `'house', np.house, 

`                `'degree', np.degree\_formatted,

`                `'retrograde', np.retrograde\_indicator,

`                `'nakshatra', np.nakshatra,

`                `'nakshatra\_pada', np.nakshatra\_pada

`            `)) 

`            `FROM astrology.natal\_planets np 

`            `WHERE np.chart\_id = nc.chart\_id 

`        `), 

`        `'houses', ( 

`            `SELECT JSONB\_AGG(JSONB\_BUILD\_OBJECT(                 'house', nh.house\_number,

`                `'sign', nh.sign, 

`                `'degree', nh.start\_longitude\_formatted

`            `)) 

`            `FROM astrology.natal\_houses nh 

`            `WHERE nh.chart\_id = nc.chart\_id 

`        `) 

`    `) AS chart\_structure 

FROM 

`    `astrology.natal\_charts nc 

WHERE  

`    `nc.user\_id = '123e4567-e89b-12d3-a456-426614174000'; 

-- Optimized query for current dasha periods EXPLAIN ANALYZE 

WITH current\_maha AS ( 

`    `SELECT 

`        `md.mahadasha\_id, 

`        `md.dasha\_id, 

`        `md.planet AS maha\_planet, 

`        `md.start\_date AS maha\_start,

`        `md.end\_date AS maha\_end 

`    `FROM 

`        `astrology.mahadasha\_periods md

`    `WHERE 

`        `md.start\_date <= CURRENT\_TIMESTAMP 

`        `AND md.end\_date > CURRENT\_TIMESTAMP 

), 

current\_antar AS ( 

`    `SELECT 

`        `ad.antardasha\_id, 

`        `ad.mahadasha\_id, 

`        `ad.planet AS antar\_planet, 

`        `ad.start\_date AS antar\_start,

`        `ad.end\_date AS antar\_end 

`    `FROM 

`        `astrology.antardasha\_periods ad

`    `JOIN 

`        `current\_maha cm ON ad.mahadasha\_id = cm.mahadasha\_id     WHERE 

`        `ad.start\_date <= CURRENT\_TIMESTAMP 

`        `AND ad.end\_date > CURRENT\_TIMESTAMP 

), 

current\_pratyantar AS ( 

`    `SELECT 

`        `pd.pratyantardasha\_id, 

`        `pd.antardasha\_id, 

`        `pd.planet AS pratyantar\_planet, 

`        `pd.start\_date AS pratyantar\_start,

`        `pd.end\_date AS pratyantar\_end 

`    `FROM 

`        `astrology.pratyantardasha\_periods pd

`    `JOIN 

`        `current\_antar ca ON pd.antardasha\_id = ca.antardasha\_id

`        `pd.start\_date <= CURRENT\_TIMESTAMP 

`        `AND pd.end\_date > CURRENT\_TIMESTAMP 

) 

SELECT 

`    `dp.chart\_id, 

`    `ds.system\_name, 

`    `cm.maha\_planet, 

`    `cm.maha\_start, 

`    `cm.maha\_end, 

`    `ca.antar\_planet, 

`    `ca.antar\_start, 

`    `ca.antar\_end, 

`    `cp.pratyantar\_planet, 

`    `cp.pratyantar\_start, 

`    `cp.pratyantar\_end 

FROM 

`    `astrology.dasha\_periods dp

JOIN 

`    `astrology.dasha\_systems ds ON dp.dasha\_system\_id = ds.dasha\_system\_id JOIN 

`    `current\_maha cm ON dp.dasha\_id = cm.dasha\_id

LEFT JOIN 

`    `current\_antar ca ON cm.mahadasha\_id = ca.mahadasha\_id

LEFT JOIN 

`    `current\_pratyantar cp ON ca.antardasha\_id = cp.antardasha\_id

WHERE 

`    `dp.chart\_id = '123e4567-e89b-12d3-a456-426614174000' 

`    `AND ds.system\_name = 'VIMSHOTTARI'; 

2. **MongoDB Query Optimization** 


// Optimized query for KP analysis with projection 

db.kp\_analysis.find( 

`    `{ "chartId": "123e4567-e89b-12d3-a456-426614174000" }, 

`    `{ 

`        `"subLordAnalysis.cusps": { 

`            `$filter: { 

`                `input: "$subLordAnalysis.cusps", 

`                `as: "cusp", 

`                `cond: { $in: ["$$cusp.cuspNumber", [1, 4, 7, 10]] }  // Angular houses only

`           `} 

`        `}, 

`        `"subLordAnalysis.planets": { 

`            `$filter: { 

`                `input: "$subLordAnalysis.planets", 

`                `as: "planet", 

`                `cond: { $in: ["$$planet.planet", ["SUN", "MOON", "JUPITER", "SATURN"]] }  // Key planets            } 

`        `}, 

`        `"rulingPlanets": 1, 

`        `"significators": { 

`            `"house1": 1,  // Only include specific houses

`            `"house10": 1 

`        `} 

`    `} 

).hint({ "chartId": 1 });  // Force index usage 

// Aggregation pipeline for business forecast db.dasha\_period\_analysis.aggregate([

`    `{ 

`        `$match: { 

`            `"entityType": "BUSINESS", 

`            `"entityId": "123e4567-e89b-12d3-a456-426614174000", 

`            `"currentPeriods.antardashaEndDate": { $gt: new Date() }

`        `} 

`    `}, 

`    `{ 

`        `$project: { 

`            `"\_id": 0, 

`            `"dashaSystem": 1, 

`            `"currentPeriods": 1, 

`            `"forecasts.shortTerm": 1, 

`            `"forecasts.mediumTerm": 1, 

`            `"planetaryStates": { 

`                `$filter: { 

`                    `input: { $objectToArray: "$planetaryStates" }, 

`                    `as: "planet", 

`                    `cond: { 

`                        `$or: [ 

`                            `{ $eq: ["$$planet.k", "$currentPeriods.mahadashaLord"] },                             { $eq: ["$$planet.k", "$currentPeriods.antardashaLord"] }                         ] 

`                    `} 

`               `} 

`           `} 

`        `} 

`    `}, 

`    `{ 

`        `$addFields: { 

`            `"planetaryStates": { $arrayToObject: "$planetaryStates" }

`        `} 

`    `} ]); 

// Optimized muhurta recommendation query db.muhurta\_analysis.find( 

`    `{ 

`        `"businessId": "123e4567-e89b-12d3-a456-426614174000",         "timingPurpose": "PRODUCT\_LAUNCH", 

`        `"targetDate": { 

`            `$gte: new Date("2023 -07-01"), 

`            `$lte: new Date("2023 -07-31") 

`        `}, 

`        `"muhurtaWindows.quality": { $gt: 8.0 } 

`    `}, 

`    `{ 

`        `"targetDate": 1, 

`        `"muhurtaWindows": { 

`            `$filter: { 

`                `input: "$muhurtaWindows", 

`                `as: "window", 

`                `cond: { $gt: ["$$window.quality", 8.0] } 

`           `} 

`        `}, 

`        `"overallRecommendation": 1, 

`        `"lunarDay": 1, 

`        `"nakshatra": 1 

`    `} 

).sort({ "overallRecommendation.quality": -1 }).limit(5); 

2. **Caching Strategy Optimization** 
1. **Redis Cached Queries for Frequent Operations**

// Function to get transit positions with Redis caching

async function getPlanetaryPositions(date) {

`    `const redisKey = `planet:positions:${date.toISOString().split('T')[0]}`;

`    `// Try cache first 

`    `const cachedData = await redisClient.get(redisKey);     if (cachedData) { 

`        `return JSON.parse(cachedData);

`    `} 

`    `// Cache miss, fetch from database

`    `const positions = await pool.query(`         SELECT 

`            `planet, 

`            `longitude, 

`            `degree\_formatted, 

`            `sign, 

`            `is\_retrograde, 

`            `retrograde\_indicator, 

`            `nakshatra, 

`            `nakshatra\_pada 

`        `FROM 

`            `astrology.daily\_transits 

`        `WHERE 

`            `transit\_timestamp::date = $1

`        `ORDER BY 

`            `planet 

`    ``, [date.toISOString().split('T')[0]]); 

// Format results 

`    `const results = {}; 

`    `for (const row of positions.rows) { 

`        `results[row.planet.toLowerCase()] = { 

`            `longitude: parseFloat(row.longitude),

`            `longitude\_formatted: row.degree\_formatted,

`            `sign: row.sign, 

`            `is\_retrograde: row.is\_retrograde, 

`            `retrograde\_indicator: row.retrograde\_indicator,             nakshatra: row.nakshatra,

`            `nakshatra\_pada: row.nakshatra\_pada

`        `}; 

`    `} 

// Cache the results with TTL 

await redisClient.set(redisKey, JSON.stringify(results), 'EX', 86400 \* 7); // 7 day TTL 

`    `return results; } 

// Function to get current dasha periods with Redis caching

async function getCurrentDashaPeriods(chartId, dashaSystem = 'VIMSHOTTARI') {     const redisKey = `dasha:current:${chartId}`;

`    `// Try cache first 

`    `const cachedData = await redisClient.get(redisKey);     if (cachedData) { 

`        `return JSON.parse(cachedData);

`    `} 

// Cache miss, fetch from database with complex query

`    `const result = await pool.query(`

`        `WITH current\_maha AS ( 

`            `SELECT 

`                `md.mahadasha\_id, 

`                `md.planet AS maha\_planet, 

`                `md.start\_date AS maha\_start,

`                `md.end\_date AS maha\_end 

`            `FROM 

`                `astrology.mahadasha\_periods md

`            `JOIN 

`                `astrology.dasha\_periods dp ON md.dasha\_id = dp.dasha\_id

`            `JOIN 

`                `astrology.dasha\_systems ds ON dp.dasha\_system\_id = ds.dasha\_system\_id             WHERE 

`                `dp.chart\_id = $1 

`                `AND ds.system\_name = $2 

`                `AND md.start\_date <= CURRENT\_TIMESTAMP 

`                `AND md.end\_date > CURRENT\_TIMESTAMP 

`        `), 

`        `current\_antar AS ( 

`            `/\* Similar structure for antardasha \*/

`        `), 

`        `current\_pratyantar AS ( 

`            `/\* Similar structure for pratyantardasha \*/

`        `) 

`        `/\* Full query implementation \*/ 

`    ``, [chartId, dashaSystem]); 

// Format and structure the results const dashaData = { 

`        `system: dashaSystem, 

`        `maha\_dasha: { 

`            `planet: result.rows[0].maha\_planet,

`            `start\_date: result.rows[0].maha\_start,

`            `end\_date: result.rows[0].maha\_end,

`            `remaining: calculateRemaining(result.rows[0].maha\_end)         }, 

`        `/\* Format additional levels \*/ 

`    `}; 

// Cache the results with TTL 

await redisClient.set(redisKey, JSON.stringify(dashaData), 'EX', 86400); // 1 day TTL 

`    `return dashaData; 

} 

2. **Batch Operations and Pipeline Optimization** // Redis pipeline for batch retrieval 

   async function batchGetAstroDailyData(date) {

   `    `const dateStr = date.toISOString().split('T')[0]; 

const pipeline = redisClient.pipeline(); 

// Queue multiple gets in single operation pipeline.get(`planet:positions:${dateStr}`); pipeline.get(`ephemeris:day:${dateStr}`); pipeline.get(`muhurta:day:${dateStr}`);

// Execute pipeline 

const results = await pipeline.exec();

// Process results 

const planetaryPositions = results[0][1] ? JSON.parse(results[0][1]) : null; const ephemerisData = results[1][1] ? JSON.parse(results[1][1]) : null; const muhurtaData = results[2][1] ? JSON.parse(results[2][1]) : null;

`    `// Fill in any missing data from database 

`    `const response = { 

`        `date: dateStr, 

`        `planetary\_positions: planetaryPositions || await fetchPlanetaryPositions(date),         ephemeris: ephemerisData || await fetchEphemerisData(date),

`        `muhurta: muhurtaData || await fetchMuhurtaData(date)

`    `}; 

// Cache any missing data 

if (!planetaryPositions && response.planetary\_positions) {

`        `redisClient.set(`planet:positions:${dateStr}`, JSON.stringify(response.planetary\_positions), 'EX', 86400 \* 7);

} 

if (!ephemerisData && response.ephemeris) { 

`        `redisClient.set(`ephemeris:day:${dateStr}`, JSON.stringify(response.ephemeris), 'EX', 86400 \* 90); 

} 

if (!muhurtaData && response.muhurta) { 

`        `redisClient.set(`muhurta:day:${dateStr}`, JSON.stringify(response.muhurta), 'EX', 86400 \* 7); 

} 

`    `return response; } 

15. **Backup and Disaster Recovery Strategy** 
1. **PostgreSQL Backup Configuration** 
- Daily full backup script 

#!/bin/bash 

- Configuration 

BACKUP\_DIR="/backup/postgres/daily" POSTGRES\_CONTAINER="postgres-primary" BACKUP\_RETENTION=7  # days 

DATE=$(date +%Y-%m-%d) BACKUP\_FILE="${BACKUP\_DIR}/postgres\_full\_${DATE}.dump" 

- Ensure backup directory exists mkdir -p ${BACKUP\_DIR} 
- Execute pg\_dump 

  docker exec ${POSTGRES\_CONTAINER} pg\_dump \     -U postgres \ 

  `    `-Fc \ 

  `    `-v \ 

  `    `-f /tmp/backup.dump \ 

  `    `corp\_astro 

- Copy the backup from container to host

docker cp ${POSTGRES\_CONTAINER}:/tmp/backup.dump ${BACKUP\_FILE} 

- Compress 

gzip ${BACKUP\_FILE} 

- Remove old backups 

find ${BACKUP\_DIR} -name "postgres\_full\_\*.dump.gz"  -mtime +${BACKUP\_RETENTION} -delete 

- WAL archiving is assumed to be configured in postgresql.conf:
- archive\_mode = on 
- archive\_command = 'test ! -f /archive/%f && cp %p /archive/%f' 
- wal\_level = logical 
2. **MongoDB Backup Strategy** 

// MongoDB backup plan 

// 1. Daily scheduled backups using mongodump

// mongodump --host mongodb0.example.com --port 27017 --db corp\_astro --out /backup/mongodb/daily/$(date +%Y-%m-%d) 

// 2. Continuous oplog backup for point-in-time recovery 

// mongodump --host mongodb0.example.com --port 27017 --db local --collection oplog.rs -- out /backup/mongodb/oplog/$(date +%Y-%m-%d) 

// 3. Collection-specific backups for critical data

// Scheduled script to perform regular exports of critical collections

const backupCriticalCollections = async () => {     const collections = [ 

`        `'divisional\_charts', 

`        `'kp\_analysis', 

`        `'dasha\_period\_analysis', 

`        `'muhurta\_analysis' 

`    `]; 

const date = new Date().toISOString().split('T')[0]; 

const backupPath = `/backup/mongodb/collections/${date}`;

// Create backup directory 

await fs.mkdir(backupPath, { recursive: true }); 

`    `// Backup each collection 

`    `for (const collection of collections) { 

`        `const outputFile = `${backupPath}/${collection}.json`;

// Execute mongodump 

`        `const command = `mongodump --host ${config.mongodb.host} --port ${config.mongodb.port} --db corp\_astro --collection ${collection} --out ${outputFile}`; 

`        `try { 

`            `await execPromise(command);

`            `console.log(`Backed up collection ${collection} to ${outputFile}`);         } catch (error) { 

`            `console.error(`Error backing up collection ${collection}:`, error);

`        `} 

`    `} 

// Clean up old backups (retain for 30 days)

`    `const cleanupCommand = `find /backup/mongodb/collections -type d -mtime +30 -exec rm - rf {} \\;`; 

`    `await execPromise(cleanupCommand); }; 

// Schedule daily collection backups

cron.schedule('0 1 \* \* \*', backupCriticalCollections);

3. **Redis Persistence Configuration**
- Redis persistence configuration for optimal durability and performance
- Snapshotting configuration 

save 900 1    # Save if at least 1 key changed in 15 minutes

save 300 10   # Save if at least 10 keys changed in 5 minutes save 60 10000 # Save if at least 10000 keys changed in 1 minute

- Append Only File configuration 

appendonly yes 

appendfilename "appendonly.aof"

appendfsync everysec  # Compromise between performance and durability

- AOF rewrite settings auto-aof-rewrite-percentage 100 auto-aof-rewrite-min-size 64mb 
- RDB compression rdbcompression yes rdbchecksum yes 
- Directory configuration dir /var/lib/redis dbfilename dump.rdb 
- Backup script to periodically copy Redis dump files to secure location #!/bin/bash 

  REDIS\_DATA\_DIR="/var/lib/redis" 

  BACKUP\_DIR="/backup/redis" 

  DATE=$(date +%Y-%m-%d) 

- Create backup directories 

mkdir -p ${BACKUP\_DIR}/rdb mkdir -p ${BACKUP\_DIR}/aof 

- Copy dump.rdb with minimal downtime using BGSAVE 

redis-cli BGSAVE 

sleep 5  # Allow time for BGSAVE to complete 

cp ${REDIS\_DATA\_DIR}/dump.rdb ${BACKUP\_DIR}/rdb/dump\_${DATE}.rdb 

- Copy the AOF file 

cp ${REDIS\_DATA\_DIR}/appendonly.aof ${BACKUP\_DIR}/aof/appendonly\_${DATE}.aof 

- Compress the backup files 

gzip ${BACKUP\_DIR}/rdb/dump\_${DATE}.rdb 

gzip ${BACKUP\_DIR}/aof/appendonly\_${DATE}.aof 

- Remove backups older than 14 days

find ${BACKUP\_DIR}/rdb -name "dump\_\*.rdb.gz" -mtime +14 -delete 

find ${BACKUP\_DIR}/aof -name "appendonly\_\*.aof.gz" -mtime +14 -delete 

16. **Monitoring and Observability Framework** 
1. **PostgreSQL Monitoring Configuration** 

-- Create custom monitoring schema

CREATE SCHEMA monitoring; 

-- Function to capture database statistics

CREATE OR REPLACE FUNCTION monitoring.capture\_database\_stats() RETURNS VOID AS $ 

BEGIN 

`    `-- Record table statistics 

`    `INSERT INTO monitoring.table\_stats 

`    `SELECT 

`        `current\_timestamp AS capture\_time,         schemaname, 

`        `relname, 

`        `seq\_scan, 

`        `seq\_tup\_read, 

`        `idx\_scan, 

`        `idx\_tup\_fetch, 

`        `n\_tup\_ins, 

`        `n\_tup\_upd, 

`        `n\_tup\_del, 

`        `n\_live\_tup, 

`        `n\_dead\_tup 

`    `FROM 

`        `pg\_stat\_user\_tables; 

`    `-- Record index statistics 

`    `INSERT INTO monitoring.index\_stats     SELECT 

`        `current\_timestamp AS capture\_time,         schemaname, 

`        `relname, 

`        `indexrelname, 

`        `idx\_scan, 

`        `idx\_tup\_read, 

`        `idx\_tup\_fetch 

`    `FROM 

`        `pg\_stat\_user\_indexes; 

-- Vacuum and analyze statistics INSERT INTO monitoring.vacuum\_stats 

`    `SELECT 

`        `current\_timestamp AS capture\_time,         schemaname, 

`        `relname, 

`        `last\_vacuum, 

`        `last\_autovacuum, 

`        `last\_analyze, 

`        `last\_autoanalyze, 

`        `vacuum\_count, 

`        `autovacuum\_count, 

`        `analyze\_count, 

`        `autoanalyze\_count 

`    `FROM 

`        `pg\_stat\_user\_tables; 

`    `-- Connection statistics 

`    `INSERT INTO monitoring.connection\_stats 

`    `SELECT 

`        `current\_timestamp AS capture\_time,

`        `count(\*) AS total\_connections, 

`        `sum(CASE WHEN state = 'active' THEN 1 ELSE 0 END) AS active\_connections,         sum(CASE WHEN state = 'idle' THEN 1 ELSE 0 END) AS idle\_connections, 

`        `sum(CASE WHEN state = 'idle in transaction' THEN 1 ELSE 0 END) AS idle\_in\_transaction\_connections,

`        `max(EXTRACT(EPOCH FROM (current\_timestamp - backend\_start))) AS longest\_session\_age, 

`        `max(EXTRACT(EPOCH FROM (current\_timestamp - xact\_start))) FILTER (WHERE xact\_start IS NOT NULL) AS longest\_transaction\_age, 

`        `max(EXTRACT(EPOCH FROM (current\_timestamp - query\_start))) FILTER (WHERE state = 'active') AS longest\_active\_query\_age 

FROM 

`        `pg\_stat\_activity 

`    `WHERE 

`        `datname = current\_database();

`    `-- Cache hit ratio 

`    `INSERT INTO monitoring.cache\_stats 

`    `SELECT 

`        `current\_timestamp AS capture\_time,

`        `sum(heap\_blks\_read) AS heap\_read,

`        `sum(heap\_blks\_hit) AS heap\_hit, 

`        `CASE WHEN sum(heap\_blks\_read) + sum(heap\_blks\_hit) > 0 

`            `THEN 100 \* sum(heap\_blks\_hit)::float / (sum(heap\_blks\_read) + sum(heap\_blks\_hit))             ELSE 0 

`        `END AS heap\_hit\_ratio, 

`        `sum(idx\_blks\_read) AS idx\_read, 

`        `sum(idx\_blks\_hit) AS idx\_hit, 

`        `CASE WHEN sum(idx\_blks\_read) + sum(idx\_blks\_hit) > 0 

`            `THEN 100 \* sum(idx\_blks\_hit)::float / (sum(idx\_blks\_read) + sum(idx\_blks\_hit)) 

`            `ELSE 0 

`        `END AS idx\_hit\_ratio, 

`        `sum(toast\_blks\_read) AS toast\_read,

`        `sum(toast\_blks\_hit) AS toast\_hit, 

`        `CASE WHEN sum(toast\_blks\_read) + sum(toast\_blks\_hit) > 0 

`            `THEN 100 \* sum(toast\_blks\_hit)::float / (sum(toast\_blks\_read) + sum(toast\_blks\_hit))             ELSE 0 

`        `END 

Continuing with the PostgreSQL Monitoring Configuration section:

-- Cache hit ratio (continued) 

`        `CASE WHEN sum(toast\_blks\_read) + sum(toast\_blks\_hit) > 0 

`            `THEN 100 \* sum(toast\_blks\_hit)::float / (sum(toast\_blks\_read) + sum(toast\_blks\_hit))

`            `ELSE 0 

`        `END AS toast\_hit\_ratio     FROM 

`        `pg\_statio\_user\_tables; END; 

$ LANGUAGE plpgsql; 

-- Create monitoring tables 

CREATE TABLE monitoring.table\_stats ( 

`    `capture\_time TIMESTAMP WITH TIME ZONE NOT NULL,     schemaname TEXT NOT NULL, 

`    `relname TEXT NOT NULL, 

`    `seq\_scan BIGINT, 

`    `seq\_tup\_read BIGINT, 

`    `idx\_scan BIGINT, 

`    `idx\_tup\_fetch BIGINT, 

`    `n\_tup\_ins BIGINT, 

`    `n\_tup\_upd BIGINT, 

`    `n\_tup\_del BIGINT, 

`    `n\_live\_tup BIGINT, 

`    `n\_dead\_tup BIGINT, 

`    `PRIMARY KEY (capture\_time, schemaname, relname) 

); 

CREATE TABLE monitoring.index\_stats ( 

`    `capture\_time TIMESTAMP WITH TIME ZONE NOT NULL,     schemaname TEXT NOT NULL, 

`    `relname TEXT NOT NULL, 

`    `indexrelname TEXT NOT NULL, 

`    `idx\_scan BIGINT, 

`    `idx\_tup\_read BIGINT, 

`    `idx\_tup\_fetch BIGINT, 

`    `PRIMARY KEY (capture\_time, schemaname, relname, indexrelname) ); 

CREATE TABLE monitoring.vacuum\_stats ( 

`    `capture\_time TIMESTAMP WITH TIME ZONE NOT NULL,     schemaname TEXT NOT NULL, 

`    `relname TEXT NOT NULL, 

`    `last\_vacuum TIMESTAMP WITH TIME ZONE, 

`    `last\_autovacuum TIMESTAMP WITH TIME ZONE, 

`    `last\_analyze TIMESTAMP WITH TIME ZONE, 

`    `last\_autoanalyze TIMESTAMP WITH TIME ZONE, 

`    `vacuum\_count BIGINT, 

`    `autovacuum\_count BIGINT, 

`    `analyze\_count BIGINT, 

`    `autoanalyze\_count BIGINT, 

`    `PRIMARY KEY (capture\_time, schemaname, relname) 

); 

CREATE TABLE monitoring.connection\_stats ( 

`    `capture\_time TIMESTAMP WITH TIME ZONE NOT NULL PRIMARY KEY,     total\_connections INTEGER NOT NULL, 

`    `active\_connections INTEGER NOT NULL, 

`    `idle\_connections INTEGER NOT NULL, 

`    `idle\_in\_transaction\_connections INTEGER NOT NULL, 

`    `longest\_session\_age DOUBLE PRECISION, 

`    `longest\_transaction\_age DOUBLE PRECISION, 

`    `longest\_active\_query\_age DOUBLE PRECISION 

); 

CREATE TABLE monitoring.cache\_stats ( 

`    `capture\_time TIMESTAMP WITH TIME ZONE NOT NULL PRIMARY KEY,     heap\_read BIGINT, 

`    `heap\_hit BIGINT, 

`    `heap\_hit\_ratio DOUBLE PRECISION, 

`    `idx\_read BIGINT, 

`    `idx\_hit BIGINT, 

`    `idx\_hit\_ratio DOUBLE PRECISION, 

`    `toast\_read BIGINT, 

`    `toast\_hit BIGINT, 

`    `toast\_hit\_ratio DOUBLE PRECISION 

); 

-- Create TimescaleDB hypertables 

SELECT create\_hypertable('monitoring.table\_stats', 'capture\_time', chunk\_time\_interval => INTERVAL '1 day'); 

SELECT create\_hypertable('monitoring.index\_stats', 'capture\_time', chunk\_time\_interval => INTERVAL '1 day'); 

SELECT create\_hypertable('monitoring.vacuum\_stats', 'capture\_time', chunk\_time\_interval => INTERVAL '1 day'); 

SELECT create\_hypertable('monitoring.connection\_stats', 'capture\_time', chunk\_time\_interval => INTERVAL '1 day'); 

SELECT create\_hypertable('monitoring.cache\_stats', 'capture\_time', chunk\_time\_interval => INTERVAL '1 day'); 

-- Create scheduled job to capture metrics

CREATE EXTENSION IF NOT EXISTS pg\_cron; 

SELECT cron.schedule('0 \* \* \* \*', 'SELECT monitoring.capture\_database\_stats()');

-- Views for frequently used queries 

CREATE OR REPLACE VIEW monitoring.slow\_queries AS 

SELECT 

`    `pid, 

`    `usename, 

`    `datname, 

`    `query, 

`    `EXTRACT(EPOCH FROM (now() - query\_start)) AS duration\_seconds,     state, 

`    `wait\_event\_type, 

`    `wait\_event 

FROM 

`    `pg\_stat\_activity 

WHERE 

`    `state = 'active' 

`    `AND query NOT ILIKE '%pg\_stat\_activity%' 

`    `AND EXTRACT(EPOCH FROM (now() - query\_start)) > 5 

ORDER BY 

`    `duration\_seconds DESC; 

CREATE OR REPLACE VIEW monitoring.index\_usage AS SELECT 

`    `schemaname, 

`    `relname AS table\_name, 

`    `indexrelname AS index\_name, 

`    `idx\_scan, 

`    `pg\_size\_pretty(pg\_relation\_size(i.indexrelid)) AS index\_size,     idx\_scan / NULLIF(n\_live\_tup, 0) AS scans\_per\_row, 

`    `n\_live\_tup, 

`    `CASE WHEN idx\_scan = 0 THEN 'Unused' 

`         `WHEN idx\_scan < 100 THEN 'Low Usage' 

`         `WHEN idx\_scan < 1000 THEN 'Medium Usage'          ELSE 'High Usage' 

`    `END AS usage\_category 

FROM 

`    `pg\_stat\_user\_indexes ui 

JOIN 

`    `pg\_index i ON ui.indexrelid = i.indexrelid 

JOIN 

`    `pg\_stat\_user\_tables ut ON ui.relid = ut.relid WHERE 

`    `NOT i.indisunique 

`    `AND idx\_scan IS NOT NULL 

ORDER BY 

`    `scans\_per\_row NULLS FIRST, 

`    `pg\_relation\_size(i.indexrelid) DESC; 

2. **MongoDB Monitoring Configuration** 

// MongoDB monitoring configuration 

// 1. Configure MongoDB profiler 

db.setProfilingLevel(1, { slowms: 100 });  // Log operations slower than 100ms

// 2. Create monitoring collections db.createCollection("system\_metrics"); db.createCollection("operation\_metrics"); db.createCollection("collection\_metrics");

// 3. Create TTL index for automatic cleanup 

db.system\_metrics.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 2592000 });  // 30 days db.operation\_metrics.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 2592000 }); db.collection\_metrics.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 2592000 });

// 4. Monitoring script (to be run as a scheduled task) const collectMongoMetrics = async () => { 

`    `const timestamp = new Date(); 

`    `// System metrics 

`    `const serverStatus = db.serverStatus();

`    `await db.system\_metrics.insertOne({

`        `timestamp, 

`        `connections: serverStatus.connections,

`        `memory: serverStatus.mem,

`        `network: serverStatus.network,

`        `opcounters: serverStatus.opcounters,

`        `globalLock: serverStatus.globalLock, 

`        `wiredTiger: { 

`            `cache: serverStatus.wiredTiger.cache,

`            `concurrentTransactions: serverStatus.wiredTiger.concurrentTransactions,             ticketScheduling: serverStatus.wiredTiger.ticketScheduling

`        `} 

`    `}); 

// Collection metrics 

const collections = await db.listCollections().toArray(); const collectionMetrics = []; 

`    `for (const collection of collections) { 

`        `const collName = collection.name;

`        `const stats = await db.runCommand({ collStats: collName });

collectionMetrics.push({ 

`            `timestamp, 

`            `collection: collName, 

`            `count: stats.count, 

`            `size: stats.size, 

`            `storageSize: stats.storageSize,

`            `indexSize: stats.totalIndexSize,             avgObjSize: stats.avgObjSize,             indexDetails: stats.indexSizes         }); 

`    `} 

`    `if (collectionMetrics.length > 0) { 

`        `await db.collection\_metrics.insertMany(collectionMetrics);     } 

`    `// Get slow query information from profiler 

`    `const slowQueries = await db.system.profile.find({

`        `ts: { $gte: new Date(Date.now() - 3600000) }  // Last hour     }).toArray(); 

`    `const operationMetrics = { 

`        `timestamp, 

`        `slowOperationsCount: slowQueries.length,

`        `operationTypes: {}, 

`        `slowestQueries: slowQueries.slice(0, 10).map(q => ({             op: q.op, 

`            `ns: q.ns, 

`            `millis: q.millis, 

`            `query: q.query || q.command,

`            `planSummary: q.planSummary 

`        `}))     }; 

`    `// Aggregate operation types 

`    `slowQueries.forEach(q => { 

`        `if (!operationMetrics.operationTypes[q.op]) {             operationMetrics.operationTypes[q.op] = 0;         } 

`        `operationMetrics.operationTypes[q.op]++;

`    `}); 

await db.operation\_metrics.insertOne(operationMetrics);

`    `console.log(`Collected MongoDB metrics at ${timestamp}`); }; 

// 5. Example scheduled execution using Node.js with cron

// const cron = require('node-cron'); 

// cron.schedule('\*/10 \* \* \* \*', collectMongoMetrics);  // Run every 10 minutes

// 6. Useful monitoring queries 

// Latest system metrics 

db.system\_metrics.find().sort({ timestamp: -1 }).limit(1); 

// Collection growth over time 

db.collection\_metrics.aggregate([

`    `{ $match: { collection: "divisional\_charts" } }, 

`    `{ $project: {  

`        `date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },         size: 1, 

`        `count: 1 

`    `}}, 

`    `{ $group: { 

`        `\_id: "$date", 

`        `avgSize: { $avg: "$size" }, 

`        `avgCount: { $avg: "$count" }     }}, 

`    `{ $sort: { \_id: 1 } } 

]); 

// Slow operations by type db.operation\_metrics.aggregate([

`    `{ $unwind: "$slowestQueries" }, 

`    `{ $group: { 

`        `\_id: "$slowestQueries.op", 

`        `count: { $sum: 1 }, 

`        `avgMillis: { $avg: "$slowestQueries.millis" },         maxMillis: { $max: "$slowestQueries.millis" }     }}, 

`    `{ $sort: { count: -1 } } 

]); 

3. **Redis Monitoring Configuration** #!/bin/bash 
- redis\_metrics.sh 

REDIS\_HOST="localhost" REDIS\_PORT=6379 METRICS\_DIR="/var/log/redis/metrics" DATE=$(date +%Y-%m-%d) TIME=$(date +%H:%M:%S) 

FILENAME="${METRICS\_DIR}/${DATE}.log" 

- Ensure metrics directory exists mkdir -p ${METRICS\_DIR} 
- Get Redis INFO metrics 

  REDIS\_INFO=$(redis-cli -h ${REDIS\_HOST} -p ${REDIS\_PORT} INFO) 

- Format timestamp 

echo "======== REDIS METRICS ${DATE} ${TIME} ========" >> ${FILENAME} echo "${REDIS\_INFO}" >> ${FILENAME} 

echo "" >> ${FILENAME} 

- Extract key metrics and save as CSV 

CONNECTED\_CLIENTS=$(echo "$REDIS\_INFO" | grep connected\_clients | cut -d':' -f2) USED\_MEMORY=$(echo "$REDIS\_INFO" | grep used\_memory: | cut -d':' -f2) USED\_MEMORY\_PEAK=$(echo "$REDIS\_INFO" | grep used\_memory\_peak | cut -d':' -f2) USED\_MEMORY\_RSS=$(echo "$REDIS\_INFO" | grep used\_memory\_rss | cut -d':' -f2) 

MEM\_FRAGMENTATION\_RATIO=$(echo "$REDIS\_INFO" | grep mem\_fragmentation\_ratio | cut - d':' -f2) 

TOTAL\_CONNECTIONS\_RECEIVED=$(echo "$REDIS\_INFO" | grep total\_connections\_received | cut -d':' -f2) 

TOTAL\_COMMANDS\_PROCESSED=$(echo "$REDIS\_INFO" | grep total\_commands\_processed | cut -d':' -f2) 

INSTANTANEOUS\_OPS\_PER\_SEC=$(echo "$REDIS\_INFO" | grep instantaneous\_ops\_per\_sec | cut -d':' -f2) 

HIT\_RATE=$(echo "$REDIS\_INFO" | grep keyspace\_hits | cut -d':' -f2) MISS\_RATE=$(echo "$REDIS\_INFO" | grep keyspace\_misses | cut -d':' -f2) TOTAL\_REQUESTS=$((HIT\_RATE + MISS\_RATE)) 

HIT\_RATIO=0 

if [ "$TOTAL\_REQUESTS" -gt 0 ]; then 

`    `HIT\_RATIO=$(echo "scale=4; ${HIT\_RATE} / ${TOTAL\_REQUESTS}" | bc) fi 

- Save CSV format 

echo "${DATE},${TIME},${CONNECTED\_CLIENTS},${USED\_MEMORY},${USED\_MEMORY\_PEAK},${USE D\_MEMORY\_RSS},${MEM\_FRAGMENTATION\_RATIO},${TOTAL\_CONNECTIONS\_RECEIVED},${TO TAL\_COMMANDS\_PROCESSED},${INSTANTANEOUS\_OPS\_PER\_SEC},${HIT\_RATE},${MISS\_RATE },${HIT\_RATIO}" >> ${METRICS\_DIR}/daily\_metrics.csv 

- Monitor slow log 

SLOWLOG=$(redis-cli -h ${REDIS\_HOST} -p ${REDIS\_PORT} SLOWLOG GET 10) 

if [ ! -z "$SLOWLOG" ]; then 

`    `echo "======== SLOW LOG ${DATE} ${TIME} ========" >> ${METRICS\_DIR}/slowlog.log     echo "${SLOWLOG}" >> ${METRICS\_DIR}/slowlog.log 

`    `echo "" >> ${METRICS\_DIR}/slowlog.log 

fi 

- Monitor Redis Keyspace 

KEYSPACE=$(redis-cli -h ${REDIS\_HOST} -p ${REDIS\_PORT} INFO keyspace) 

echo "${DATE},${TIME},$(echo "$KEYSPACE" | grep -v "#" | tr -d '\r')" >> ${METRICS\_DIR}/keyspace.csv 

- Database-specific metrics for astrological cache

for DB in {0..13}; do 

`    `DBSIZE=$(redis-cli -h ${REDIS\_HOST} -p ${REDIS\_PORT} -n $DB DBSIZE) 

`    `echo "${DATE},${TIME},${DB},${DBSIZE}" >> ${METRICS\_DIR}/db\_sizes.csv done 

- Redis memory usage analysis section MEMORY\_SAMPLES=5 

  SORTED\_KEYS=20 

- Get largest keys by database 

for DB in {0..13}; do 

`    `echo "Analyzing Database ${DB}..." >> ${METRICS\_DIR}/memory\_analysis\_${DATE}.log 

`    `redis-cli -h ${REDIS\_HOST} -p ${REDIS\_PORT} -n $DB --bigkeys >> ${METRICS\_DIR}/memory\_analysis\_${DATE}.log 

- Sample memory usage of specific key patterns

`    `if [ $DB -eq 1 ]; then 

- Astrological Data Cache 

`        `echo "Memory usage for planetary positions cache:" >> ${METRICS\_DIR}/memory\_analysis\_${DATE}.log 

`        `redis-cli -h ${REDIS\_HOST} -p ${REDIS\_PORT} -n $DB MEMORY USAGE "planet:positions:$(date +%Y -%m-%d)" >> ${METRICS\_DIR}/memory\_analysis\_${DATE}.log 

`    `elif [ $DB -eq 9 ]; then 

- Divisional Chart Cache 

`        `echo "Memory usage for divisional chart cache samples:" >> ${METRICS\_DIR}/memory\_analysis\_${DATE}.log 

`        `KEYS=$(redis-cli -h ${REDIS\_HOST} -p ${REDIS\_PORT} -n $DB KEYS "divisional:\*" | head -n ${MEMORY\_SAMPLES}) 

for KEY in $KEYS; do 

`            `redis-cli -h ${REDIS\_HOST} -p ${REDIS\_PORT} -n $DB MEMORY USAGE "$KEY" >> ${METRICS\_DIR}/memory\_analysis\_${DATE}.log 

`        `done     fi done 

- Save sorted set of keys by memory usage

redis-cli -h ${REDIS\_HOST} -p ${REDIS\_PORT} --memkeys | head  -n "$((SORTED\_KEYS + 2))" >> ${METRICS\_DIR}/top\_memory\_keys\_${DATE}.log 

17. **Deployment and Maintenance Procedures**
1. **Database Setup and Migration Scripts** 

#!/bin/bash 

- astrodb\_setup.sh - Master setup script for Corp Astro database environment
- Configuration PG\_VERSION="14" MONGO\_VERSION="6.0" REDIS\_VERSION="7.0" TIMESCALEDB\_VERSION="2.9.1" 
- PostgreSQL Setup 

setup\_postgres() { 

`    `echo "Setting up PostgreSQL $PG\_VERSION..." 

- Install PostgreSQL and extensions apt-get update 

`    `apt-get install -y postgresql-$PG\_VERSION postgresql-contrib-$PG\_VERSION postgresql- $PG\_VERSION-postgis 

- Install TimescaleDB 

add-apt-repository -y ppa:timescale/timescaledb-ppa 

apt-get update 

apt-get install  -y timescaledb -postgresql -$PG\_VERSION=$TIMESCALEDB\_VERSION 

- Configure TimescaleDB timescaledb-tune --quiet --yes 
- Create database and enable extensions

  sudo  -u postgres psql  -c "CREATE DATABASE corp\_astro;" 

  sudo  -u postgres psql  -d corp\_astro  -c "CREATE EXTENSION IF NOT EXISTS postgis;" 

  sudo  -u postgres psql  -d corp\_astro  -c "CREATE EXTENSION IF NOT EXISTS timescaledb;" sudo  -u postgres psql  -d corp\_astro  -c "CREATE EXTENSION IF NOT EXISTS uuid-ossp;" 

  sudo  -u postgres psql  -d corp\_astro  -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;" 

- Apply initial schema 

sudo -u postgres psql -d corp\_astro -f /setup/sql/01\_schema\_init.sql

sudo -u postgres psql -d corp\_astro -f /setup/sql/02\_core\_schema.sql

sudo -u postgres psql -d corp\_astro -f /setup/sql/03\_astrology\_schema.sql sudo -u postgres psql -d corp\_astro -f /setup/sql/04\_numerology\_schema.sql sudo -u postgres psql -d corp\_astro -f /setup/sql/05\_dasha\_schema.sql

sudo -u postgres psql -d corp\_astro -f /setup/sql/06\_business\_schema.sql sudo -u postgres psql -d corp\_astro -f /setup/sql/07\_admin\_schema.sql

sudo -u postgres psql -d corp\_astro -f /setup/sql/08\_reference\_data.sql

sudo -u postgres psql -d corp\_astro -f /setup/sql/09\_functions.sql

sudo -u postgres psql -d corp\_astro -f /setup/sql/10\_triggers.sql 

sudo -u postgres psql -d corp\_astro -f /setup/sql/11\_indexes.sql

- Configure PostgreSQL 

sudo -u postgres cp /setup/config/postgresql.conf /etc/postgresql/$PG\_VERSION/main/ sudo -u postgres cp /setup/config/pg\_hba.conf /etc/postgresql/$PG\_VERSION/main/

- Restart PostgreSQL systemctl restart postgresql

`    `echo "PostgreSQL setup completed successfully." } 

- MongoDB Setup 

setup\_mongodb() { 

`    `echo "Setting up MongoDB $MONGO\_VERSION..." 

- Install MongoDB 

`    `wget -qO - https://www.mongodb.org/static/pgp/server-$MONGO\_VERSION.asc | apt-key add - 

`    `echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb - org/$MONGO\_VERSION multiverse" | tee /etc/apt/sources.list.d/mongodb-org- $MONGO\_VERSION.list 

apt-get update 

apt-get install -y mongodb-org 

- Configure MongoDB 

cp /setup/config/mongod.conf /etc/mongod.conf

- Create database and collections

systemctl start mongod 

sleep 5  # Allow time for MongoDB to start 

- Initialize collections and indexes 

mongosh --file /setup/mongo/01\_create\_collections.js mongosh --file /setup/mongo/02\_create\_indexes.js mongosh --file /setup/mongo/03\_validators.js

`    `echo "MongoDB setup completed successfully." } 

- Redis Setup 

setup\_redis() { 

`    `echo "Setting up Redis $REDIS\_VERSION..." 

- Install Redis 

add-apt-repository -y ppa:redis/redis-server 

apt-get update 

apt-get install -y redis-server 

- Configure Redis 

cp /setup/config/redis.conf /etc/redis/redis.conf

- Set up multi-database configuration 

`    `for DB in {0..13}; do 

`        `redis-cli CONFIG SET databases 14     done 

- Restart Redis 

systemctl restart redis-server 

`    `echo "Redis setup completed successfully." } 

- Run setup procedures setup\_postgres setup\_mongodb setup\_redis 

  echo "Database environment setup completed."

2. **Schema Migration Procedures** 

-- Create migration management system

-- Extension for tracking migrations 

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 

-- Migration tracking table 

CREATE TABLE IF NOT EXISTS admin.schema\_migrations ( 

`    `migration\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `version VARCHAR(50) NOT NULL UNIQUE, 

`    `applied\_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT\_TIMESTAMP,     description TEXT NOT NULL, 

`    `script\_path TEXT NOT NULL, 

`    `checksum VARCHAR(64) NOT NULL, -- SHA-256 hash of script content 

`    `applied\_by VARCHAR(100) NOT NULL, 

`    `execution\_time\_ms INTEGER, 

`    `is\_success BOOLEAN NOT NULL DEFAULT TRUE, 

`    `error\_message TEXT, 

`    `rollback\_script\_path TEXT 

); 

-- Function to apply a migration 

CREATE OR REPLACE FUNCTION admin.apply\_migration(     p\_version VARCHAR(50), 

`    `p\_description TEXT, 

`    `p\_script\_path TEXT, 

`    `p\_applied\_by VARCHAR(100), 

`    `p\_rollback\_script\_path TEXT DEFAULT NULL 

) 

RETURNS UUID AS $ 

DECLARE 

`    `v\_start\_time TIMESTAMP; 

`    `v\_end\_time TIMESTAMP; 

`    `v\_execution\_time\_ms INTEGER; 

`    `v\_checksum VARCHAR(64); 

`    `v\_migration\_id UUID; 

`    `v\_script\_content TEXT; 

`    `v\_error TEXT; 

BEGIN 

`    `-- Check if migration already applied 

`    `IF EXISTS (SELECT 1 FROM admin.schema\_migrations WHERE version = p\_version) THEN         RAISE EXCEPTION 'Migration version % already applied', p\_version; 

`    `END IF; 

-- Read script content 

v\_script\_content := pg\_read\_file(p\_script\_path);

-- Calculate checksum 

v\_checksum := encode(sha256(v\_script\_content::bytea), 'hex');

`    `-- Begin transaction 

`    `v\_start\_time := clock\_timestamp();     BEGIN 

`        `-- Execute migration script 

`        `EXECUTE v\_script\_content; 

-- Record successful migration 

v\_end\_time := clock\_timestamp(); 

v\_execution\_time\_ms := extract(milliseconds from v\_end\_time - v\_start\_time)::integer; 

`        `INSERT INTO admin.schema\_migrations (             version, 

`            `description, 

`            `script\_path, 

`            `checksum, 

`            `applied\_by, 

`            `execution\_time\_ms, 

`            `rollback\_script\_path 

`        `) VALUES ( 

`            `p\_version, 

`            `p\_description, 

`            `p\_script\_path, 

`            `v\_checksum, 

`            `p\_applied\_by, 

`            `v\_execution\_time\_ms, 

`            `p\_rollback\_script\_path 

`        `) RETURNING migration\_id INTO v\_migration\_id; 

RETURN v\_migration\_id; 

`    `EXCEPTION 

`        `WHEN OTHERS THEN 

`            `-- Record failed migration 

`            `v\_error := SQLERRM; 

`            `v\_end\_time := clock\_timestamp(); 

`            `v\_execution\_time\_ms := extract(milliseconds from v\_end\_time - v\_start\_time)::integer; 

`            `INSERT INTO admin.schema\_migrations (                 version, 

`                `description, 

`                `script\_path, 

`                `checksum, 

`                `applied\_by, 

`                `execution\_time\_ms, 

`                `is\_success, 

`                `error\_message, 

`                `rollback\_script\_path 

`            `) VALUES ( 

`                `p\_version, 

`                `p\_description, 

`                `p\_script\_path, 

`                `v\_checksum, 

`                `p\_applied\_by, 

`                `v\_execution\_time\_ms, 

`                `FALSE, 

`                `v\_error, 

`                `p\_rollback\_script\_path 

`            `) RETURNING migration\_id INTO v\_migration\_id; 

`            `RAISE; 

`    `END; 

END; 

$ LANGUAGE plpgsql; 

-- Function to rollback a migration 

CREATE OR REPLACE FUNCTION admin.rollback\_migration( 

`    `p\_version VARCHAR(50), 

`    `p\_applied\_by VARCHAR(100) 

) 

RETURNS BOOLEAN AS $ 

DECLARE 

`    `v\_rollback\_script\_path TEXT; 

`    `v\_rollback\_script\_content TEXT; 

`    `v\_migration\_id UUID; 

`    `v\_error TEXT; 

BEGIN 

`    `-- Get rollback script path 

`    `SELECT migration\_id, rollback\_script\_path INTO v\_migration\_id, v\_rollback\_script\_path 

FROM admin.schema\_migrations WHERE version = p\_version AND is\_success = TRUE; 

`    `IF NOT FOUND THEN 

`        `RAISE EXCEPTION 'Migration version % not found or not successfully applied', p\_version;     END IF; 

`    `IF v\_rollback\_script\_path IS NULL THEN 

`        `RAISE EXCEPTION 'No rollback script available for migration version %', p\_version;     END IF; 

-- Read rollback script content 

v\_rollback\_script\_content := pg\_read\_file(v\_rollback\_script\_path);

`    `BEGIN 

`        `-- Execute rollback script 

`        `EXECUTE v\_rollback\_script\_content; 

`        `-- Record rollback 

`        `INSERT INTO admin.schema\_migrations (             version, 

`            `description, 

`            `script\_path, 

`            `checksum, 

`            `applied\_by, 

`            `execution\_time\_ms, 

`            `is\_success, 

`            `rollback\_script\_path 

`        `) VALUES ( 

`            `p\_version || '.rollback', 

`            `'Rollback of migration ' || p\_version, 

`            `v\_rollback\_script\_path, 

`            `encode(sha256(v\_rollback\_script\_content::bytea), 'hex'),             p\_applied\_by, 

`            `0, 

`            `TRUE, 

`            `NULL 

`        `); 

`        `-- Mark original migration as rolled back 

`        `UPDATE admin.schema\_migrations 

`        `SET is\_success = FALSE, 

`            `error\_message = 'Rolled back at ' || NOW()         WHERE migration\_id = v\_migration\_id; 

RETURN TRUE; 

`    `EXCEPTION 

`        `WHEN OTHERS THEN             v\_error := SQLERRM; 

`            `-- Record failed rollback 

`            `INSERT INTO admin.schema\_migrations (                 version, 

`                `description, 

`                `script\_path, 

`                `checksum, 

`                `applied\_by, 

`                `execution\_time\_ms, 

`                `is\_success, 

`                `error\_message, 

`                `rollback\_script\_path 

`            `) VALUES ( 

`                `p\_version || '.rollback.failed', 

`                `'Failed rollback of migration ' || p\_version, 

`                `v\_rollback\_script\_path, 

`                `encode(sha256(v\_rollback\_script\_content::bytea), 'hex'),                 p\_applied\_by, 

`                `0, 

`                `FALSE, 

`                `v\_error, 

`                `NULL 

`            `); 

`            `RAISE; 

`    `END; 

END; 

$ LANGUAGE plpgsql; 

-- Sample application script for a new migration

-- SELECT admin.apply\_migration( 

--   '20230401001', 

--   'Add KP System Analysis Tables', 

--   '/migrations/20230401001\_add\_kp\_tables.sql',

--   'dba-user', 

--   '/migrations/20230401001\_rollback.sql'

-- ); 

3. **Maintenance Procedures** 

-- Routine maintenance procedures for database health

-- Analyze and vacuum all schemas 

CREATE OR REPLACE PROCEDURE admin.vacuum\_analyze\_all() LANGUAGE plpgsql 

AS $ 

DECLARE 

`    `v\_schema TEXT; 

`    `v\_table TEXT; 

`    `v\_start\_time TIMESTAMP; 

`    `v\_end\_time TIMESTAMP; 

`    `v\_log\_message TEXT; 

BEGIN 

`    `-- Log maintenance start 

`    `v\_start\_time := clock\_timestamp(); 

`    `RAISE NOTICE 'Starting VACUUM ANALYZE at %', v\_start\_time; 

`    `-- Vacuum/analyze schemas of interest

`    `FOR v\_schema, v\_table IN 

`        `SELECT table\_schema, table\_name 

`        `FROM information\_schema.tables 

`        `WHERE table\_schema IN ('core', 'astrology', 'business', 'admin')         AND table\_type = 'BASE TABLE' 

`    `LOOP 

`        `v\_log\_message := 'Processing ' || v\_schema || '.' || v\_table;

`        `RAISE NOTICE '%', v\_log\_message; 

`        `-- Log to maintenance history 

`        `INSERT INTO admin.maintenance\_log (             operation\_type, 

`            `target\_schema, 

`            `target\_object, 

`            `message, 

`            `started\_at 

`        `) VALUES ( 

`            `'VACUUM ANALYZE',             v\_schema, 

`            `v\_table, 

`            `v\_log\_message, 

`            `clock\_timestamp() 

`        `); 

-- Execute vacuum analyze 

EXECUTE 'VACUUM ANALYZE ' || quote\_ident(v\_schema) || '.' || quote\_ident(v\_table); 

`        `-- Update completion time 

`        `UPDATE admin.maintenance\_log 

`        `SET completed\_at = clock\_timestamp(), 

`            `status = 'SUCCESS' 

`        `WHERE operation\_type = 'VACUUM ANALYZE'         AND target\_schema = v\_schema 

`        `AND target\_object = v\_table 

`        `AND completed\_at IS NULL; 

`    `END LOOP; 

`    `-- Log maintenance completion 

`    `v\_end\_time := clock\_timestamp(); 

`    `RAISE NOTICE 'Completed VACUUM ANALYZE at %. Total duration: %',         v\_end\_time, 

`        `age(v\_end\_time, v\_start\_time); 

END; 

$; 

-- Reindex procedure for optimizing indexes 

CREATE OR REPLACE PROCEDURE admin.reindex\_schema(p\_schema TEXT) LANGUAGE plpgsql 

AS $ 

DECLARE 

`    `v\_start\_time TIMESTAMP; 

`    `v\_end\_time TIMESTAMP; 

`    `v\_log\_message TEXT; 

BEGIN 

`    `-- Validate schema 

`    `IF NOT EXISTS (SELECT 1 FROM information\_schema.schemata WHERE schema\_name = p\_schema) THEN 

`        `RAISE EXCEPTION 'Schema % does not exist', p\_schema;     END IF; 

-- Log maintenance start 

v\_start\_time := clock\_timestamp(); 

v\_log\_message := 'Starting REINDEX SCHEMA for ' || p\_schema; RAISE NOTICE '%', v\_log\_message; 

`    `-- Log to maintenance history 

`    `INSERT INTO admin.maintenance\_log (         operation\_type, 

`        `target\_schema, 

`        `target\_object, 

`        `message, 

`        `started\_at 

`    `) VALUES ( 

`        `'REINDEX SCHEMA', 

`        `p\_schema, 

`        `NULL, 

`        `v\_log\_message,         v\_start\_time 

`    `); 

-- Execute reindex 

EXECUTE 'REINDEX SCHEMA ' || quote\_ident(p\_schema); 

-- Log maintenance completion v\_end\_time := clock\_timestamp(); 

`    `-- Update completion time 

`    `UPDATE admin.maintenance\_log 

`    `SET completed\_at = v\_end\_time, 

`        `status = 'SUCCESS', 

`        `message = v\_log\_message || ' - Completed in ' || age(v\_end\_time, v\_start\_time)     WHERE operation\_type = 'REINDEX SCHEMA' 

`    `AND target\_schema = p\_schema 

`    `AND completed\_at IS NULL; 

`    `RAISE NOTICE 'Completed REINDEX SCHEMA for % at %. Total duration: %',         p\_schema, 

`        `v\_end\_time, 

`        `age(v\_end\_time, v\_start\_time); 

END 

Continuing from the previous section on Maintenance Procedures:

-- Reindex procedure for optimizing indexes (continued)

CREATE OR REPLACE PROCEDURE admin.reindex\_schema(p\_schema TEXT) LANGUAGE plpgsql 

AS $ 

DECLARE 

`    `v\_start\_time TIMESTAMP;     v\_end\_time TIMESTAMP;     v\_log\_message TEXT; BEGIN 

`    `-- Validate schema 

`    `IF NOT EXISTS (SELECT 1 FROM information\_schema.schemata WHERE schema\_name = p\_schema) THEN 

`        `RAISE EXCEPTION 'Schema % does not exist', p\_schema;     END IF; 

-- Log maintenance start 

v\_start\_time := clock\_timestamp(); 

v\_log\_message := 'Starting REINDEX SCHEMA for ' || p\_schema; RAISE NOTICE '%', v\_log\_message; 

`    `-- Log to maintenance history 

`    `INSERT INTO admin.maintenance\_log (         operation\_type, 

`        `target\_schema, 

`        `target\_object, 

`        `message, 

`        `started\_at 

`    `) VALUES ( 

`        `'REINDEX SCHEMA', 

`        `p\_schema, 

`        `NULL, 

`        `v\_log\_message, 

`        `v\_start\_time 

); 

-- Execute reindex 

EXECUTE 'REINDEX SCHEMA ' || quote\_ident(p\_schema); 

-- Log maintenance completion v\_end\_time := clock\_timestamp(); 

`    `-- Update completion time 

`    `UPDATE admin.maintenance\_log 

`    `SET completed\_at = v\_end\_time, 

`        `status = 'SUCCESS', 

`        `message = v\_log\_message || ' - Completed in ' || age(v\_end\_time, v\_start\_time)     WHERE operation\_type = 'REINDEX SCHEMA' 

`    `AND target\_schema = p\_schema 

`    `AND completed\_at IS NULL; 

`    `RAISE NOTICE 'Completed REINDEX SCHEMA for % at %. Total duration: %',         p\_schema, 

`        `v\_end\_time, 

`        `age(v\_end\_time, v\_start\_time); 

END; 

$; 

-- Optimize TimescaleDB chunks 

CREATE OR REPLACE PROCEDURE admin.optimize\_timescaledb\_chunks() LANGUAGE plpgsql 

AS $ 

DECLARE 

`    `v\_start\_time TIMESTAMP; 

`    `v\_end\_time TIMESTAMP; 

`    `v\_schema TEXT; 

`    `v\_table TEXT; 

`    `v\_log\_message TEXT; 

`    `v\_compressed\_chunks INTEGER; 

BEGIN 

`    `-- Log maintenance start 

`    `v\_start\_time := clock\_timestamp(); 

`    `v\_log\_message := 'Starting TimescaleDB chunk optimization';     RAISE NOTICE '%', v\_log\_message; 

`    `-- Log to maintenance history 

`    `INSERT INTO admin.maintenance\_log (         operation\_type, 

`        `target\_schema, 

`        `target\_object, 

`        `message, 

`        `started\_at 

`    `) VALUES ( 

`        `'TIMESCALEDB\_OPTIMIZE', 

`        `'all', 

`        `NULL, 

`        `v\_log\_message, 

`        `v\_start\_time 

`    `); 

`    `-- For each hypertable, compress chunks older than 7 days     FOR v\_schema, v\_table IN 

`        `SELECT table\_schema, table\_name 

`        `FROM timescaledb\_information.hypertables

`    `LOOP 

`        `-- Set compression policy if it doesn't exist

`        `EXECUTE format( 

`            `'SELECT add\_compression\_policy(%L, INTERVAL %L)',             v\_schema || '.' || v\_table, 

`            `'7 days' 

`        `); 

`        `-- Compress chunks manually for demonstration

`        `SELECT count(\*) INTO v\_compressed\_chunks 

`        `FROM compress\_chunk( 

`            `chunk\_table => c.chunk\_name, 

`            `if\_not\_compressed => true 

`        `) 

`        `FROM show\_chunks(v\_schema || '.' || v\_table, older\_than => INTERVAL '7 days') c; 

`        `RAISE NOTICE 'Compressed % chunks for %.%', v\_compressed\_chunks, v\_schema, v\_table;     END LOOP; 

-- Log maintenance completion v\_end\_time := clock\_timestamp(); 

`    `-- Update completion time 

`    `UPDATE admin.maintenance\_log 

`    `SET completed\_at = v\_end\_time, 

`        `status = 'SUCCESS', 

`        `message = v\_log\_message || ' - Completed in ' || age(v\_end\_time, v\_start\_time)     WHERE operation\_type = 'TIMESCALEDB\_OPTIMIZE' 

`    `AND target\_schema = 'all' 

`    `AND completed\_at IS NULL; 

`    `RAISE NOTICE 'Completed TimescaleDB chunk optimization at %. Total duration: %',         v\_end\_time, 

`        `age(v\_end\_time, v\_start\_time); 

END; 

$; 

-- Maintenance log table 

CREATE TABLE IF NOT EXISTS admin.maintenance\_log (     log\_id SERIAL PRIMARY KEY, 

`    `operation\_type VARCHAR(50) NOT NULL, 

`    `target\_schema VARCHAR(100), 

`    `target\_object VARCHAR(100), 

`    `message TEXT, 

`    `status VARCHAR(20) DEFAULT 'RUNNING', 

`    `started\_at TIMESTAMP WITH TIME ZONE NOT NULL,     completed\_at TIMESTAMP WITH TIME ZONE, 

`    `error\_message TEXT 

); 

-- Scheduled maintenance jobs

DO $ 

BEGIN 

`    `-- Create pg\_cron extension if not exists 

`    `CREATE EXTENSION IF NOT EXISTS pg\_cron; 

-- Schedule weekly vacuum analyze - Sunday 01:00 AM 

PERFORM cron.schedule('0 1 \* \* 0', 'CALL admin.vacuum\_analyze\_all()'); 

-- Schedule monthly reindex - 1st day of month at 02:00 AM 

PERFORM cron.schedule('0 2 1 \* \*', 'CALL admin.reindex\_schema(''core'')'); PERFORM cron.schedule('30 2 1 \* \*', 'CALL admin.reindex\_schema(''astrology'')'); PERFORM cron.schedule('0 3 1 \* \*', 'CALL admin.reindex\_schema(''business'')'); PERFORM cron.schedule('30 3 1 \* \*', 'CALL admin.reindex\_schema(''admin'')');

`    `-- Schedule daily TimescaleDB optimization - 04:00 AM 

`    `PERFORM cron.schedule('0 4 \* \* \*', 'CALL admin.optimize\_timescaledb\_chunks()'); END $; 

18. **System Requirements and Performance Metrics**
1. **Hardware Recommendations** 
1. **Development Environment** 



|` `**Specification** |
| - |

**Purpose ![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.001.png)![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.002.png)**



|4+ cores (Intel i7 or AMD Ryzen equivalent)|
| - |

` `Database operations, calculations In-memory operations, caching Database files, logs, backups Reliable connectivity 

|16 GB minimum, 32 GB recommended |
| - |
|100 GB SSD |
|1 Gbps Ethernet |

2. **Production Environment ![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.003.png)**



|` `**Specification** |
| - |

**Purpose ![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.004.png)![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.005.png)**



|16+ cores (Xeon or EPYC server-grade) |
| - |

High-volume query processing 64 GB minimum, 128 GB recommended Large dataset operations, caching

RAM 



||
| :- |
` `**Specification  Purpose ![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.006.png)![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.007.png)**



|1+ TB NVMe SSD, RAID 10 configuratio |
| - |

nFast data access, redundancy



|10 Gbps Ethernet |
| - |

High throughput data transfers 

3. **Database-Specific Requirements** 



|` `**RAM Requirements**|
| - |

**Database  CPU Requirements ![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.008.png)![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.009.png)![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.010.png)**PostgreSQL 8+ dedicated cores  MongoDB  4+ dedicated cores  Redis  2+ dedicated cores  

|32+ GB RAM |
| - |
|16+ GB RAM |
|16+ GB RAM |

2. **Expected Performance Metrics** 
1. **Query Response Times** 

**Target P95  Target P99  Maximum Acceptable ![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.011.png)![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.012.png)Operation Type** 

**Latency  Latency  Latency** 

Basic user profile retrieval  50 ms  100 ms Natal chart generation  200 ms  500 ms 

200 ms 1000 ms 1500 ms 2000 ms 500 ms 2000 ms 600 ms 

|300 ms |700 ms |
| - | - |
|350 ms |800 ms |
|100 ms |250 ms |
|400 ms |900 ms |
|150 ms |300 ms |
|500 ms |1200 ms |

3000 ms 3500 ms 

Muhurta recommendation  600 ms  1500 ms 

2. **System Throughput** 




|**Concurrent Users** |
| - |

**Requests per Second  Daily Active Users ![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.013.png)![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.014.png)![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.015.png)**50-100  N/A 

|50 |
| - |
|200 |

200-500  5,000 1,000-2,500  50,000+ 

|1,000+ |
| - |

3. **Caching Efficiency Targets** 

**Cache Type  Target Hit Ratio Refresh Frequency Memory Allocation ![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.016.png)**Authentication tokens 99.5%  On-demand  1 GB 

Planetary positions  98.0%  Daily  5 GB 

Natal charts  95.0%  On-demand  10 GB 

Divisional charts  90.0%  On-demand  15 GB 



|95\.0% |
| - |

Daily  5 GB 



|98\.0% |
| - |

Weekly  5 GB 

. 

**Technical Appendices: Corp Astro Database Architecture Appendix A: SQL Schema Definition Scripts** 

**A.1. Core Schema Initialization Scripts** 

-- Enable necessary extensions

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; CREATE EXTENSION IF NOT EXISTS "postgis"; CREATE EXTENSION IF NOT EXISTS "timescaledb"; 

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; 

-- Create schemas for logical separation

CREATE SCHEMA core;       -- Core user and subscription data

CREATE SCHEMA astrology;  -- Astrological data and charts 

CREATE SCHEMA business;   -- Business profiles and analysis 

CREATE SCHEMA analytics;  -- Reporting and analytics 

CREATE SCHEMA admin;      -- Super Administration Panel 

CREATE SCHEMA monitoring; -- Performance monitoring framework 

**A.2. User Management Schema Scripts** 

-- Users table - primary user information 

CREATE TABLE core.users ( 

`    `user\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `phone\_number VARCHAR(15) UNIQUE NOT NULL,  -- Primary authentication identifier 

`    `email VARCHAR(255) UNIQUE, 

`    `full\_name VARCHAR(100) NOT NULL, 

`    `gender VARCHAR(20), 

`    `date\_of\_birth DATE NOT NULL, 

`    `time\_of\_birth TIME NOT NULL, 

`    `place\_of\_birth VARCHAR(255) NOT NULL, 

`    `birth\_coordinates GEOMETRY(Point, 4326) NOT NULL,  -- Using PostGIS for geospatial data     birth\_timezone VARCHAR(50) NOT NULL, 

`    `timezone\_offset NUMERIC(4, 2) NOT NULL,  -- Added timezone offset for precise calculations     profile\_photo\_url VARCHAR(255), 

`    `preferred\_language VARCHAR(10) DEFAULT 'en', 

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `last\_login\_at TIMESTAMP WITH TIME ZONE, 

`    `account\_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', 

`    `notification\_preferences JSONB DEFAULT '{"push": true, "email": true, "sms": true}'::jsonb, 

`    `CONSTRAINT valid\_account\_status CHECK (account\_status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED')), 

`    `CONSTRAINT valid\_timezone\_offset CHECK (timezone\_offset BETWEEN -12.0 AND 14.0) ); 

-- Authentication records 

CREATE TABLE core.authentication\_logs ( 

`    `log\_id BIGSERIAL PRIMARY KEY, 

`    `user\_id UUID REFERENCES core.users(user\_id), 

`    `authentication\_type VARCHAR(20) NOT NULL,  -- OTP, TOKEN, etc.     ip\_address INET NOT NULL, 

`    `device\_identifier VARCHAR(255), 

`    `success BOOLEAN NOT NULL, 

`    `failure\_reason VARCHAR(255), 

created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_auth\_type CHECK (authentication\_type IN ('OTP', 'TOKEN', 'PASSWORD', 'SSO')) 

); 

**A.3. Subscription Management Scripts** 

-- Subscription plans 

CREATE TABLE core.subscription\_plans ( 

`    `plan\_id SERIAL PRIMARY KEY, 

`    `plan\_name VARCHAR(100) NOT NULL, 

`    `plan\_description TEXT, 

`    `monthly\_price DECIMAL(10, 2) NOT NULL,     quarterly\_price DECIMAL(10, 2), 

`    `biannual\_price DECIMAL(10, 2), 

`    `annual\_price DECIMAL(10, 2), 

`    `currency VARCHAR(3) DEFAULT 'INR', 

`    `features JSONB NOT NULL, 

`    `is\_active BOOLEAN DEFAULT TRUE, 

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP,     updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP ); 

-- User subscriptions 

CREATE TABLE core.user\_subscriptions ( 

`    `subscription\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `user\_id UUID NOT NULL REFERENCES core.users(user\_id) ON DELETE CASCADE, 

`    `plan\_id INTEGER NOT NULL REFERENCES core.subscription\_plans(plan\_id), 

`    `start\_date TIMESTAMP WITH TIME ZONE NOT NULL, 

`    `end\_date TIMESTAMP WITH TIME ZONE NOT NULL, 

`    `billing\_cycle VARCHAR(20) NOT NULL,  -- MONTHLY, QUARTERLY, BIANNUAL, ANNUAL     auto\_renew BOOLEAN DEFAULT TRUE, 

`    `status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', 

`    `payment\_method VARCHAR(50), 

`    `payment\_reference VARCHAR(255),  -- Reference to external payment gateway

`    `cancellation\_date TIMESTAMP WITH TIME ZONE, 

`    `cancellation\_reason TEXT, 

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_subscription\_status CHECK (status IN ('ACTIVE', 'CANCELED', 'EXPIRED', 'PENDING')), 

`    `CONSTRAINT valid\_billing\_cycle CHECK (billing\_cycle IN ('MONTHLY', 'QUARTERLY', 'BIANNUAL', 'ANNUAL')) 

); 

**A.4. Astrological Chart System Scripts** 

-- Chart type reference table (for both natal and divisional charts) CREATE TABLE astrology.chart\_types ( 

`    `chart\_type\_id SERIAL PRIMARY KEY, 

chart\_code VARCHAR(20) NOT NULL UNIQUE, -- D-1, D-9, D-10, etc. 

chart\_name VARCHAR(100) NOT NULL,        -- Rasi, Navamsha, Dashamsha

chart\_category VARCHAR(50) NOT NULL,     -- NON\_DIVISIONAL, DIVISIONAL, LAGNA divisional\_factor INTEGER,               -- Null for non-divisional, numerical factor for divisional description TEXT, 

calculation\_method VARCHAR(50) NOT NULL, -- STANDARD, SRIPATI, KP\_SYSTEM, etc. created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT valid\_chart\_category CHECK (chart\_category IN ('NON\_DIVISIONAL', 'DIVISIONAL', 'LAGNA', 'BUSINESS', 'SPECIAL')) 

); 

-- Natal charts with enhanced chart type support

CREATE TABLE astrology.natal\_charts ( 

`    `chart\_id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(), 

`    `entity\_type VARCHAR(20) NOT NULL, -- USER, BUSINESS, PARTNER 

`    `user\_id UUID REFERENCES core.users(user\_id), 

`    `business\_id UUID REFERENCES business.business\_profiles(business\_id),

`    `partner\_id UUID REFERENCES business.business\_partners(partner\_id),

`    `birth\_date DATE NOT NULL, 

`    `birth\_time TIME NOT NULL, 

`    `birth\_location VARCHAR(255) NOT NULL, 

`    `birth\_coordinates GEOMETRY(Point, 4326) NOT NULL, 

`    `timezone\_offset NUMERIC(4, 2) NOT NULL,  -- Added timezone offset for precise calculations     ayanamsa VARCHAR(20) DEFAULT 'LAHIRI', 

`    `ayanamsa\_value DECIMAL(10, 6) NOT NULL,  -- Added for storing precise ayanamsa value at birth time 

house\_system VARCHAR(20) DEFAULT 'WHOLE\_SIGN', 

zodiac\_system VARCHAR(20) DEFAULT 'SIDEREAL', 

ascendant\_sign VARCHAR(20) NOT NULL,  -- Added for quick reference of ascendant sign ascendant\_degree DECIMAL(10, 6) NOT NULL,  -- Store as decimal degrees for calculations

`    `ascendant\_degree\_formatted VARCHAR(30),  -- Store formatted DMS for display (e.g., "1° 12' 31.28\"") 

`    `chart\_data JSONB NOT NULL,  -- Complete chart data including planets, houses, etc.

`    `created\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `updated\_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT\_TIMESTAMP, 

`    `CONSTRAINT entity\_reference\_check CHECK ( 

`        `(entity\_type = 'USER' AND user\_id IS NOT NULL) OR 

`        `(entity\_type = 'BUSINESS' AND business\_id IS NOT NULL) OR 

`        `(entity\_type = 'PARTNER' AND partner\_id IS NOT NULL) 

`    `), 

`    `CONSTRAINT valid\_entity\_type CHECK (entity\_type IN ('USER', 'BUSINESS', 'PARTNER')), 

`    `CONSTRAINT valid\_ayanamsa CHECK (ayanamsa IN ('LAHIRI', 'RAMAN', 'KP', 'TROPICAL')), 

`    `CONSTRAINT valid\_house\_system CHECK (house\_system IN ('WHOLE\_SIGN', 'PLACIDUS', 'KOCH', 'EQUAL')), 

`    `CONSTRAINT valid\_zodiac\_system CHECK (zodiac\_system IN ('SIDEREAL', 'TROPICAL')),     CONSTRAINT valid\_timezone\_offset CHECK (timezone\_offset BETWEEN -12.0 AND 14.0) ); 

**A.5. Angular Measurement Conversion Functions** 

-- Function to convert decimal degrees to DMS format

CREATE OR REPLACE FUNCTION astrology.decimal\_to\_dms(decimal\_degrees DECIMAL) RETURNS VARCHAR AS $ 

DECLARE 

`    `sign\_prefix VARCHAR := ''; 

`    `degrees INTEGER; 

`    `minutes INTEGER; 

`    `seconds DECIMAL; 

`    `absolute\_value DECIMAL; 

BEGIN 

`    `absolute\_value := ABS(decimal\_degrees); 

`    `IF decimal\_degrees < 0 THEN         sign\_prefix := '-'; 

`    `END IF; 

degrees := FLOOR(absolute\_value)::INTEGER; 

minutes := FLOOR((absolute\_value - degrees) \* 60)::INTEGER; seconds := ROUND(((absolute\_value - degrees) \* 60 - minutes) \* 60, 2); 

`    `-- Handle case where seconds round to 60     IF seconds >= 60 THEN 

`        `seconds := 0; 

`        `minutes := minutes + 1; 

`    `END IF; 

`    `-- Handle case where minutes reach 60     IF minutes >= 60 THEN 

`        `minutes := 0; 

`        `degrees := degrees + 1; 

`    `END IF; 

`    `RETURN sign\_prefix || degrees || '° ' || minutes || ''' ' || seconds || '"'; END; 

$ LANGUAGE plpgsql IMMUTABLE; 

-- Function to convert DMS format to decimal degrees

CREATE OR REPLACE FUNCTION astrology.dms\_to\_decimal(dms\_string VARCHAR) RETURNS DECIMAL AS $ 

DECLARE 

`    `sign\_multiplier DECIMAL := 1; 

`    `degrees\_part VARCHAR; 

`    `minutes\_part VARCHAR; 

`    `seconds\_part VARCHAR; 

`    `degrees DECIMAL; 

`    `minutes DECIMAL; 

`    `seconds DECIMAL; 

`    `pattern VARCHAR := '^(-?)(\d+)[°\s]+(\d+)[\''\s]+(\d+\.?\d\*)["\s]\*'; BEGIN 

`    `-- Check if negative 

`    `IF dms\_string LIKE '-%' THEN 

`        `sign\_multiplier := -1; 

`    `END IF; 

-- Extract parts using regex 

degrees\_part := (SELECT (regexp\_matches(dms\_string, pattern))[2]); minutes\_part := (SELECT (regexp\_matches(dms\_string, pattern))[3]); seconds\_part := (SELECT (regexp\_matches(dms\_string, pattern))[4]);

-- Convert to numbers 

degrees := degrees\_part::DECIMAL; minutes := minutes\_part::DECIMAL; seconds := seconds\_part::DECIMAL; 

`    `-- Validate values 

`    `IF minutes >= 60 OR seconds >= 60 THEN 

`        `RAISE EXCEPTION 'Invalid DMS value: minutes and seconds must be less than 60';     END IF; 

`    `RETURN sign\_multiplier \* (degrees + minutes/60 + seconds/3600); EXCEPTION 

`    `WHEN OTHERS THEN 

`        `RAISE EXCEPTION 'Invalid DMS format. Expected format: DD° MM'' SS.SS"'; END; 

$ LANGUAGE plpgsql IMMUTABLE; 

**Appendix B: MongoDB Collection Schemas and Validation Rules**

**B.1. Divisional Chart Collection Schema** 

db.createCollection("divisional\_charts", {

`  `validator: { 

`    `$jsonSchema: { 

`      `bsonType: "object", 

`      `required: ["chartId", "baseChartId", "chartType", "planets", "houses"],

`      `properties: { 

`        `chartId: { 

`          `bsonType: "string", 

`          `description: "UUID reference to derived\_charts in PostgreSQL"

`        `}, 

`        `baseChartId: { 

`          `bsonType: "string", 

`          `description: "UUID reference to natal\_charts in PostgreSQL"

`        `}, 

`        `chartType: { 

`          `bsonType: "string", 

`          `description: "Divisional chart type code (e.g., D-9)" 

`        `}, 

`        `chartName: { 

`          `bsonType: "string", 

`          `description: "Human-readable chart name (e.g., Navamsha)"

`        `}, 

`        `calculationMethod: { 

`          `bsonType: "string", 

`          `description: "Method used for calculation (e.g., STANDARD)" 

`        `}, 

`        `calculationParameters: { 

`          `bsonType: "object", 

`          `description: "Parameters used in chart calculation"         }, 

`        `planets: { 

`          `bsonType: "array", 

`          `description: "Array of planetary positions", 

`          `items: { 

`            `bsonType: "object", 

`            `required: ["name", "sign", "house", "longitude"],             properties: { 

`              `name: { bsonType: "string" }, 

`              `sign: { bsonType: "string" }, 

`              `house: { bsonType: "int" }, 

`              `longitude: { bsonType: "double" }, 

`              `longitudeFormatted: { bsonType: "string" }, 

`              `isRetrograde: { bsonType: "bool" }, 

`              `nakshatra: { bsonType: "string" }, 

`              `nakshatraPada: { bsonType: "int" }, 

`              `aspectsReceived: { bsonType: "array" } 

`           `} 

`          `} 

`        `}, 

`        `houses: { 

`          `bsonType: "array", 

`          `description: "Array of house positions", 

`          `items: { 

`            `bsonType: "object", 

`            `required: ["houseNumber", "sign"], 

`            `properties: { 

`              `houseNumber: { bsonType: "int" }, 

`              `sign: { bsonType: "string" }, 

`              `startLongitude: { bsonType: "double" }, 

`              `endLongitude: { bsonType: "double" }, 

`              `signLord: { bsonType: "string" }, 

`              `occupants: { bsonType: "array" } 

`           `} 

`          `} 

`        `}, 

`        `interpretationSummary: { 

`          `bsonType: "object", 

`          `description: "Summary of chart interpretation"

`        `}, 

`        `createdAt: { bsonType: "date" }, 

`        `updatedAt: { bsonType: "date" } 

`      `} 

`    `} 

`  `}, 

`  `validationLevel: "strict", 

`  `validationAction: "error" 

}); 

**B.2. KP Analysis Collection Schema** db.createCollection("kp\_analysis", { 

`  `validator: { 

`    `$jsonSchema: { 

`      `bsonType: "object", 

`      `required: ["chartId", "entityType", "entityId", "subLordAnalysis"],       properties: { 

`        `chartId: { 

`          `bsonType: "string", 

`          `description: "UUID reference to natal\_charts in PostgreSQL"

`        `}, 

`        `entityType: { 

`          `bsonType: "string", 

`          `enum: ["USER", "BUSINESS", "PARTNER"], 

`          `description: "Type of entity this analysis belongs to"

`        `}, 

`        `entityId: { 

`          `bsonType: "string", 

`          `description: "UUID reference to entity" 

`        `}, 

`        `kpSystem: { 

`          `bsonType: "string", 

`          `description: "KP system variant used for analysis"

`        `}, 

`        `subLordAnalysis: { 

`          `bsonType: "object", 

`          `required: ["cusps", "planets"], 

`          `properties: { 

`            `cusps: { 

`              `bsonType: "array", 

`              `items: { 

`                `bsonType: "object", 

`                `required: ["cuspNumber", "longitude", "starLord", "subLord"],                 properties: { 

`                  `cuspNumber: { bsonType: "int" }, 

`                  `longitude: { bsonType: "double" }, 

`                  `longitudeFormatted: { bsonType: "string" }, 

`                  `starLord: { bsonType: "string" }, 

`                  `subLord: { bsonType: "string" }, 

`                  `subSubLord: { bsonType: "string" }, 

`                  `significators: { bsonType: "array" }, 

`                  `cuspInterpretation: { bsonType: "string" } 

`               `} 

`              `} 

`            `}, 

`            `planets: { 

`              `bsonType: "array", 

`              `items: { 

`                `bsonType: "object", 

`                `required: ["planet", "longitude", "starLord", "subLord"],                 properties: { 

`                  `planet: { bsonType: "string" }, 

`                  `longitude: { bsonType: "double" }, 

`                  `longitudeFormatted: { bsonType: "string" }, 

`                  `starLord: { bsonType: "string" }, 

`                  `subLord: { bsonType: "string" }, 

`                  `subSubLord: { bsonType: "string" }, 

`                  `significators: { bsonType: "array" }, 

`                  `planetInterpretation: { bsonType: "string" } 

`               `} 

`              `} 

`           `} 

`          `} 

`        `}, 

`        `rulingPlanets: { bsonType: "object" }, 

`        `significators: { bsonType: "object" }, 

`        `predictiveAnalysis: { bsonType: "object" } 

`      `} 

`    `} 

`  `}, 

`  `validationLevel: "strict", 

`  `validationAction: "error" 

}); 

**B.3. Lo Shu Grid Analysis Collection Schema** db.createCollection("lo\_shu\_grid\_analysis", { 

`  `validator: { 

`    `$jsonSchema: { 

`      `bsonType: "object", 

`      `required: ["analysisId", "entityType", "entityId", "birthDate", "gridStructure"],       properties: { 

`        `analysisId: { 

`          `bsonType: "string", 

`          `description: "UUID reference to numerology\_analyses in PostgreSQL"

`        `}, 

`        `entityType: { 

`          `bsonType: "string", 

`          `enum: ["USER", "BUSINESS", "PARTNER"], 

`          `description: "Type of entity this analysis belongs to"

`        `}, 

`        `entityId: { 

`          `bsonType: "string", 

`          `description: "UUID reference to entity" 

`        `}, 

`        `birthDate: { 

`          `bsonType: "string", 

`          `description: "Date used to generate grid"

`        `}, 

`        `gridStructure: { 

`          `bsonType: "array", 

`          `description: "3x3 array representation of Lo Shu Grid",

`          `minItems: 3, 

`          `maxItems: 3, 

`          `items: { 

`            `bsonType: "array", 

`            `minItems: 3, 

`            `maxItems: 3, 

`            `items: { bsonType: "int" } 

`          `} 

`        `}, 

`        `missingNumbers: { 

`          `bsonType: "array", 

`          `description: "Numbers missing from grid", 

`          `items: { bsonType: "int" } 

`        `}, 

`        `excessNumbers: { 

`          `bsonType: "object", 

`          `description: "Numbers appearing multiple times with count"         }, 

`        `elementalBalance: { 

`          `bsonType: "object", 

`          `description: "Balance of elements based on grid positions",

`          `required: ["water", "fire", "earth", "metal", "wood"], 

`          `properties: { 

`            `water: { bsonType: "int" }, 

`            `fire: { bsonType: "int" }, 

`            `earth: { bsonType: "int" }, 

`            `metal: { bsonType: "int" }, 

`            `wood: { bsonType: "int" } 

`          `} 

`        `}, 

`        `lifePathAnalysis: { bsonType: "object" }, 

`        `personalityAnalysis: { bsonType: "object" }, 

`        `businessApplicability: { bsonType: "object" }, 

`        `compatibilityWithOwner: { bsonType: "double" },         createdAt: { bsonType: "date" }, 

`        `updatedAt: { bsonType: "date" } 

`      `} 

`    `} 

`  `}, 

`  `validationLevel: "strict", 

`  `validationAction: "error" 

}); 

**B.4. Muhurta Analysis Collection Schema** db.createCollection("muhurta\_analysis", {

`  `validator: { 

`    `$jsonSchema: { 

`      `bsonType: "object", 

`      `required: ["timingId", "businessId", "timingPurpose", "targetDate", "muhurtaWindows", "overallRecommendation"], 

`      `properties: { 

`        `timingId: { 

`          `bsonType: "string", 

`          `description: "UUID reference to business\_astrological\_timing in PostgreSQL"         }, 

`        `businessId: { 

`          `bsonType: "string", 

`          `description: "UUID of business entity" 

`        `}, 

`        `timingPurpose: { 

`          `bsonType: "string", 

`          `description: "Purpose of timing analysis (e.g., PRODUCT\_LAUNCH)"         }, 

`        `targetDate: { 

`          `bsonType: "date", 

`          `description: "Target date for muhurta analysis"

`        `}, 

`        `lunarDay: { 

`          `bsonType: "object", 

`          `description: "Lunar day (tithi) information" 

`        `}, 

`        `nakshatra: { 

`          `bsonType: "object", 

`          `description: "Nakshatra information"

`        `}, 

`        `yoga: { 

`          `bsonType: "object", 

`          `description: "Yoga information" 

`        `}, 

`        `karana: { 

`          `bsonType: "object", 

`          `description: "Karana information" 

`        `}, 

`        `weekdayAnalysis: { 

`          `bsonType: "object", 

`          `description: "Weekday analysis" 

`        `}, 

`        `planetaryPositions: { 

`          `bsonType: "array", 

`          `description: "Planetary positions for the day"

`        `}, 

`        `muhurtaWindows: { 

`          `bsonType: "array", 

`          `description: "Time windows suitable for activity", 

`          `items: { 

`            `bsonType: "object", 

`            `required: ["name", "startTime", "endTime", "quality"],             properties: { 

`              `name: { bsonType: "string" }, 

`              `startTime: { bsonType: "date" }, 

`              `endTime: { bsonType: "date" }, 

`              `quality: { bsonType: "double" }, 

`              `significance: { bsonType: "string" }, 

`              `recommendation: { bsonType: "string" } 

`           `} 

`          `} 

`        `}, 

`        `choghadiyaPeriods: { 

`          `bsonType: "array", 

`          `description: "Choghadiya periods for the day"

`        `}, 

`        `horaPeriods: { 

`          `bsonType: "array", 

`          `description: "Planetary hour periods"

`        `}, 

`        `overallRecommendation: { 

`          `bsonType: "object", 

`          `required: ["optimalTimestamp", "quality", "rationale"],           properties: { 

`            `optimalTimestamp: { bsonType: "date" }, 

`            `quality: { bsonType: "double" }, 

`            `rationale: { bsonType: "string" }, 

`            `implementationGuidelines: { bsonType: "array" }           } 

`        `}, 

`        `alternateTimings: { 

`          `bsonType: "array", 

`          `description: "Alternative timing options" 

`        `} 

`      `} 

`    `} 

`  `}, 

`  `validationLevel: "strict", 

`  `validationAction: "error" 

}); 

**Appendix C: Redis Key Pattern Reference and Implementation Guide C.1. Key Naming Convention Schema** 



|**Purpose** |**Key Pattern** |
| - | - |
|**Value Type** |**TTL** |
| :- | - |
|Authentic ation |auth:token:{token} |
| :- | - |
|Hash |24h |
| - | - |
|User Session |user:session:{user\_id} |
| :- | - |
|Hash |30m |
| - | - |
|Planet Position |planet:positions:{date} |
| :- | - |
|Hash |7d |
| - | - |

Natal  natal:chart:a1b2c3 1![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.017.png)![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.018.png)  natal:chart:{chart\_id}  Hash  24h 

Chart  d4-e5f6-g7h8-i9j0 



|**Purpose** |**Key Pattern** |
| - | - |
|**Value Type** |**TTL** |
| :- | - |
|Transit Aspects |transit:aspects:{natal\_chart\_i d}:{date} |
| :- | :- |
|Hash |24h |
| - | - |
|Ephemeri s |ephemeris:day:{date} |
| :- | - |
|Hash |90d |
| - | - |
|Divisional Chart |divisional:{chart\_id}:{div\_type } |
| :- | :- |
|Hash |24h |
| - | - |

Numerolo numerology:name:![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.019.png)![](Aspose.Words.18d5b6e1-91ba-4f16-ac61-7f7a5b40b23d.020.png)

numerology:name:{name}:{sy

10  gy  Hash  30d  John 

stem} 

Analysis  Doe:CHALDEAN 

KP  kp:chart:a1b2c3d4 11  kp:chart:{chart\_id}  Hash  24h 

Analysis  -e5f6-g7h8-i9j0 

Muhurta  muhurta:day:2023 - 12  muhurta:day:{date}  Hash  7d 

Analysis  07-15 

dasha:current:a1b Dasha 

13  dasha:current:{chart\_id}  Hash  1d  2c3d4-e5f6-g7h8-

Periods 

i9j0 

**C.2. Redis Configuration Parameters** 

- Redis Configuration for Corp Astro Environment 
- General Configuration 

daemonize yes 

pidfile /var/run/redis/redis-server.pid port 6379 

tcp-backlog 511 

timeout 0 

tcp-keepalive 300 

- Memory Management maxmemory 8gb maxmemory-policy volatile-ttl maxmemory-samples 5 
- Multi-Database Configuration databases 14 
- Persistence Configuration 

  save 900 1 

  save 300 10 

  save 60 10000 stop-writes-on-bgsave-error yes rdbcompression yes rdbchecksum yes 

  dbfilename dump.rdb 

  dir /var/lib/redis 

  appendonly yes 

  appendfilename "appendonly.aof" appendfsync everysec no-appendfsync-on-rewrite no auto-aof-rewrite-percentage 100 auto-aof-rewrite-min-size 64mb 

- Replication (if needed) 
- slaveof <masterip> <masterport> 
- masterauth <master-password> 
- Performance Tuning hash-max-ziplist-entries 512 

hash-max-ziplist-value 64 

list-max-ziplist-size -2 

list-compress-depth 0 

set-max-intset-entries 512 

zset-max-ziplist-entries 128 

zset-max-ziplist-value 64 

activerehashing yes 

client-output-buffer-limit normal 0 0 0 client-output-buffer-limit slave 256mb 64mb 60 client-output-buffer-limit pubsub 32mb 8mb 60 

**C.3. Redis Data Structure Implementation Examples C.3.1. Planet Positions Cache Structure**

// Implementation of planet:positions:{date} key structure // Example for the key 'planet:positions:2023-07-15' 

// Structure as nested hash with planet names as fields { 

`  `"sun": { 

`    `"longitude": 113.5, 

`    `"longitude\_formatted": "113° 30' 0.00\"", 

`    `"sign": "Cancer", 

`    `"degree": 23.5, 

`    `"nakshatra": "Ashlesha", 

`    `"nakshatra\_pada": 2, 

`    `"is\_retrograde": false 

`  `}, 

`  `"moon": { 

`    `"longitude": 75.2, 

`    `"longitude\_formatted": "75° 12' 0.00\"", 

`    `"sign": "Gemini", 

`    `"degree": 15.2, 

`    `"nakshatra": "Ardra",     "nakshatra\_pada": 1,     "is\_retrograde": false   }, 

`  `// Additional planets... } 

**// Implementation commands**

HMSET "planet:positions:2023-07-15" "sun" "{\"longitude\":113.5,\"longitude\_formatted\":\"113° 30' 0.00\\\"\",\"sign\":\"Cancer\",\"degree\":23.5,\"nakshatra\":\"Ashlesha\",\"nakshatra\_pada\":2,\"i s\_retrograde\":false}" 

HMSET "planet:positions:2023-07-15" "moon" "{\"longitude\":75.2,\"longitude\_formatted\":\"75° 12' 0.00\\\"\",\"sign\":\"Gemini\",\"degree\":15.2,\"nakshatra\":\"Ardra\",\"nakshatra\_pada\":1,\"is\_re trograde\":false}" 

EXPIRE "planet:positions:2023-07-15" 604800  // 7 days in seconds **C.3.2. Dasha Period Cache Structure** 

// Implementation of dasha:current:{chart\_id} key structure

// Example for the key 'dasha:current:a1b2c3d4-e5f6-g7h8-i9j0' 

// Structure as nested hash with period levels as fields { 

`  `"system": "VIMSHOTTARI", 

`  `"maha\_dasha": { 

`    `"planet": "Jupiter", 

`    `"start\_date": "2018-05-10T00:00:00Z", 

`    `"end\_date": "2034-05-10T00:00:00Z", 

`    `"remaining": "11 years, 2 months, 15 days" 

`  `}, 

`  `"antar\_dasha": { 

`    `"planet": "Venus", 

`    `"start\_date": "2022-01-15T00:00:00Z",     "end\_date": "2024-09-15T00:00:00Z",     "remaining": "1 year, 6 months, 3 days"   }, 

`  `"pratyantar\_dasha": { 

`    `"planet": "Mercury", 

`    `"start\_date": "2023-06-10T00:00:00Z",     "end\_date": "2023-11-05T00:00:00Z",     "remaining": "3 months, 22 days" 

`  `} 

} 

**// Implementation commands**

HSET "dasha:current:a1b2c3d4-e5f6-g7h8-i9j0" "system" "VIMSHOTTARI" 

HSET "dasha:current:a1b2c3d4-e5f6-g7h8-i9j0" "maha\_dasha" "{\"planet\":\"Jupiter\",\"start\_date\":\"2018-05-10T00:00:00Z\",\"end\_date\":\"2034-05- 10T00:00:00Z\",\"remaining\":\"11 years, 2 months, 15 days\"}" 

HSET "dasha:current:a1b2c3d4-e5f6-g7h8-i9j0" "antar\_dasha" "{\"planet\":\"Venus\",\"start\_date\":\"2022-01-15T00:00:00Z\",\"end\_date\":\"2024-09- 15T00:00:00Z\",\"remaining\":\"1 year, 6 months, 3 days\"}" 

HSET "dasha:current:a1b2c3d4-e5f6-g7h8-i9j0" "pratyantar\_dasha" "{\"planet\":\"Mercury\",\"start\_date\":\"2023-06-10T00:00:00Z\",\"end\_date\":\"2023-11- 05T00:00:00Z\",\"remaining\":\"3 months, 22 days\"}" 

EXPIRE "dasha:current:a1b2c3d4-e5f6-g7h8-i9j0" 86400  // 1 day in seconds 
