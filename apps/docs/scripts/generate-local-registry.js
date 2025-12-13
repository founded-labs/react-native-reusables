// scripts/generate-local-registry.js
const fs = require('fs');
const path = require('path');

const registryDir = path.resolve('./registry');
const files = ['new-york.json', 'uniwind.json', 'nativewind.json'];
const targetDomain = 'https://reactnativereusables.com';
const localDomain = 'http://localhost:3000';

files.forEach((file) => {
  const srcPath = path.join(registryDir, file);
  const destPath = path.join(registryDir, file.replace('.json', '.local.json'));

  if (!fs.existsSync(srcPath)) {
    console.error(`Source file not found: ${srcPath}`);
    return;
  }

  try {
    const content = fs.readFileSync(srcPath, 'utf-8');
    const replaced = content.replace(new RegExp(targetDomain, 'g'), localDomain);

    fs.writeFileSync(destPath, replaced, 'utf-8');
    console.log(`Created/updated: ${destPath}`);
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
});
