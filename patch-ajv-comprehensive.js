const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all ajv-keywords directories
const ajvKeywordsPaths = glob.sync('**/ajv-keywords/dist/index.js', {
  cwd: path.join(__dirname, 'node_modules'),
  absolute: true
});

console.log(`Found ${ajvKeywordsPaths.length} ajv-keywords instances to patch:`);

ajvKeywordsPaths.forEach(ajvKeywordsPath => {
  console.log(`- ${ajvKeywordsPath}`);
  
  if (fs.existsSync(ajvKeywordsPath)) {
    try {
      let content = fs.readFileSync(ajvKeywordsPath, 'utf8');
      
      // Replace the problematic line that causes the "Unknown keyword" error
      const originalLine = 'throw new Error("Unknown keyword " + keyword);';
      const replacementLine = 'console.warn("Unknown keyword " + keyword); return function() {};';
      
      if (content.includes(originalLine)) {
        content = content.replace(originalLine, replacementLine);
        fs.writeFileSync(ajvKeywordsPath, content, 'utf8');
        console.log(`  ✓ Successfully patched ${ajvKeywordsPath}`);
      } else {
        console.log(`  - No changes needed for ${ajvKeywordsPath}`);
      }
    } catch (error) {
      console.log(`  ✗ Failed to patch ${ajvKeywordsPath}:`, error.message);
    }
  } else {
    console.log(`  ✗ File not found: ${ajvKeywordsPath}`);
  }
});

// Also patch the format limit issue
const formatLimitPaths = glob.sync('**/ajv-keywords/**/_formatLimit.js', {
  cwd: path.join(__dirname, 'node_modules'),
  absolute: true
});

console.log(`\nFound ${formatLimitPaths.length} _formatLimit.js files to patch:`);

formatLimitPaths.forEach(formatLimitPath => {
  console.log(`- ${formatLimitPath}`);
  
  if (fs.existsSync(formatLimitPath)) {
    try {
      let content = fs.readFileSync(formatLimitPath, 'utf8');
      
      // Add safety check for formats object
      const originalCheck = 'var format = formats[name];';
      const replacementCheck = 'var format = formats && formats[name];';
      
      if (content.includes(originalCheck) && !content.includes(replacementCheck)) {
        content = content.replace(originalCheck, replacementCheck);
        fs.writeFileSync(formatLimitPath, content, 'utf8');
        console.log(`  ✓ Successfully patched ${formatLimitPath}`);
      } else {
        console.log(`  - No changes needed for ${formatLimitPath}`);
      }
    } catch (error) {
      console.log(`  ✗ Failed to patch ${formatLimitPath}:`, error.message);
    }
  } else {
    console.log(`  ✗ File not found: ${formatLimitPath}`);
  }
});

console.log('\nPatch operation completed!');
