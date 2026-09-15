const https = require('https');
const fs = require('fs');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
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
  console.log('Downloading valid 192x192 PNG from placehold.co (Korean)...');
  // placehold.co supports UTF-8
  await download('https://placehold.co/192x192/4f46e5/ffffff/png?text=' + encodeURIComponent('싹다폼'), path.join('public', 'icon-192.png'));
  
  console.log('Downloading valid 512x512 PNG from placehold.co (Korean)...');
  await download('https://placehold.co/512x512/4f46e5/ffffff/png?text=' + encodeURIComponent('싹다폼'), path.join('public', 'icon-512.png'));

  console.log('Korean Icons downloaded successfully.');
}

fixIcons().catch(console.error);
