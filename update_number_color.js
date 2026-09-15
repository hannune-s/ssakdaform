const fs = require('fs');

let c = fs.readFileSync('src/app/components/DashboardWidget.tsx', 'utf8');

c = c.replace(
  '<span className="text-[22px] sm:text-[26px] font-black text-gray-900 tracking-tight">{stat.count}</span>',
  '<span className={`text-[22px] sm:text-[26px] font-black tracking-tight ${stat.color}`}>{stat.count}</span>'
);

fs.writeFileSync('src/app/components/DashboardWidget.tsx', c);
console.log('Updated number colors in DashboardWidget');
