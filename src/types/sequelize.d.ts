// src/types/sequelize.d.ts
import { Sequelize, Options } from 'sequelize';

// Extend the Sequelize types to include the missing properties
declare module 'sequelize' {
  interface Sequelize {
    // Add QueryTypes property
    QueryTypes: {
      SELECT: string;
      INSERT: string;
      UPDATE: string;
      DELETE: string;
      BULKDELETE: string;
      BULKUPDATE: string;
      RAW: string;
    };
  }
  
  // Extend ConnectionManager to include pool property
  interface ConnectionManager {
    pool: {
      size: number;
      available: number;
      pending: number;
    };
  }
}
