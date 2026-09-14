const fs = require('fs');

const file = 'src/app/delivery-list/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  /className="text-\[12px\] text-gray-500 truncate max-w-\[200px\] mt-0\.5"/g,
  'className="text-[12.5px] font-semibold text-indigo-600 truncate max-w-[200px] mt-0.5"'
);

fs.writeFileSync(file, c);
console.log('Fixed address text color in delivery-list');
