const fs = require('fs');

const file = 'src/app/settings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetBlock = `          {/* 비대면 링크 결제 설정 */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">비대면 링크 결제 설정</h2>
            <p className="text-sm text-gray-500 mb-4">고객이 결제할 수 있는 비대면 카드 결제 링크(토스, 페이앱 등)를 입력하세요.</p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">결제 링크 URL</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="url" 
                  value={storeInfo.paymentLink || ''}
                  onChange={(e) => handleStoreChange('paymentLink', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  placeholder="https://toss.me/..."
                />
              </div>
            </div>
          </div>`;

if (c.includes(targetBlock)) {
    c = c.replace(targetBlock, '');
    fs.writeFileSync(file, c);
    console.log('Successfully removed payment link setting');
} else {
    console.log('Could not find target block');
}
