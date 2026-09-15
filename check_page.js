const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx', 'utf8').split('\n');
lines.forEach((l, i) => {
    if (l.includes("activeTab === 'reservation'")) {
        console.log(lines.slice(i, i + 5).join('\n'));
    }
});
