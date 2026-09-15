const fs = require('fs');
const file = 'src/app/signup/page.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// 1. Update Title & Subtitle
const titleIdx = lines.findIndex(l => l.includes('사장님, 환영합니다!'));
if (titleIdx !== -1) {
  lines[titleIdx] = lines[titleIdx].replace('사장님, 환영합니다!', '환영합니다!');
}

const subtitleIdx = lines.findIndex(l => l.includes('싹다폼으로 복잡한 주문/예약 관리를 싹 다 해결해보세요.'));
if (subtitleIdx !== -1) {
  lines[subtitleIdx] = lines[subtitleIdx].replace('싹다폼으로 복잡한 주문/예약 관리를 싹 다 해결해보세요.', '싹다폼으로 복잡한 접수와 주문 관리를 싹 다 해결해보세요.');
}

// 2. Remove businessType from state
const stateIdx = lines.findIndex(l => l.includes("businessType: ''"));
if (stateIdx !== -1) {
  lines.splice(stateIdx, 1);
}

// 3. Find EXACT start and end of the storeName/businessType block
const storeLabelIdx = lines.findIndex(l => l.includes('label') && l.includes('상호명'));
if (storeLabelIdx !== -1) {
  let startIdx = storeLabelIdx;
  while (!lines[startIdx].includes('<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">')) {
    startIdx--;
  }
  
  let endIdx = storeLabelIdx;
  while (!lines[endIdx].includes('</select>')) {
    endIdx++;
  }
  endIdx += 3; // </select></div></div></div>
  
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
                
  lines.splice(startIdx, endIdx - startIdx + 1, newBlock);
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Successfully updated signup page robustly');
