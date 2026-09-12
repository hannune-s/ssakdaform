const fs = require('fs');

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');
  
  // Replace `{ return {(() => {` with `{`
  content = content.replace(/\{\s*return\s*\{\(\(\)\s*=>\s*\{/g, '{');
  // Replace `})() }}` with `}}`
  content = content.replace(/\}\)\(\)\s*\}\}/g, '}}');
  
  // The first map closure in `otherEntries.map(([key, value]: any) => { return {(() => {` now becomes:
  // `{otherEntries.map(([key, value]: any) => {
  //    const isHighlight = ...
  //    return (...)
  // }}`
  // Which correctly closes with `}}` in React JSX mapping: `map(x => { ... }) }`  Wait, no. 
  // It's `{entries.map(x => { return (...) })}`

  fs.writeFileSync(path, content, 'utf8');
}

processFile('src/app/delivery-list/page.tsx');
processFile('src/app/reservation-list/page.tsx');
processFile('src/app/order-list/page.tsx');
