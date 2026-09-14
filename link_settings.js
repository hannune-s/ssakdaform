const fs = require('fs');

const pageFile = 'src/app/page.tsx';
let pageContent = fs.readFileSync(pageFile, 'utf8');

// The Settings item in My Menu
const settingsItemRegex = /\{\s*title: '설정',\s*desc: '가게 정보\(영업시간, 주소 등\) 관리',\s*color: 'bg-purple-900'\s*\}/;
const replacement = `{
                title: '설정 (가게/계좌 정보)',
                desc: '가게 기본 정보 및 무통장 입금 계좌 관리',
                color: 'bg-purple-900',
                onClick: () => setActiveTab('settings')
              }`;

if (pageContent.match(settingsItemRegex)) {
    pageContent = pageContent.replace(settingsItemRegex, replacement);
} else {
    console.log("Could not find the '설정' item string using regex. Will try a simpler replace.");
    pageContent = pageContent.replace(
        "{ title: '설정', desc: '가게 정보(영업시간, 주소 등) 관리', color: 'bg-purple-900' }",
        "{ title: '설정 (가게/계좌 정보)', desc: '가게 기본 정보 및 무통장 입금 계좌 관리', color: 'bg-purple-900', onClick: () => setActiveTab('settings') }"
    );
}

// Add onClick to the rendered mapping if menu has it
pageContent = pageContent.replace(
    'className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100/80 flex items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden group"',
    'onClick={menu.onClick}\n                className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100/80 flex items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden group"'
);

// We need to conditionally render SettingsPage inside the main content area OR My Menu area. 
// Since `settings` wasn't part of activeTab initially (or was it?), we should add it.
// Let's import SettingsPage
if (!pageContent.includes('import SettingsPage')) {
    pageContent = pageContent.replace(
        "import FormBuilder from './form-builder/page';",
        "import FormBuilder from './form-builder/page';\nimport SettingsPage from './settings/page';"
    );
}

// Add rendering logic for settings tab
// It seems the main UI hides when activeTab === 'my', but what if it's 'settings'? We want it to show SettingsPage.
// And SettingsPage shouldn't show the main dashboard (builder, delivery, etc).
// We should wrap SettingsPage just like 'my' tab.
// Actually, `activeTab !== 'my'` wraps the home dashboard. We should make it `activeTab !== 'my' && activeTab !== 'settings'`
pageContent = pageContent.replace(
    "{activeTab !== 'my' && (",
    "{activeTab !== 'my' && activeTab !== 'settings' && ("
);

// Add the rendering of SettingsPage next to 'my' tab content
const myTabCloseIndex = pageContent.indexOf('{/* 마이 메뉴 컨텐츠 */}');
if (myTabCloseIndex !== -1) {
    pageContent = pageContent.replace(
        "{/* 마이 메뉴 컨텐츠 */}",
        "{/* 마이 메뉴 컨텐츠 */}\n      {activeTab === 'settings' && (\n        <div className=\"pt-12 sm:pt-16 pb-10 w-full\">\n          <div className=\"px-4 flex items-center gap-2 mb-4\">\n            <button onClick={() => setActiveTab('my')} className=\"p-2 text-gray-500 hover:bg-gray-100 rounded-full\">\n              <ArrowLeft className=\"w-6 h-6\" />\n            </button>\n            <h2 className=\"text-xl font-bold\">설정 (계좌 정보)</h2>\n          </div>\n          <SettingsPage />\n        </div>\n      )}\n\n      {/* 마이 메뉴 컨텐츠 */}"
    );
    // Note: the comment replacing above repeats the comment, so it's safe.
} else {
    console.log("Could not find {/* 마이 메뉴 컨텐츠 */} to insert settings rendering.");
}

fs.writeFileSync(pageFile, pageContent);
console.log('Done linking settings');
