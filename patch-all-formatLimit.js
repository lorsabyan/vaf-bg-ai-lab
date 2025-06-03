const fs = require('fs');
const path = require('path');

function findFiles(dir, filename, results = []) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findFiles(filePath, filename, results);
      } else if (file === filename) {
        results.push(filePath);
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
  return results;
}

// Find all _formatLimit.js files
const formatLimitFiles = findFiles(path.join(__dirname, 'node_modules'), '_formatLimit.js');

console.log(`Found ${formatLimitFiles.length} _formatLimit.js files to patch:`);

formatLimitFiles.forEach(filePath => {
  console.log(`- ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add safety check for formats object
    const originalCheck = 'function extendFormats(ajv) {\n  var formats = ajv._formats;\n  for (var name in COMPARE_FORMATS) {';
    const replacementCheck = 'function extendFormats(ajv) {\n  var formats = ajv._formats;\n  if (!formats) return; // Safety check for undefined formats\n  for (var name in COMPARE_FORMATS) {';
    
    if (content.includes(originalCheck) && !content.includes('if (!formats) return;')) {
      content = content.replace(originalCheck, replacementCheck);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✓ Successfully patched ${filePath}`);
    } else {
      console.log(`  - No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.log(`  ✗ Failed to patch ${filePath}:`, error.message);
  }
});

console.log('\nPatch operation completed!');
