/**
 * Analytics system verification script
 * This script verifies that the analytics system's TypeScript errors have been fixed
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Verifying analytics system...');

// Define the analytics system files to check
const analyticsFiles = [
  'src/services/analytics/utils/astrologyABTests.ts',
  'src/services/analytics/utils/abTestingService.ts',
  'src/services/analytics/utils/subscriptionAnalytics.ts',
  'src/services/analytics/utils/eventSchema.ts',
  'src/services/analytics/utils/sequelizeHelpers.ts',
  'src/services/analytics/models/index.ts',
  'src/services/analytics/index.ts'
];

// Check if all files exist
const missingFiles = analyticsFiles.filter(file => !fs.existsSync(path.resolve(__dirname, '../../', file)));

if (missingFiles.length > 0) {
  console.error('Error: The following analytics files are missing:');
  missingFiles.forEach(file => console.error(`  - ${file}`));
  process.exit(1);
}

// Run TypeScript compiler to check for errors
try {
  console.log('Running TypeScript compiler check...');
  execSync('npx tsc --noEmit ' + analyticsFiles.join(' '), {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../../')
  });
  console.log('Analytics system verification successful!');
} catch (error) {
  console.error('Error: TypeScript compilation failed for analytics files.');
  process.exit(1);
}

// Run tests for analytics components
try {
  console.log('Running analytics tests...');
  execSync('npm run test:unit -- --testMatch="**/services/analytics/**/__tests__/**/*.test.ts"', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../../')
  });
  console.log('Analytics tests completed successfully!');
} catch (error) {
  console.error('Error: Analytics tests failed.');
  process.exit(1);
}

console.log('Analytics system is ready for production use.');
