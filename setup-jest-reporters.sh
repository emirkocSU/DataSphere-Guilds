#!/bin/bash

# DataSphere Guilds - Jest Reporter Setup Script
# This script installs additional Jest reporters for enhanced test reporting

echo "📦 Installing Jest reporters for DataSphere Guilds..."

# Install Jest HTML reporters
npm install --save-dev jest-html-reporters@^3.1.4

# Install Jest progress bar reporter
npm install --save-dev jest-progress-bar-reporter@^1.0.21

# Install GitHub Actions reporter (if needed)
npm install --save-dev @jest/reporters@^29.7.0

# Install additional testing utilities
npm install --save-dev @emotion/jest@^11.11.0
npm install --save-dev jest-canvas-mock@^2.5.2

echo "✅ Jest reporters installation complete!"
echo ""
echo "📝 Available test commands:"
echo "  npm test                    - Run all tests"
echo "  npm run test:native         - Run native platform tests"
echo "  npm run test:web            - Run web platform tests"
echo "  npm run test:coverage       - Run tests with coverage"
echo "  npm run test:watch          - Run tests in watch mode"
echo "  npm run test:performance    - Run tests with performance stats"
echo "  npm run test:memory         - Run tests with memory leak detection"
echo ""
echo "🚀 Happy testing!" 