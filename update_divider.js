const fs = require('fs');
const file = 'src/app/components/DashboardWidget.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace('className="divide-y divide-gray-100/80 flex flex-col"', 'className="divide-y divide-gray-200 flex flex-col"');

fs.writeFileSync(file, c);
console.log('Successfully updated notification dividers');
