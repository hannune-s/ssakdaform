const fs = require('fs');

const file = 'src/app/settings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* 비대면 링크 결제 설정 \*\/\}[\s\S]*?placeholder="https:\/\/toss\.me\/[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

if (regex.test(c)) {
    c = c.replace(regex, '');
    fs.writeFileSync(file, c);
    console.log('Successfully removed payment link setting');
} else {
    console.log('Could not find target block via regex');
}
