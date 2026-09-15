const fs = require('fs');
let c = fs.readFileSync('src/app/components/DashboardWidget.tsx', 'utf8');

// Update stats buttons
c = c.replace(
  /className="flex flex-col items-center justify-center p-2\.5 sm:p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors active:scale-95 relative border border-gray-100\/50"/g,
  'className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gray-50/80 hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all active:scale-95 relative"'
);

// Update stats label
c = c.replace(
  /className="text-gray-500 text-\[11px\] sm:text-\[12px\] font-semibold mb-0\.5">\{stat\.name\}<\/p>/g,
  'className="text-gray-500 text-[10px] sm:text-[11px] font-semibold mb-1">{stat.name}</p>'
);

// Update stats number
c = c.replace(
  /<span className="text-\[16px\] sm:text-\[18px\] font-black text-gray-900 tracking-tight">\{stat\.count\}<\/span>/g,
  '<span className="text-[22px] sm:text-[26px] font-black text-gray-900 tracking-tight">{stat.count}</span>'
);

// Update recent activities container
c = c.replace(
  /<div className="space-y-2\.5">/g,
  '<div className="divide-y divide-gray-100/80 flex flex-col">'
);

// Update recent activities items
// Old: className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100/50 hover:bg-gray-50 transition-colors cursor-pointer active:scale-[0.99]"
// We also need to add a chevron to the end of the item.
const oldItemRegex = /<div key=\{i\} onClick=\{\(\) => setActiveTab\(activity\.tab\)\} className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50\/50 border border-gray-100\/50 hover:bg-gray-50 transition-colors cursor-pointer active:scale-\[0\.99\]">\s*<div className=\{`w-1\.5 h-1\.5 rounded-full mt-1\.5 shrink-0 \$\{activity\.isNew \? 'bg-indigo-500' : 'bg-gray-300'\}`\} \/>\s*<div className="flex-1 min-w-0">\s*<div className="flex justify-between items-start mb-0\.5">\s*<p className=\{`text-\[12\.5px\] sm:text-\[13px\] font-bold truncate pr-2 \$\{activity\.isNew \? 'text-gray-900' : 'text-gray-600'\}`\}>\{activity\.title\}<\/p>\s*<span className="text-\[10px\] sm:text-\[11px\] font-medium text-gray-400 whitespace-nowrap shrink-0 mt-0\.5">\{activity\.time\}<\/span>\s*<\/div>\s*<p className="text-\[11\.5px\] sm:text-\[12px\] text-gray-500 truncate">\{activity\.desc\}<\/p>\s*<\/div>\s*<\/div>/g;

const newItem = `<div key={i} onClick={() => setActiveTab(activity.tab)} className="flex items-center gap-3 py-3.5 px-2 bg-white hover:bg-gray-50/40 transition-colors cursor-pointer active:scale-[0.99] group">
              <div className={\`w-1.5 h-1.5 rounded-full shrink-0 \${activity.isNew ? 'bg-indigo-500' : 'bg-gray-300'}\`} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <p className={\`text-[12.5px] sm:text-[13px] font-bold truncate pr-2 \${activity.isNew ? 'text-gray-900' : 'text-gray-600'}\`}>{activity.title}</p>
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-400 whitespace-nowrap shrink-0">{activity.time}</span>
                </div>
                <p className="text-[11.5px] sm:text-[12px] text-gray-500 truncate">{activity.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0" />
            </div>`;

if (c.match(oldItemRegex)) {
  c = c.replace(oldItemRegex, newItem);
} else {
  console.log("Could not find old item regex");
}

fs.writeFileSync('src/app/components/DashboardWidget.tsx', c);
console.log("DashboardWidget updated");
