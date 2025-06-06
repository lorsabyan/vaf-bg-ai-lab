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

1. **Builds V1**: Clones `release/v1` branch and builds with root path configuration
2. **Builds V2**: Clones `release/v2` branch and builds with `/v2` path configuration
3. **Combines Output**: Merges both builds into a single deployment directory
4. **Deploys**: Pushes the combined output to the `gh-pages` branch

## Configuration Details

Each version uses a different `next.config.js` configuration:

### V1 Configuration (Root Path)
```javascript
basePath: '/vaf-bg-ai-lab'
assetPrefix: '/vaf-bg-ai-lab/'
```

### V2 Configuration (/v2 Path)
```javascript
basePath: '/vaf-bg-ai-lab/v2'
assetPrefix: '/vaf-bg-ai-lab/v2/'
```

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

1. **404 Errors**: Ensure the `basePath` and `assetPrefix` are correctly configured
2. **Build Failures**: Check that both `release/v1` and `release/v2` branches have valid Next.js configurations
3. **Deployment Issues**: Verify that the repository has proper permissions for GitHub Actions

## Notes

- The deployment creates a beautiful version selector page at `/version-info.html`
- Both versions are completely independent and can be updated separately
- The GitHub Actions workflow requires no manual intervention once set up
