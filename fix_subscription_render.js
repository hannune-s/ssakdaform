const fs = require('fs');

const file = 'src/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Update the condition to hide top header
c = c.replace(/activeTab !== 'my' && activeTab !== 'settings' && activeTab !== 'account'/g, "activeTab !== 'my' && activeTab !== 'settings' && activeTab !== 'account' && activeTab !== 'subscription'");

// 2. Insert the Subscription Block
// We will look for `{/* 계정 정보 페이지 */}` and insert before it.
const accountBlockIndex = c.indexOf('{/* 계정 정보 페이지 */}');
if (accountBlockIndex !== -1) {
    const subscriptionBlock = `{/* 구독 및 결제 관리 페이지 */}
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

      `;
    
    // Check if it's already there
    if (!c.includes("{/* 구독 및 결제 관리 페이지 */}")) {
        c = c.substring(0, accountBlockIndex) + subscriptionBlock + c.substring(accountBlockIndex);
    }
}

fs.writeFileSync(file, c);
console.log('Successfully fixed subscription page render');
