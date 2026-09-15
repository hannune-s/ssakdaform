const fs = require('fs');
const file = 'src/app/signup/page.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Update Title & Subtitle
const titleIdx = lines.findIndex(l => l.includes('사장님, 환영합니다!'));
if (titleIdx !== -1) {
  lines[titleIdx] = lines[titleIdx].replace('사장님, 환영합니다!', '환영합니다!');
}

const subtitleIdx = lines.findIndex(l => l.includes('싹다폼으로 복잡한 주문/예약 관리를 싹 다 해결해보세요.'));
if (subtitleIdx !== -1) {
  lines[subtitleIdx] = lines[subtitleIdx].replace('싹다폼으로 복잡한 주문/예약 관리를 싹 다 해결해보세요.', '싹다폼으로 복잡한 접수와 주문 관리를 싹 다 해결해보세요.');
}

// Remove businessType from state
const stateIdx = lines.findIndex(l => l.includes("businessType: ''"));
if (stateIdx !== -1) {
  lines.splice(stateIdx, 1);
}

// Replace the grid block with the new storeName block
const startGridIdx = lines.findIndex(l => l.includes('<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">'));
const endGridIdx = lines.findIndex((l, i) => i > startGridIdx && l.includes('</div>') && lines[i+1].includes('<div>') && lines[i+2].includes('사업장 주소'));

if (startGridIdx !== -1) {
  // Let's find the exact end of the grid block safely.
  // The grid block ends right before the "사업장 주소" div.
  const addrIdx = lines.findIndex((l, i) => i > startGridIdx && l.includes('사업장 주소'));
  const actualEndIdx = addrIdx - 2; // the div wrapper ends before the new div

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
                
  lines.splice(startGridIdx, actualEndIdx - startGridIdx + 1, newBlock);
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Successfully updated signup page layout');
