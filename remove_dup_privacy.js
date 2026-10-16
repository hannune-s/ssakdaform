const fs = require('fs');
let form = fs.readFileSync('src/app/form/[id]/page.tsx', 'utf8');

// Use regex to remove the hardcoded privacy checkbox fields from the preset arrays
// It usually looks like: , { id: 9, type: 'checkbox', label: '[필수] 개인정보 수집 동의', placeholder: '개인정보 수집 및 이용에 동의합니다.', required: true }
// Or might be the first item (unlikely). Let's remove the whole object string.
form = form.replace(/,\s*{\s*id:\s*\d+,\s*type:\s*'checkbox',\s*label:\s*'\[필수\] 개인정보 수집 동의'[^}]+}/g, '');

fs.writeFileSync('src/app/form/[id]/page.tsx', form);
console.log('Removed duplicate privacy checkboxes from presets');
