// scripts/prune-dependencies.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * This script helps reduce the size of node_modules by:
 * 1. Removing unnecessary files (tests, docs, examples)
 * 2. Pruning dev dependencies
 * 3. Removing large dependencies that are only used in specific contexts
 */

const ROOT_DIR = path.resolve(__dirname, '..');
const NODE_MODULES = path.join(ROOT_DIR, 'node_modules');

// Patterns to remove from node_modules
const PATTERNS_TO_REMOVE = [
  // Test files
  '**/*.spec.js',
  '**/*.test.js',
  '**/test/**',
  '**/tests/**',
  // Documentation
  '**/*.md',
  '**/docs/**',
  '**/doc/**',
  // Examples
  '**/example/**',
  '**/examples/**',
  // Source maps
  '**/*.map',
  // TypeScript source files (keep .d.ts)
  '**/*.ts',
  '!**/*.d.ts',
  // Development files
  '**/.github/**',
  '**/.vscode/**',
  '**/.idea/**',
  // Large dependencies that are moved to separate API routes
  '**/puppeteer-extra/**',
  '**/puppeteer-extra-plugin-stealth/**',
  '**/face-api.js/**',
  '**/pdfkit/**',
  '**/canvas/build/**',
];

console.log('🧹 Pruning dependencies to reduce serverless function size...');

// 1. Prune dev dependencies
console.log('\n📦 Pruning dev dependencies...');
try {
  execSync('npm prune --production', { cwd: ROOT_DIR, stdio: 'inherit' });
  console.log('✅ Dev dependencies pruned successfully');
} catch (error) {
  console.error('❌ Failed to prune dev dependencies:', error.message);
}

// 2. Remove unnecessary files
console.log('\n🗑️  Removing unnecessary files from node_modules...');

function getFilesToRemove(patterns) {
  try {
    // Use glob to find files matching patterns
    const glob = require('glob');
    let allFiles = [];
    
    for (const pattern of patterns) {
      const isNegated = pattern.startsWith('!');
      const actualPattern = isNegated ? pattern.slice(1) : pattern;
      
      const files = glob.sync(actualPattern, {
        cwd: NODE_MODULES,
        absolute: true,
        dot: true,
      });
      
      if (isNegated) {
        // For negated patterns, remove these files from allFiles
        allFiles = allFiles.filter(file => !files.includes(file));
      } else {
        // For normal patterns, add these files to allFiles
        allFiles = [...allFiles, ...files];
      }
    }
    
    return allFiles;
  } catch (error) {
    console.error('Error finding files to remove:', error.message);
    return [];
  }
}

function removeFiles(files) {
  let removedCount = 0;
  let totalSize = 0;
  
  for (const file of files) {
    try {
      const stats = fs.statSync(file);
      if (stats.isDirectory()) {
        // Remove directory recursively
        fs.rmSync(file, { recursive: true, force: true });
      } else {
        // Remove file
        fs.unlinkSync(file);
      }
      
      removedCount++;
      totalSize += stats.size;
    } catch (error) {
      // Ignore errors for files that don't exist
      if (error.code !== 'ENOENT') {
        console.error(`Error removing ${file}:`, error.message);
      }
    }
  }
  
  return { removedCount, totalSize };
}

// Install glob if not already installed
try {
  require.resolve('glob');
} catch (error) {
  console.log('Installing glob package for file pattern matching...');
  execSync('npm install --no-save glob', { cwd: ROOT_DIR, stdio: 'inherit' });
}

const filesToRemove = getFilesToRemove(PATTERNS_TO_REMOVE);
const { removedCount, totalSize } = removeFiles(filesToRemove);

console.log(`✅ Removed ${removedCount} unnecessary files/directories`);
console.log(`💾 Saved approximately ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);

console.log('\n🎉 Dependency pruning complete!');