const fs = require('fs');

const filesToUpdate = ['src/app/form/[id]/page.tsx', 'src/app/preview/page.tsx'];

for (const file of filesToUpdate) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Add storeInfo state and isStoreInfoOpen state
    if (!content.includes('const [storeInfo, setStoreInfo] = useState<any>(null);')) {
        content = content.replace(
            'const [copiedAccount, setCopiedAccount] = useState<string | null>(null);',
            'const [copiedAccount, setCopiedAccount] = useState<string | null>(null);\n  const [storeInfo, setStoreInfo] = useState<any>(null);\n  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);'
        );
    }
    
    // Add lucide icons: Store, MapPin, Phone, Clock, CalendarX, ChevronDown, ChevronUp
    if (!content.includes('Store,')) {
        content = content.replace(
            "import { CreditCard, Copy, CheckCircle2 } from 'lucide-react';",
            "import { CreditCard, Copy, CheckCircle2, Store, MapPin, Phone, Clock, CalendarX, ChevronDown, ChevronUp } from 'lucide-react';"
        );
    }

    // 2. Load storeInfo in loadAccounts / useEffect
    const loadAccountsRegex = /async function loadAccounts\(\) \{/;
    if (content.match(loadAccountsRegex) && !content.includes("localStorage.getItem('ssakdaform_store_details')")) {
        content = content.replace(
            loadAccountsRegex,
            `async function loadAccounts() {\n      const savedStoreInfo = localStorage.getItem('ssakdaform_store_details');\n      if (savedStoreInfo) { setStoreInfo(JSON.parse(savedStoreInfo)); }`
        );
    }

    // 3. Add the Store Info button and section right under the header
    const targetDivStr = `<div className="px-3 sm:px-6 py-4 sm:py-7">`;
    const newStoreInfoBlock = `<div className="px-3 sm:px-6 py-4 sm:py-7">
          {storeInfo && (
            <div className="mb-6">
              <button 
                onClick={() => setIsStoreInfoOpen(!isStoreInfoOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors mx-auto bg-gray-100/80 hover:bg-gray-200/80 px-3 py-1.5 rounded-full"
              >
                <Store className="w-3.5 h-3.5" />
                가게 정보 보기
                {isStoreInfoOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              {isStoreInfoOpen && (
                <div className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
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
    
    if (content.includes(targetDivStr)) {
        content = content.replace(targetDivStr, newStoreInfoBlock);
    }
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file} with store info section.`);
}
