const fs = require('fs');

const files = [
  'src/app/store/[slug]/page.tsx',
  'src/app/form/[id]/page.tsx',
  'src/app/preview/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Remove the badly placed const hasStoreInfo...
  content = content.replace(
    /const hasStoreInfo = storeInfo && \(storeInfo\.name \|\| storeInfo\.address \|\| storeInfo\.phone \|\| storeInfo\.hours \|\| storeInfo\.closedDays\);\n  return \(/g,
    'return ('
  );

  // Replace {hasStoreInfo && ( with the full condition
  content = content.replace(
    /\{hasStoreInfo && \(/g,
    '{storeInfo && (storeInfo.name || storeInfo.address || storeInfo.phone || storeInfo.hours || storeInfo.closedDays) && ('
  );

  fs.writeFileSync(file, content);
  console.log(`Fixed scope issue in ${file}`);
}
