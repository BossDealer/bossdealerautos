#!/bin/bash

# Build script for deployment
echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Copy additional files to dist
echo "Copying additional files..."
cp public/_redirects dist/ 2>/dev/null || true

echo "Build complete! Files ready for deployment in 'dist' directory."