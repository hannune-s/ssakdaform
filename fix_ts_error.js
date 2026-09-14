const fs = require('fs');

const file = 'src/app/settings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "const [storeInfo, setStoreInfo] = useState({ name: '', address: '', phone: '', hours: '', closedDays: '' });",
  "const [storeInfo, setStoreInfo] = useState<any>({ name: '', address: '', phone: '', hours: '', closedDays: '', paymentLink: '' });"
);

fs.writeFileSync(file, c);
console.log('Fixed typescript error in SettingsPage');
