const https = require('https');
const fs = require('fs');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function fixIcons() {
  console.log('Downloading valid 192x192 PNG...');
  await download('https://via.placeholder.com/192x192.png?text=192x192', path.join('public', 'icon-192.png'));
  
  console.log('Downloading valid 512x512 PNG...');
  await download('https://via.placeholder.com/512x512.png?text=512x512', path.join('public', 'icon-512.png'));

  console.log('Icons downloaded successfully.');
}

fixIcons().catch(console.error);
