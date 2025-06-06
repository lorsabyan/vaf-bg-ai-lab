#!/bin/bash

set -e

echo "🏗️  Starting GitHub Pages deployment for VAF BG AI Lab..."

# Configuration
REPO_URL="https://github.com/lorsabyan/vaf-bg-ai-lab.git"
V1_BRANCH="release/v1"
V2_BRANCH="release/v2"

# Clean up any existing temp directories
rm -rf temp-v1 temp-v2 gh-pages-deploy

echo "🚀 Building V1 from $V1_BRANCH..."
git clone -b $V1_BRANCH $REPO_URL temp-v1
cd temp-v1

# Create v1 specific next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/vaf-bg-ai-lab' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/vaf-bg-ai-lab/' : '',
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}
module.exports = nextConfig
EOF

npm install
npm run build
cd ..

echo "🚀 Building V2 from $V2_BRANCH..."
git clone -b $V2_BRANCH $REPO_URL temp-v2
cd temp-v2

# Create v2 specific next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/vaf-bg-ai-lab/v2' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/vaf-bg-ai-lab/v2/' : '',
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}
module.exports = nextConfig
EOF

npm install
npm run build
cd ..

echo "📁 Preparing deployment directory..."
mkdir -p gh-pages-deploy

# Copy v1 to root
echo "📁 Copying V1 to root..."
cp -r temp-v1/out/* gh-pages-deploy/

# Copy v2 to /v2 subdirectory
echo "📁 Copying V2 to /v2..."
mkdir -p gh-pages-deploy/v2
cp -r temp-v2/out/* gh-pages-deploy/v2/

# Create version info page
echo "📄 Creating version info page..."
cat > gh-pages-deploy/version-info.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>VAF BG AI Lab - Version Info</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 40px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container { max-width: 800px; margin: 0 auto; }
        .version-box { 
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 30px; 
            margin: 20px 0; 
            border-radius: 16px;
            transition: transform 0.3s ease;
        }
        .version-box:hover {
            transform: translateY(-5px);
        }
        h1 { text-align: center; font-size: 3em; margin-bottom: 0.5em; }
        h2 { color: #fff; font-size: 1.5em; }
        a { 
            color: #ffffff; 
            text-decoration: none; 
            font-weight: bold;
            display: inline-block;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            transition: background 0.3s ease;
        }
        a:hover { 
            background: rgba(255, 255, 255, 0.3);
        }
        .subtitle { text-align: center; opacity: 0.9; margin-bottom: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧠 VAF BG AI Lab</h1>
        <p class="subtitle">Choose your version to explore the AI-powered application</p>
        
        <div class="version-box">
            <h2>🔹 Version 1 (Stable)</h2>
            <p><a href="./">Launch V1 →</a></p>
            <p>The main stable version of the application with proven features and reliability.</p>
        </div>
        
        <div class="version-box">
            <h2>✨ Version 2 (Latest)</h2>
            <p><a href="./v2/">Launch V2 →</a></p>
            <p>The latest development version featuring cutting-edge AI capabilities and new features.</p>
        </div>
    </div>
</body>
</html>
EOF

echo "📤 Deploying to GitHub Pages..."
cd gh-pages-deploy
git init
git config user.name "Deployment Script"
git config user.email "deploy@vaf-bg-ai-lab.com"
git add .
git commit -m "Deploy v1 and v2 to GitHub Pages - $(date)"
git remote add origin $REPO_URL

# Push to gh-pages branch
git push -f origin HEAD:gh-pages

cd ..

echo "🧹 Cleaning up..."
rm -rf temp-v1 temp-v2 gh-pages-deploy

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your site will be available at:"
echo "   V1 (root): https://lorsabyan.github.io/vaf-bg-ai-lab/"
echo "   V2: https://lorsabyan.github.io/vaf-bg-ai-lab/v2/"
echo "   Version info: https://lorsabyan.github.io/vaf-bg-ai-lab/version-info.html"
echo ""
echo "Note: It may take a few minutes for GitHub Pages to update."
