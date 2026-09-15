const https = require('https');
const fs = require('fs');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      // Follow redirect if 301/302
      if (response.statusCode === 301 || response.statusCode === 302) {
          download(response.headers.location, dest).then(resolve).catch(reject);
          return;
      }
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
  console.log('Downloading valid 192x192 PNG from dummyimage.com...');
  await download('https://dummyimage.com/192x192/4f46e5/ffffff.png&text=Ssakdaform', path.join('public', 'icon-192.png'));
  
  console.log('Downloading valid 512x512 PNG from dummyimage.com...');
  await download('https://dummyimage.com/512x512/4f46e5/ffffff.png&text=Ssakdaform', path.join('public', 'icon-512.png'));

  console.log('Icons downloaded successfully.');
}

fixIcons().catch(console.error);
