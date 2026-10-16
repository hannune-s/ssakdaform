const fs = require('fs');

// 1. Update Settings Page
let settings = fs.readFileSync('src/app/settings/page.tsx', 'utf8');

settings = settings.replace(
  "const [storeInfo, setStoreInfo] = useState<any>({ name: '', address: '', phone: '', hours: '', closedDays: '', paymentLink: '' });",
  "const [storeInfo, setStoreInfo] = useState<any>({ name: '', ownerName: '', address: '', phone: '', hours: '', closedDays: '', paymentLink: '' });"
);

const ownerNameField = `
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">대표자명</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={storeInfo.ownerName || ''}
                  onChange={(e) => handleStoreChange('ownerName', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                  placeholder="예: 홍길동"
                />
              </div>
            </div>`;

settings = settings.replace(
  'placeholder="예: 싹다카페 강남점"\n                />\n              </div>\n            </div>',
  'placeholder="예: 싹다카페 강남점"\n                />\n              </div>\n            </div>' + ownerNameField
);

fs.writeFileSync('src/app/settings/page.tsx', settings);


// 2. Update Store Page
let store = fs.readFileSync('src/app/store/[slug]/page.tsx', 'utf8');
store = store.replace('Store, ShoppingBag, CreditCard, Copy, CheckCircle2, MapPin, Phone, Clock, CalendarX, ChevronDown, ChevronUp', 'Store, ShoppingBag, CreditCard, Copy, CheckCircle2, MapPin, Phone, Clock, CalendarX, ChevronDown, ChevronUp, User');
store = store.replace('closedDays: \'일요일\',', 'closedDays: \'일요일\',\n          ownerName: \'홍길동\',');

const storeOwnerDisplay = `
                {storeInfo.ownerName && (
                  <div className="flex gap-2">
                    <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div><span className="font-semibold text-gray-900 mr-2">대표자:</span>{storeInfo.ownerName}</div>
                  </div>
                )}`;

store = store.replace(
  '<div><span className="font-semibold text-gray-900 mr-2">상호명:</span>{storeInfo.name}</div>\n                  </div>\n                )}',
  '<div><span className="font-semibold text-gray-900 mr-2">상호명:</span>{storeInfo.name}</div>\n                  </div>\n                )}\n' + storeOwnerDisplay
);
store = store.replace('storeInfo.name || storeInfo.address', 'storeInfo.name || storeInfo.ownerName || storeInfo.address');
fs.writeFileSync('src/app/store/[slug]/page.tsx', store);


// 3. Update Preview Page
let preview = fs.readFileSync('src/app/preview/page.tsx', 'utf8');
preview = preview.replace('Store, MapPin, Phone, Clock, CalendarX, ChevronDown, ChevronUp } from \'lucide-react\';', 'Store, MapPin, Phone, Clock, CalendarX, ChevronDown, ChevronUp, User } from \'lucide-react\';');
preview = preview.replace('closedDays: \'일요일\',', 'closedDays: \'일요일\',\n          ownerName: \'홍길동\',');
preview = preview.replace(
  '<div><span className="font-semibold text-gray-900 mr-2">상호명:</span>{storeInfo.name}</div>\n                  </div>\n                )}',
  '<div><span className="font-semibold text-gray-900 mr-2">상호명:</span>{storeInfo.name}</div>\n                  </div>\n                )}\n' + storeOwnerDisplay
);
preview = preview.replace('storeInfo.name || storeInfo.address', 'storeInfo.name || storeInfo.ownerName || storeInfo.address');
fs.writeFileSync('src/app/preview/page.tsx', preview);

console.log('Added ownerName field');
