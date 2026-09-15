const fs = require('fs');
let c = fs.readFileSync('src/app/demo/page.tsx', 'utf8');
c = c.replace(/from '\.\//g, "from '../");
fs.writeFileSync('src/app/demo/page.tsx', c);
console.log("Fixed imports");
