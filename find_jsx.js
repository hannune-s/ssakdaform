const fs = require('fs');
const text = fs.readFileSync('src/app/form/[id]/page.tsx', 'utf8');
const match = text.match(/<div className="min-h-screen[\s\S]*?(<form)/);
if (match) {
    console.log(match[0].substring(0, 2000));
} else {
    console.log("No match found");
}
