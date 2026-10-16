const fs = require('fs');

const files = [
  'src/app/delivery-list/page.tsx',
  'src/app/reservation-list/page.tsx',
  'src/app/order-list/page.tsx',
  'src/app/custom-list/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Fix the syntax error in the status cell
  content = content.replace(/\{res\.status !== '취소됨' && \(\s*<\/td>/g, '</td>');
  
  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
});
