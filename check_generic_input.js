const fs = require('fs');
const lines = fs.readFileSync('src/app/form/[id]/page.tsx', 'utf8').split('\n');

const startIndex = lines.findIndex(l => l.includes(') : field.type === \'time\' ? ('));
if (startIndex !== -1) {
  // We want the block AFTER the time picker (which is usually the generic input)
  console.log(lines.slice(startIndex, startIndex + 50).join('\n'));
} else {
  console.log('Not found');
}
