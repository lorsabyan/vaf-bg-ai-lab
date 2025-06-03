const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix ajv dependency issue by forcing a single version
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'ajv': path.resolve(__dirname, 'node_modules/ajv'),
      };
      
      // Add fallback for missing modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "util": false,
        "crypto": false,
        "stream": false,
        "assert": false,
        "http": false,
        "https": false,
        "os": false,
        "url": false
      };

      return webpackConfig;
    },
  },
};
