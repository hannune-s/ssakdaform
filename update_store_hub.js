const fs = require('fs');
const file = 'src/app/store/[slug]/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Add missing icons
if (!c.includes('MapPin')) {
  c = c.replace(
    "import { Package, Calendar, FileText, ChevronRight, Store, ShoppingBag, CreditCard, Copy, CheckCircle2 } from 'lucide-react';",
    "import { Package, Calendar, FileText, ChevronRight, Store, ShoppingBag, CreditCard, Copy, CheckCircle2, MapPin, Phone, Clock, CalendarX, ChevronDown, ChevronUp } from 'lucide-react';"
  );
}

// 2. Add state
if (!c.includes('const [storeInfo, setStoreInfo] = useState<any>(null);')) {
  c = c.replace(
    'const [accounts, setAccounts] = useState<any[]>([]);',
    'const [accounts, setAccounts] = useState<any[]>([]);\n  const [storeInfo, setStoreInfo] = useState<any>(null);\n  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);'
  );
}

// 3. Load storeInfo in loadAccounts
const loadAccountsRegex = /async function loadAccounts\(\) \{/;
if (c.match(loadAccountsRegex) && !c.includes("localStorage.getItem('ssakdaform_store_details')")) {
  c = c.replace(
    loadAccountsRegex,
    `async function loadAccounts() {\n      const savedStoreInfo = localStorage.getItem('ssakdaform_store_details');\n      if (savedStoreInfo) { setStoreInfo(JSON.parse(savedStoreInfo)); }`
  );
}

// 4. Insert UI after <div className="w-full max-w-md mx-auto px-4 mt-6 relative z-20 flex-1 pb-16">
const targetStr = `<div className="w-full max-w-md mx-auto px-4 mt-6 relative z-20 flex-1 pb-16">`;
const newBlock = `<div className="w-full max-w-md mx-auto px-4 mt-6 relative z-20 flex-1 pb-16">
        
        {storeInfo && (
          <div className="mb-6">
            <button 
              onClick={() => setIsStoreInfoOpen(!isStoreInfoOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors mx-auto bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full"
            >
              <Store className="w-3.5 h-3.5" />
              가게 정보 보기
              {isStoreInfoOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            
            {isStoreInfoOpen && (
              <div className="mt-3 p-4 bg-white shadow-sm border border-gray-100 rounded-xl text-sm text-gray-700 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {storeInfo.name && (
                  <div className="flex gap-2">
                    <Store className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div><span className="font-semibold text-gray-900 mr-2">상호명:</span>{storeInfo.name}</div>
                  </div>
                )}
                {storeInfo.address && (
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div><span className="font-semibold text-gray-900 mr-2">주소:</span>{storeInfo.address}</div>
                  </div>
                )}
                {storeInfo.phone && (
                  <div className="flex gap-2">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div><span className="font-semibold text-gray-900 mr-2">전화번호:</span>{storeInfo.phone}</div>
                  </div>
                )}
                {storeInfo.hours && (
                  <div className="flex gap-2">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div><span className="font-semibold text-gray-900 mr-2">영업시간:</span>{storeInfo.hours}</div>
                  </div>
                )}
                {storeInfo.closedDays && (
                  <div className="flex gap-2">
                    <CalendarX className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div><span className="font-semibold text-gray-900 mr-2">휴무일:</span>{storeInfo.closedDays}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}`;

if (c.includes(targetStr)) {
  c = c.replace(targetStr, newBlock);
  fs.writeFileSync(file, c);
  console.log("Updated store hub page with store info toggle!");
} else {
  console.log("Could not find the target wrapper div.");
}
