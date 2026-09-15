const https = require('https');
const fs = require('fs');

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
  console.log('Downloading valid 192x192 PNG from ui-avatars (Korean)...');
  await download('https://ui-avatars.com/api/?name=' + encodeURIComponent('싹+다') + '&background=4f46e5&color=fff&size=192&font-size=0.4', 'public/icon-192.png');
  
  console.log('Downloading valid 512x512 PNG from ui-avatars (Korean)...');
  await download('https://ui-avatars.com/api/?name=' + encodeURIComponent('싹+다') + '&background=4f46e5&color=fff&size=512&font-size=0.4', 'public/icon-512.png');

  console.log('Korean Icons downloaded successfully.');
}

fixIcons().catch(console.error);
