const fs = require('fs');
const files = [
  'src/app/delivery-list/page.tsx',
  'src/app/reservation-list/page.tsx',
  'src/app/order-list/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix syntax error
  content = content.replace(
    /useEffect\(\(\) => \{\s*const loadData/s,
    `useEffect(() => {
    loadData();
  }, []);

  const loadData`
  );

  fs.writeFileSync(file, content);
}
