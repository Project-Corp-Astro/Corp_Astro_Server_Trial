#!/usr/bin/env ts-node

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Start the server
const server = spawn('npm', ['run', 'start'], {
  stdio: 'inherit',
  env: { ...process.env }
});

// Handle server process events
server.on('error', (error) => {
  console.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});

server.on('close', (code) => {
  if (code !== 0) {
    console.error(`Server process exited with code ${code}`);
    process.exit(code || 1);
  }
  console.log('Server stopped');
});

// Handle process signals
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down server...');
  server.kill('SIGTERM');
});

console.log('Server started. Press Ctrl+C to stop.');
