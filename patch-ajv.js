const fs = require('fs');
const path = require('path');

// Path to the problematic ajv-keywords file
const ajvKeywordsPath = path.join(__dirname, 'node_modules', 'ajv-keywords', 'dist', 'index.js');

if (fs.existsSync(ajvKeywordsPath)) {
  try {
    let content = fs.readFileSync(ajvKeywordsPath, 'utf8');
      // Replace the problematic line that causes the "Unknown keyword formatMinimum" error
    content = content.replace(
      'throw new Error("Unknown keyword " + keyword);',
      'console.warn("Unknown keyword " + keyword); return function() {};'
    );
    
    fs.writeFileSync(ajvKeywordsPath, content, 'utf8');
    console.log('Successfully patched ajv-keywords compatibility issue');
  } catch (error) {
    console.log('Failed to patch ajv-keywords:', error.message);
  }
} else {
  console.log('ajv-keywords file not found, skipping patch');
}
