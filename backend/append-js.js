const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      findFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.ts')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const files = findFiles(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  const importRegex = /(import|export)\s+(?:.*?from\s+)?["'](\.[^"']+)["']/g;
  
  content = content.replace(importRegex, (match, type, p1) => {
    // Only modify relative paths
    let targetPath = path.resolve(path.dirname(file), p1);
    
    // Check if it's a directory (i.e. we should append /index.js)
    try {
      const stat = fs.statSync(targetPath);
      if (stat.isDirectory()) {
        modified = true;
        return match.replace(p1, p1 + '/index.js');
      }
    } catch (e) {
      // It's not a directory, so it's a file. Does it already have .js?
      if (!p1.endsWith('.js') && !p1.endsWith('.ts')) {
        // Only append if a .ts file exists for it
        if (fs.existsSync(targetPath + '.ts')) {
           modified = true;
           return match.replace(p1, p1 + '.js');
        }
      }
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
