#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Configuration
const rootDir = path.resolve(__dirname, 'src');
const fileExtensions = ['.ts', '.tsx'];

// Helper function to recursively get all files
async function getAllFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory() ? getAllFiles(fullPath) : fullPath;
    })
  );
  return files.flat();
}

// Check if a file should be processed
function shouldProcessFile(filePath: string): boolean {
  const ext = path.extname(filePath);
  return fileExtensions.includes(ext);
}

// Update relative imports to use absolute paths
async function updateImports(filePath: string): Promise<void> {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Replace relative imports with absolute imports
    const updatedContent = content.replace(
      /(import\s+(?:[\w\s{},*]+\s+from\s+['"])\.\.?\/.*?)(['"])/g,
      (match, importStatement, quote) => {
        // Don't change external package imports
        if (importStatement.includes('node_modules')) {
          return match;
        }
        
        // Get the relative path
        const relativePath = importStatement.match(/(['"])(.+?)(['"])/)?.[2];
        if (!relativePath) return match;
        
        // Calculate the absolute path
        const currentDir = path.dirname(filePath);
        const absolutePath = path.resolve(currentDir, relativePath);
        
        // Get the path relative to src directory
        const srcRelativePath = path.relative(rootDir, absolutePath);
        
        // Create the new import statement
        return `import ${importStatement.split('from')[0]} from '@src/${srcRelativePath}'${quote}`;
      }
    );
    
    if (content !== updatedContent) {
      await writeFile(filePath, updatedContent, 'utf8');
      console.log(`Updated imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Main function
async function main(): Promise<void> {
  try {
    console.log('Updating imports to use absolute paths...');
    
    // Get all files
    const files = await getAllFiles(rootDir);
    
    // Filter files to process
    const filesToProcess = files.filter(shouldProcessFile);
    
    // Update imports in each file
    await Promise.all(filesToProcess.map(updateImports));
    
    console.log('Import update completed successfully!');
  } catch (error) {
    console.error('Error updating imports:', error);
    process.exit(1);
  }
}

// Run the script
main();
