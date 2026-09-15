const fs = require('fs');

const file = 'src/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// Add import
const importStr = "import SubscriptionPage from './subscription/page';";
if (!c.includes("import SubscriptionPage")) {
  c = c.replace(/import SettingsPage from '\.\/settings\/page';/, "import SettingsPage from './settings/page';\nimport SubscriptionPage from './subscription/page';");
}

// Add click handler to menu item
const oldMenu = `{
                title: '구독 및 결제 관리',
                desc: '이용권 상태, 카드 변경, 결제 내역',
                color: 'bg-purple-900'
              }`;
const newMenu = `{
                title: '구독 및 결제 관리',
                desc: '이용권 상태, 카드 변경, 결제 내역',
                color: 'bg-purple-900',
                onClick: () => setActiveTab('subscription')
              }`;
c = c.replace(oldMenu, newMenu);

// Add the rendering block
const oldAccountBlock = `{/* 계정 정보 페이지 */}
      {activeTab === 'account' && (`;
const newSubscriptionBlock = `{/* 구독 및 결제 관리 페이지 */}
      {activeTab === 'subscription' && (
        <div className="pt-12 sm:pt-16 pb-10 w-full">
          <div className="px-4 flex items-center gap-2 mb-4">
            <button onClick={() => setActiveTab('my')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">구독 및 결제 관리</h2>
          </div>
          <SubscriptionPage />
        </div>
      )}

      {/* 계정 정보 페이지 */}
      {activeTab === 'account' && (`;

if (c.includes(oldAccountBlock)) {
  c = c.replace(oldAccountBlock, newSubscriptionBlock);
}

fs.writeFileSync(file, c);
console.log('Successfully updated page.tsx');
