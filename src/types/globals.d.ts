// src/types/globals.d.ts

import { SystemMetrics } from '../services/scalability/utils/monitoring';

// Extend the global namespace to include our custom properties
declare global {
  var systemHealth: {
    status: 'healthy' | 'degraded' | 'critical';
    metrics: SystemMetrics;
    lastUpdated?: Date;
  };
}

// This export is needed to make this a module
export {};
