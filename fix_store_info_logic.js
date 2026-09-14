const fs = require('fs');

const files = [
  'src/app/store/[slug]/page.tsx',
  'src/app/form/[id]/page.tsx',
  'src/app/preview/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Change {storeInfo && ( to {hasStoreInfo && (
  // We need to define hasStoreInfo right before the return statement.
  
  if (!content.includes('const hasStoreInfo')) {
    const returnRegex = /return \(/;
    content = content.replace(
      returnRegex,
      `const hasStoreInfo = storeInfo && (storeInfo.name || storeInfo.address || storeInfo.phone || storeInfo.hours || storeInfo.closedDays);\n  return (`
    );
  }

  // Replace the rendering condition
  content = content.replace(
    /\{storeInfo && \(/g,
    '{hasStoreInfo && ('
  );

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
}
