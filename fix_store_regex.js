const fs = require('fs');
let page = fs.readFileSync('src/app/store/[slug]/page.tsx', 'utf8');

const regex = /if\s*\(data\s*&&\s*data\.length\s*>\s*0\)\s*\{\s*setAccounts\(data\.map\(d\s*=>\s*\(\{\s*bank:\s*d\.bank,\s*accountNumber:\s*d\.account_number,\s*holder:\s*d\.holder\s*\}\)\)\);\s*\}\s*\}/;

const newStr = `if (data && data.length > 0) {
        setAccounts(data.map(d => ({ bank: d.bank, accountNumber: d.account_number, holder: d.holder })));
      }
      
      const storedForms = localStorage.getItem('ssakdaform_custom_forms');
      if (storedForms) {
        setCustomForms(JSON.parse(storedForms));
      }
    }`;

if (regex.test(page)) {
  page = page.replace(regex, newStr);
  fs.writeFileSync('src/app/store/[slug]/page.tsx', page);
  console.log('Fixed using regex');
} else {
  console.log('Regex still failed');
}
