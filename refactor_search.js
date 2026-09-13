const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Fix Store Link Subtitle Size
// <p className="text-indigo-900/70 text-[13px] sm:text-sm font-medium leading-snug">
content = content.replace(
  /<p className="text-indigo-900\/70 text-\[13px\] sm:text-sm font-medium leading-snug">/,
  '<p className="text-indigo-900/70 text-[11px] sm:text-[13px] font-medium leading-snug tracking-tighter sm:tracking-normal whitespace-nowrap overflow-hidden text-ellipsis">'
);

// 2. Reduce Search Bar Size and Move it below the Menu Tabs
// Find the Search Bar block
const searchRegex = /\{\/\* 검색창 \*\/\}\s*<div className="relative mb-6">[\s\S]*?<\/div>\s*<\/div>/;
const searchMatch = content.match(searchRegex);

// Find the Menu Tabs block
const menuRegex = /\{\/\* 메뉴\(카테고리\) 탭 버튼 \*\/\}\s*<div className="flex flex-col items-center gap-2 sm:gap-3 w-full px-1">[\s\S]*?<\/div>\s*<\/div>/;
const menuMatch = content.match(menuRegex);

if (searchMatch && menuMatch) {
  // First, extract both blocks
  let searchHtml = searchMatch[0];
  const menuHtml = menuMatch[0];

  // Modify Search Bar Size
  // Input: py-3.5 -> py-2.5, add text-[13px]
  searchHtml = searchHtml.replace(/py-3\.5/, 'py-2.5 text-[13px]');
  // Button container right-2 -> right-1.5
  searchHtml = searchHtml.replace(/right-2/, 'right-1.5');
  // Button p-2 -> p-1.5
  searchHtml = searchHtml.replace(/className="p-2/, 'className="p-1.5');
  // Icon h-5 w-5 -> h-4 w-4
  searchHtml = searchHtml.replace(/<Search className="h-5 w-5" \/>/, '<Search className="h-4 w-4" />');
  
  // Swap them: Menu first, then Search (only if not builder tab)
  // Actually, I'll just change the layout inside the container
  // The container is:
  // <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8">
  //   {searchHtml}
  //   {menuHtml}
  // </div>
  // Wait, I need to be precise about replacing them.
  
  const containerRegex = /\{\/\* 탭과 검색 카드 영역 \*\/\}\s*<div className="w-full max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-8 shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] border border-gray-100 mb-8">\s*\{\/\* 검색창 \*\/\}.*<\/div>\s*<\/div>/s;
  // Let's just do standard string replacement
  
  // Actually, the original string has them consecutively. 
  // Let's replace the original search block with empty string, and then insert modified search block below the menu block.
  content = content.replace(searchMatch[0], '');
  
  // Since search block is removed, now we find the menu block and append the search block after it.
  // Wait, menuHtml has a closing </div> for the menu group, we append it after that.
  // Let's refine how we modify the search bar:
  
  let newSearchBlock = `
        {/* 검색창 (폼 빌더 탭에서는 숨김) */}
        {activeTab !== 'builder' && (
          <div className="relative mt-5 sm:mt-6">
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
  
  content = content.replace(menuHtml, menuHtml + newSearchBlock);
}

fs.writeFileSync('src/app/page.tsx', content);
