/**
 * Sequelize helper utilities for analytics operations
 * These functions help with common Sequelize operations and type casting
 */

import { Sequelize, Op, literal, fn, col, where } from 'sequelize';

// Create a new Sequelize instance for analytics operations
export const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/corpastro', {
  dialect: 'postgres',
  logging: false
});

/**
 * Creates a properly typed literal expression for Sequelize queries
 * This helps with TypeScript type checking for Sequelize operations
 * @param expression SQL expression as a string
 * @returns A properly typed Sequelize literal expression
 */
export function safeLiteral(expression: string): any {
  return literal(expression);
}

/**
 * Creates a properly typed column reference for Sequelize queries
 * @param columnName Column name
 * @returns A properly typed Sequelize column reference
 */
export function safeCol(columnName: string): any {
  return col(columnName);
}

/**
 * Creates a properly typed function call for Sequelize queries
 * @param functionName SQL function name
 * @param args Arguments for the function
 * @returns A properly typed Sequelize function call
 */
export function safeFn(functionName: string, ...args: any[]): any {
  return fn(functionName, ...args);
}

// Export Sequelize operators
export { Op };
