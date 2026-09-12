const fs = require('fs');

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');
  
  // The goal is to clean up this exact messed up structure:
  // .map(([key, value]: any) => { return {
  //   {(() => {
  //     const isHighlight = ...
  //     return ( ... );
  //   })()} }
  // }))
  // Or whatever it is right now. Let's just find `map(([key, value]: any)` to the closing of map, and rewrite the function body.
  
  // Let's use a simple regex to replace the wrapper:
  content = content.replace(/=> \{ return \{\s*\{\(\(\) => \{\s*(const isHighlight[\s\S]*?return \([\s\S]*?\);)\s*\}\)\(\)\} \}\s*\)\)/g, '=> {\n $1 \n})');
  // Also we might have some variations:
  content = content.replace(/=> \(\s*\{\(\(\) => \{\s*(const isHighlight[\s\S]*?return \([\s\S]*?\);)\s*\}\)\(\)\}\s*\)\)/g, '=> {\n $1 \n})');

  fs.writeFileSync(path, content, 'utf8');
}

processFile('src/app/delivery-list/page.tsx');
processFile('src/app/reservation-list/page.tsx');
processFile('src/app/order-list/page.tsx');
