const fs = require('fs');

let page = fs.readFileSync('src/app/form/[id]/page.tsx', 'utf8');

// 1. Add User icon import
page = page.replace(
  "Store, MapPin, Phone, Clock, CalendarX, ChevronDown, ChevronUp } from 'lucide-react'",
  "Store, MapPin, Phone, Clock, CalendarX, ChevronDown, ChevronUp, User } from 'lucide-react'"
);

// 2. Add ownerName to storeInfo condition
page = page.replace(
  'storeInfo.name || storeInfo.address', 
  'storeInfo.name || storeInfo.ownerName || storeInfo.address'
);

// 3. Add representative display inside isStoreInfoOpen block
const storeOwnerDisplay = `
                  {storeInfo.ownerName && (
                    <div className="flex gap-2">
                      <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <div><span className="font-semibold text-gray-900 mr-2">대표자:</span>{storeInfo.ownerName}</div>
                    </div>
                  )}`;

page = page.replace(
  '<div><span className="font-semibold text-gray-900 mr-2">상호명:</span>{storeInfo.name}</div>\n                  </div>\n                )}',
  '<div><span className="font-semibold text-gray-900 mr-2">상호명:</span>{storeInfo.name}</div>\n                  </div>\n                )}\n' + storeOwnerDisplay
);

// 4. Update the account box padding & spacing
page = page.replace(
  'className="mb-8 bg-[#F0F4FF] border border-indigo-200 rounded-2xl p-5"',
  'className="mb-6 bg-[#F0F4FF] border border-indigo-200 rounded-2xl px-4 py-3.5"'
);

page = page.replace(
  'className="flex items-center gap-2 mb-3.5"',
  'className="flex items-center gap-2 mb-2"'
);

page = page.replace(
  '<div className="space-y-3">',
  '<div className="space-y-1.5">'
);

page = page.replace(
  'className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shrink-0 shadow-sm border border-indigo-50"',
  'className="flex items-center justify-center gap-1.5 px-2.5 py-1 bg-white rounded-lg text-[12px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shrink-0 shadow-sm border border-indigo-50"'
);

fs.writeFileSync('src/app/form/[id]/page.tsx', page);
console.log('Updated form/[id]/page.tsx successfully');
