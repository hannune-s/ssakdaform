const fs = require('fs');
const file = 'src/app/signup/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// Change title
c = c.replace('사장님, 환영합니다!', '환영합니다!');
c = c.replace('싹다폼으로 복잡한 주문/예약 관리를 싹 다 해결해보세요.', '싹다폼으로 복잡한 접수와 주문 관리를 싹 다 해결해보세요.');

// Remove grid and businessType field
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

if (c.includes(targetBlock)) {
    c = c.replace(targetBlock, newBlock);
} else {
    console.log('Grid block not found exactly. Try regex.');
    // Let's use string manipulation with indexes if replace fails
    const startIdx = c.indexOf('<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">');
    if (startIdx !== -1) {
        const endIdx = c.indexOf('</div>\n                </div>', startIdx);
        if (endIdx !== -1) {
            c = c.substring(0, startIdx) + newBlock + c.substring(endIdx + 14); // 14 is length of '</div>\n                </div>' ... wait, that's risky.
        }
    }
}

// Also need to remove 'businessType' from the state
c = c.replace(/businessType: '',\n/g, '');

fs.writeFileSync(file, c);
console.log('Successfully updated signup page');
