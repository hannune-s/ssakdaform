const fs = require('fs');
const file = 'src/app/signup/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Update Title & Subtitle
c = c.replace('사장님, 환영합니다!', '환영합니다!');
c = c.replace('싹다폼으로 복잡한 주문/예약 관리를 싹 다 해결해보세요.', '싹다폼으로 복잡한 접수와 주문 관리를 싹 다 해결해보세요.');

// 2. Remove businessType from state
c = c.replace(/businessType: '',\n/g, '');

// 3. Replace the EXACT storeName & businessType grid block
const targetBlock = `<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">상호명 <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Store className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="storeName"
                        type="text"
                        required
                        value={formData.storeName}
                        onChange={handleChange}
                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
                        placeholder="매장 이름"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">업종 <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="businessType"
                        required
                        value={formData.businessType}
                        onChange={handleChange}
                        className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all bg-white"
                      >
                        <option value="" disabled>업종을 선택해주세요</option>
                        <option value="농수산물/식품">농수산물 / 식품</option>
                        <option value="도소매/유통">도소매 / 유통</option>
                        <option value="요식업/카페">요식업 / 카페</option>
                        <option value="뷰티/미용">뷰티 / 미용</option>
                        <option value="서비스/기타">기타 서비스업</option>
                      </select>
                    </div>
                  </div>
                </div>`;

const newBlock = `                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">상호명 (소속/단체명) <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Store className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="storeName"
                      type="text"
                      required
                      value={formData.storeName}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm font-medium transition-all"
                      placeholder="매장 이름 또는 소속 단체명"
                    />
                  </div>
                </div>`;

// If exact replacement fails due to \r\n, we use regex
if (c.includes(targetBlock)) {
    c = c.replace(targetBlock, newBlock);
} else {
    // Normalize newlines and spaces for the search
    const normalizedC = c.replace(/\\r\\n/g, '\\n');
    const normalizedTarget = targetBlock.replace(/\\r\\n/g, '\\n');
    if (normalizedC.includes(normalizedTarget)) {
        c = normalizedC.replace(normalizedTarget, newBlock);
    } else {
        // Fallback: manually find "상호명" and "업종" lines
        const lines = c.split('\\n');
        const storeIdx = lines.findIndex(l => l.includes('상호명') && l.includes('<label'));
        if (storeIdx !== -1) {
            // Find enclosing grid
            let startIdx = storeIdx;
            while (startIdx > 0 && !lines[startIdx].includes('<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">')) {
                startIdx--;
            }
            let endIdx = storeIdx;
            while (endIdx < lines.length && !lines[endIdx].includes('</select>')) {
                endIdx++;
            }
            // Go down to the closing divs
            endIdx += 3;
            
            lines.splice(startIdx, endIdx - startIdx + 1, newBlock);
            c = lines.join('\\n');
        }
    }
}

fs.writeFileSync(file, c);
console.log('Successfully updated signup page without deleting other fields');
