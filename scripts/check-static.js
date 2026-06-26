const fs = require('fs');

const requiredFiles = ['index.html', 'styles.css', 'app.js', 'README.md'];
const missing = requiredFiles.filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error(`Missing files: ${missing.join(', ')}`);
  process.exit(1);
}

const html = fs.readFileSync('index.html', 'utf8');
for (const asset of ['styles.css', 'app.js']) {
  if (!html.includes(asset)) {
    console.error(`index.html does not reference ${asset}`);
    process.exit(1);
  }
}

const app = fs.readFileSync('app.js', 'utf8');
for (const token of ['indexedDB', 'navigator.share', 'fileToDataUrl', 'exportSharePackage']) {
  if (!app.includes(token)) {
    console.error(`app.js missing expected feature token: ${token}`);
    process.exit(1);
  }
}

console.log('Static app structure looks good.');
