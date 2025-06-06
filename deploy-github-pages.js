#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const REPO_URL = 'https://github.com/lorsabyan/vaf-bg-ai-lab.git';
const GH_PAGES_BRANCH = 'gh-pages';
const V1_BRANCH = 'release/v1';
const V2_BRANCH = 'release/v2';

function runCommand(command, cwd = process.cwd()) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
  } catch (error) {
    console.error(`Error running command: ${command}`);
    process.exit(1);
  }
}

function createNextConfigForVersion(version) {
  const basePath = version === 'v1' ? '' : '/v2';
  const assetPrefix = version === 'v1' ? '/vaf-bg-ai-lab/' : '/vaf-bg-ai-lab/v2/';
  
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: true, // Required for static export
  },
  // Enable static exports for GitHub Pages deployment
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '${basePath}' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '${assetPrefix}' : '',
  // Disable server-side features for static export
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig`;
}

async function deployVersion(version, branch) {
  console.log(`\n🚀 Deploying ${version} from ${branch}...`);
  
  // Create a temporary directory for this version
  const tempDir = path.join(process.cwd(), `temp-${version}`);
  
  // Clone the specific branch
  runCommand(`git clone -b ${branch} ${REPO_URL} ${tempDir}`);
  
  // Create version-specific next.config.js
  const nextConfigPath = path.join(tempDir, 'next.config.js');
  fs.writeFileSync(nextConfigPath, createNextConfigForVersion(version));
  
  // Install dependencies and build
  runCommand('npm install', tempDir);
  runCommand('npm run build', tempDir);
  
  return path.join(tempDir, 'out');
}

async function main() {
  console.log('🏗️  Starting GitHub Pages deployment...');
  
  // Deploy both versions
  const v1OutDir = await deployVersion('v1', V1_BRANCH);
  const v2OutDir = await deployVersion('v2', V2_BRANCH);
  
  // Create final deployment directory
  const deployDir = path.join(process.cwd(), 'gh-pages-deploy');
  
  // Clean and create deploy directory
  if (fs.existsSync(deployDir)) {
    runCommand(`rm -rf ${deployDir}`);
  }
  fs.mkdirSync(deployDir, { recursive: true });
  
  // Copy v1 to root
  console.log('📁 Copying v1 to root...');
  runCommand(`cp -r ${v1OutDir}/* ${deployDir}/`);
  
  // Copy v2 to /v2 subdirectory
  console.log('📁 Copying v2 to /v2...');
  const v2DeployDir = path.join(deployDir, 'v2');
  fs.mkdirSync(v2DeployDir, { recursive: true });
  runCommand(`cp -r ${v2OutDir}/* ${v2DeployDir}/`);
  
  // Create a simple index.html that shows version info
  const rootIndexPath = path.join(deployDir, 'version-info.html');
  fs.writeFileSync(rootIndexPath, `
<!DOCTYPE html>
<html>
<head>
    <title>VAF BG AI Lab - Version Info</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .version-box { 
            border: 1px solid #ddd; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 8px;
        }
        a { color: #0070f3; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>VAF BG AI Lab</h1>
    <p>Welcome to the VAF BG AI Lab project. Choose your version:</p>
    
    <div class="version-box">
        <h2>Version 1 (Current/Stable)</h2>
        <p><a href="./">Go to V1 →</a></p>
        <p>The main stable version of the application.</p>
    </div>
    
    <div class="version-box">
        <h2>Version 2 (Latest)</h2>
        <p><a href="./v2/">Go to V2 →</a></p>
        <p>The latest development version with new features.</p>
    </div>
</body>
</html>
  `);
  
  // Initialize git in deploy directory and push to gh-pages
  console.log('📤 Deploying to GitHub Pages...');
  runCommand('git init', deployDir);
  runCommand('git config user.name "GitHub Actions"', deployDir);
  runCommand('git config user.email "actions@github.com"', deployDir);
  runCommand('git add .', deployDir);
  runCommand('git commit -m "Deploy v1 and v2 to GitHub Pages"', deployDir);
  runCommand(`git remote add origin ${REPO_URL}`, deployDir);
  runCommand(`git push -f origin HEAD:${GH_PAGES_BRANCH}`, deployDir);
  
  // Cleanup
  console.log('🧹 Cleaning up...');
  runCommand(`rm -rf temp-v1 temp-v2 ${deployDir}`);
  
  console.log('✅ Deployment complete!');
  console.log('🌐 Your site will be available at:');
  console.log('   V1 (root): https://lorsabyan.github.io/vaf-bg-ai-lab/');
  console.log('   V2: https://lorsabyan.github.io/vaf-bg-ai-lab/v2/');
  console.log('   Version info: https://lorsabyan.github.io/vaf-bg-ai-lab/version-info.html');
}

main().catch(console.error);
