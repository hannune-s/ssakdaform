const fs = require('fs');
let page = fs.readFileSync('src/app/store/[slug]/page.tsx', 'utf8');

const oldStr = `if (data && data.length > 0) {
        setAccounts(data.map(d => ({ bank: d.bank, accountNumber: d.account_number, holder: d.holder })));
      }
    }`;

const newStr = `if (data && data.length > 0) {
        setAccounts(data.map(d => ({ bank: d.bank, accountNumber: d.account_number, holder: d.holder })));
      }
      
      const storedForms = localStorage.getItem('ssakdaform_custom_forms');
      if (storedForms) {
        setCustomForms(JSON.parse(storedForms));
      }
    }`;

if (page.includes(oldStr)) {
  page = page.replace(oldStr, newStr);
  fs.writeFileSync('src/app/store/[slug]/page.tsx', page);
  console.log('Fixed useEffect in store/[slug]');
} else {
  console.log('Could not find string to replace');
}
