const fs = require('fs');

let page = fs.readFileSync('src/app/demo/page.tsx', 'utf8');

// Replace the button JSX
page = page.replace(/<button[^>]*onClick=\{handleInstallApp\}[^>]*>[\s\S]*?홈 화면에 추가[\s\S]*?<\/button>/g, '');

fs.writeFileSync('src/app/demo/page.tsx', page);
console.log('Removed install button from demo page');
