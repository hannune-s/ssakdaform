const fs = require('fs');
const text = fs.readFileSync('src/app/form/[id]/page.tsx', 'utf8');
const lines = text.split('\n');
const startIndex = lines.findIndex(l => l.includes('return (') && lines.indexOf(l) > lines.length / 2);
if (startIndex !== -1) {
    console.log(lines.slice(startIndex, startIndex + 60).join('\n'));
} else {
    // Just find the last return (
    const lastReturnIndex = text.lastIndexOf('return (');
    console.log(text.substring(lastReturnIndex, lastReturnIndex + 2000));
}
