const fs = require('fs');

let settings = fs.readFileSync('src/app/settings/page.tsx', 'utf8');

const ownerNameField = `
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">대표자명</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={storeInfo.ownerName || ''}
                  onChange={(e) => handleStoreChange('ownerName', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                  placeholder="예) 홍길동"
                />
              </div>
            </div>`;

// Let's use a regular expression to match the end of the input field div safely
const regex = /(placeholder="예\)\s*싹다상점"[\s\S]*?<\/div>\s*<\/div>)/;

if (regex.test(settings)) {
  settings = settings.replace(regex, '$1\n' + ownerNameField);
  fs.writeFileSync('src/app/settings/page.tsx', settings);
  console.log('Fixed ownerName field insertion successfully');
} else {
  console.log('Regex did not match!');
}
