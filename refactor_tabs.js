const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const regex = /<div className="flex flex-wrap justify-center gap-1\.5 sm:gap-2">[\s\S]*?<\/div>/;

const newTabs = `<div className="flex flex-col items-center gap-2 sm:gap-3 w-full px-1">
          {/* 1번 줄: 맞춤형 폼 만들기 */}
          <button
            onClick={() => setActiveTab('builder')}
            className={\`px-6 py-2 rounded-full text-[13px] sm:text-sm font-bold transition-all whitespace-nowrap tracking-tight \${
              activeTab === 'builder' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }\`}
          >
            맞춤형 폼 만들기
          </button>
          
          {/* 2번 줄: 현황 3종 */}
          <div className="flex flex-row justify-center gap-1.5 sm:gap-2 w-full">
            <button
              onClick={() => setActiveTab('delivery')}
              className={\`flex-1 max-w-[130px] px-1 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11.5px] sm:text-sm font-bold transition-all whitespace-nowrap tracking-tighter sm:tracking-tight \${
                activeTab === 'delivery' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }\`}
            >
              택배 신청 현황
            </button>
            <button
              onClick={() => setActiveTab('reservation')}
              className={\`flex-1 max-w-[130px] px-1 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11.5px] sm:text-sm font-bold transition-all whitespace-nowrap tracking-tighter sm:tracking-tight \${
                activeTab === 'reservation' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }\`}
            >
              매장 예약 현황
            </button>
            <button
              onClick={() => setActiveTab('order')}
              className={\`flex-1 max-w-[130px] px-1 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11.5px] sm:text-sm font-bold transition-all whitespace-nowrap tracking-tighter sm:tracking-tight \${
                activeTab === 'order' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }\`}
            >
              상품 주문 현황
            </button>
          </div>
        </div>`;

content = content.replace(regex, newTabs);
fs.writeFileSync('src/app/page.tsx', content);
