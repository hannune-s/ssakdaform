const fs = require('fs');

const path = 'src/app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Change default state
content = content.replace(/useState\('all'\);/, "useState('delivery');");

// 2. Remove '대시보드' button
const dashboardBtnRegex = /<button\s+onClick=\{\(\) => setActiveTab\('all'\)\}[\s\S]*?>\s*대시보드\s*<\/button>/;
content = content.replace(dashboardBtnRegex, '');

// 3. Extract the Store Link Card
const startMarker = "{activeTab === 'all' && (";
const endMarker = "        )}";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
    const block = content.substring(startIndex, endIndex);
    
    // Extract just the inner card part.
    // Starts with: <div className="bg-white rounded-2xl ...
    // Ends with: </div>\n          </div>\n        )}
    const cardStart = block.indexOf('<div className="bg-white rounded-2xl');
    const cardEnd = block.lastIndexOf('</div>', block.lastIndexOf('</div>') - 1) + 6; // Two divs from the end inside the block
    
    const cardContent = block.substring(cardStart, cardEnd);
    
    // Remove the old all block entirely
    content = content.substring(0, startIndex) + content.substring(endIndex);

    // 4. Insert the card right after the Logo block and before the Search block
    const logoEndRegex = /(<p className="text-gray-500 font-medium">복잡한 접수와 주문, 싹다폼으로 싹 다\.<\/p>\s*<\/div>)/;
    
    const newCardBlock = `
      {/* 매장 통합 링크 (고객 전송용) - 최상단 고정 */}
      <div className="w-full max-w-4xl mx-auto mb-6">
        ${cardContent}
      </div>
`;
    
    content = content.replace(logoEndRegex, `$1\n\n${newCardBlock}`);
    
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully moved the link card and removed the dashboard tab.");
} else {
    console.log("Could not find the target block using indexOf.");
}
