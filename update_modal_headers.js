const fs = require('fs');

const files = [
  {
    path: 'src/app/delivery-list/page.tsx',
    icon: 'Package',
    title: '택배 접수 상세 정보'
  },
  {
    path: 'src/app/reservation-list/page.tsx',
    icon: 'Calendar',
    title: '예약 상세 정보'
  },
  {
    path: 'src/app/order-list/page.tsx',
    icon: 'ShoppingCart',
    title: '주문 상세 정보'
  }
];

for (const f of files) {
  let content = fs.readFileSync(f.path, 'utf8');

  // We are looking for the modal header div:
  // <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
  // ... up to </button>\n            </div>
  
  const regex = /<div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">[\s\S]*?<\/button>\s*<\/div>/;

  const newHeader = `<div className="px-6 py-5 flex items-center justify-between bg-gradient-to-r from-indigo-700 to-indigo-900 text-white shadow-md">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <${f.icon} className="w-5 h-5 text-indigo-200" />
                ${f.title}
              </h2>
              <button 
                onClick={() => setSelectedResponse(null)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>`;

  if (regex.test(content)) {
    content = content.replace(regex, newHeader);
    fs.writeFileSync(f.path, content);
    console.log('Updated ' + f.path);
  } else {
    console.log('Could not find header in ' + f.path);
  }
}
