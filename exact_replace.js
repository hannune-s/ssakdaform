const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Fix Store Link Subtitle Size
content = content.replace(
  /<p className="text-indigo-900\/70 text-\[13px\] sm:text-sm font-medium leading-snug">/,
  '<p className="text-indigo-900/70 text-[11px] sm:text-[13px] font-medium leading-snug tracking-tighter sm:tracking-normal whitespace-nowrap overflow-hidden text-ellipsis">'
);

// 2. We need to extract the search block and menu block.
// Let's use exact strings.
const searchBlock = `        {/* 검색창 */}
        <div className="relative mb-6">
          <input
            type="text"
            className="block w-full pl-5 pr-14 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium sm:text-base outline-none"
            placeholder="이름, 연락처, 주문상품 등을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>`;

const menuBlock = `        {/* 메뉴(카테고리) 탭 버튼 */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 w-full px-1">
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

const newSearchBlock = `        {/* 검색창 */}
        {activeTab !== 'builder' && (
          <div className="relative mt-5">
            <input
              type="text"
              className="block w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-[13px] sm:text-base outline-none"
              placeholder="이름, 연락처, 주문상품 등을 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-1.5 flex items-center">
              <button className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        )}`;

// Find and replace the original combined block.
const combinedOld = searchBlock + '\n\n' + menuBlock;
const combinedNew = menuBlock + '\n\n' + newSearchBlock;

if (content.includes(combinedOld)) {
  content = content.replace(combinedOld, combinedNew);
  console.log('Successfully swapped menu and search block');
} else {
  console.log('Failed to find combined block. Trying fuzzy logic.');
}

fs.writeFileSync('src/app/page.tsx', content);
