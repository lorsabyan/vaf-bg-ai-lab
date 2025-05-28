#!/bin/bash

# VAF Brainograph AI Lab - Deployment Script
# This script prepares and deploys the app to GitHub Pages

echo "🚀 Starting deployment process for VAF Brainograph AI Lab..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the correct directory?"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies"
        exit 1
    fi
fi

# Build the project
echo "🔨 Building the project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed"
    exit 1
fi

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
npm run deploy
if [ $? -ne 0 ]; then
    echo "❌ Error: Deployment failed"
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo "🌟 Your app should be available at: https://lorsabyan.github.io/vaf-bg-ai-lab"
echo ""
echo "📝 Next steps:"
echo "   1. Test the deployed app"
echo "   2. Configure your Gemini API key in the app"
echo "   3. Share the link with your users"
echo ""
echo "🎉 Happy learning with Brainograph AI Lab!"
