const fs = require('fs');

const file = 'src/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Import AccountPage
if (!c.includes('import AccountPage')) {
  c = c.replace(
    "import SettingsPage from './settings/page';",
    "import SettingsPage from './settings/page';\nimport AccountPage from './account/page';"
  );
}

// 2. Update dashboard wrapper
if (c.includes("{activeTab !== 'my' && activeTab !== 'settings' && (")) {
  c = c.replace(
    "{activeTab !== 'my' && activeTab !== 'settings' && (",
    "{activeTab !== 'my' && activeTab !== 'settings' && activeTab !== 'account' && ("
  );
}

// 3. Add AccountPage render block
const accountRenderBlock = `{/* 계정 정보 페이지 */}
      {activeTab === 'account' && (
        <div className="pt-12 sm:pt-16 pb-10 w-full">
          <div className="px-4 flex items-center gap-2 mb-4">
            <button onClick={() => setActiveTab('my')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">계정 정보</h2>
          </div>
          <AccountPage />
        </div>
      )}`;

if (!c.includes("{activeTab === 'account' && (")) {
  c = c.replace(
    "{/* 마이 메뉴 컨텐츠 */}\n      {activeTab === 'settings' && (",
    `${accountRenderBlock}\n\n      {/* 마이 메뉴 컨텐츠 */}\n      {activeTab === 'settings' && (`
  );
}

// 4. Update the "계정 정보" menu item
const accountMenuRegex = /\{\s*title: '계정 정보',\s*desc: '관리자 아이디 및 비밀번호 변경',\s*color: 'bg-purple-900'\s*\}/;
const replacement = `{
                title: '계정 정보',
                desc: '관리자 아이디 및 비밀번호 변경',
                color: 'bg-purple-900',
                onClick: () => setActiveTab('account')
              }`;

if (c.match(accountMenuRegex)) {
  c = c.replace(accountMenuRegex, replacement);
  fs.writeFileSync(file, c);
  console.log("Successfully linked AccountPage in page.tsx");
} else {
  console.log("Could not find '계정 정보' in menu array via regex. Will try simple string replacement.");
  c = c.replace(
    "{ title: '계정 정보', desc: '관리자 아이디 및 비밀번호 변경', color: 'bg-purple-900' }",
    "{ title: '계정 정보', desc: '관리자 아이디 및 비밀번호 변경', color: 'bg-purple-900', onClick: () => setActiveTab('account') }"
  );
  fs.writeFileSync(file, c);
}
