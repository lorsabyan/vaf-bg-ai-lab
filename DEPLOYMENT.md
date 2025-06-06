# GitHub Pages Deployment Guide

This project supports deploying multiple versions to GitHub Pages with the following URL structure:

- **V1 (Stable)**: `https://lorsabyan.github.io/vaf-bg-ai-lab/` (root path)
- **V2 (Latest)**: `https://lorsabyan.github.io/vaf-bg-ai-lab/v2/`
- **Version Info**: `https://lorsabyan.github.io/vaf-bg-ai-lab/version-info.html`

## Automatic Deployment

The repository is configured with GitHub Actions that automatically deploy both versions when you push to the release branches:

- Push to `release/v1` → Updates V1 at the root path
- Push to `release/v2` → Updates V2 at the `/v2` path

## Manual Deployment

### Option 1: Using the Bash Script
```bash
./deploy.sh
```

### Option 2: Using the Node.js Script
```bash
npm run deploy:versions
# or
node deploy-github-pages.js
```

### Option 3: Using npm script
```bash
npm run deploy:versions
```

## How It Works

1. **Detects Project Type**: Automatically detects whether each branch uses Next.js or Create React App
2. **Builds V1**: Clones `release/v1` branch and builds with appropriate configuration:
   - **Next.js**: Uses root path configuration with `basePath: '/vaf-bg-ai-lab'`
   - **Create React App**: Sets `homepage` in package.json and fixes ESLint config
3. **Builds V2**: Clones `release/v2` branch and builds with appropriate configuration:
   - **Next.js**: Uses `/v2` path configuration with `basePath: '/vaf-bg-ai-lab/v2'`
   - **Create React App**: Sets `homepage` with `/v2` path and fixes ESLint config
4. **Combines Output**: Merges both builds into a single deployment directory
   - Next.js builds output to `out/` directory
   - Create React App builds output to `build/` directory
5. **Deploys**: Pushes the combined output to the `gh-pages` branch

## Configuration Details

The deployment system automatically detects the project type and applies the appropriate configuration:

### Next.js Projects

#### V1 Configuration (Root Path)
```javascript
basePath: '/vaf-bg-ai-lab'
assetPrefix: '/vaf-bg-ai-lab/'
output: 'export'
```

#### V2 Configuration (/v2 Path)
```javascript
basePath: '/vaf-bg-ai-lab/v2'
assetPrefix: '/vaf-bg-ai-lab/v2/'
output: 'export'
```

### Create React App Projects

#### V1 Configuration (Root Path)
```json
{
  "homepage": "https://lorsabyan.github.io/vaf-bg-ai-lab"
}
```

#### V2 Configuration (/v2 Path)
```json
{
  "homepage": "https://lorsabyan.github.io/vaf-bg-ai-lab/v2"
}
```

Both project types also receive fixed ESLint configurations to prevent build failures.

## GitHub Pages Settings

Make sure your repository's GitHub Pages settings are configured to:
- **Source**: Deploy from a branch
- **Branch**: `gh-pages` / `/ (root)`

## Files Created

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `deploy.sh` - Bash deployment script
- `deploy-github-pages.js` - Node.js deployment script
- `DEPLOYMENT.md` - This documentation

## Troubleshooting

1. **404 Errors**: Ensure the paths are correctly configured for each project type
2. **Build Failures**: 
   - **Next.js**: Check that `basePath` and `assetPrefix` are correctly configured
   - **Create React App**: Check that `homepage` is set in package.json
   - **ESLint Issues**: The script automatically fixes common ESLint config conflicts between Next.js and CRA
3. **Deployment Issues**: Verify that the repository has proper permissions for GitHub Actions
4. **Mixed Project Types**: The deployment system handles both Next.js and CRA projects automatically

### Common ESLint Errors

If you see errors like:
```
Failed to load config "next/core-web-vitals" to extend from.
```

This happens when a Create React App project has Next.js ESLint configuration. The deployment scripts now automatically:
- Replace `.eslintrc.json` with CRA-compatible configuration
- Remove `next.config.js` and `next-env.d.ts` files when building CRA projects
- Set appropriate `homepage` in `package.json` for static deployment

## Notes

- The deployment creates a beautiful version selector page at `/version-info.html`
- Both versions are completely independent and can be updated separately
- The GitHub Actions workflow requires no manual intervention once set up
