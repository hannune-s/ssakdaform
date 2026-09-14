const fs = require('fs');
const file = 'src/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Add Import
if (!c.includes('import DashboardWidget')) {
  c = c.replace(
    "import AccountPage from './account/page';",
    "import AccountPage from './account/page';\nimport DashboardWidget from './components/DashboardWidget';"
  );
}

// 2. Change default activeTab to 'dashboard'
c = c.replace(
  "const [activeTab, setActiveTab] = useState('builder');",
  "const [activeTab, setActiveTab] = useState('dashboard');"
);

// 3. Render DashboardWidget
if (!c.includes("{activeTab === 'dashboard' && <DashboardWidget setActiveTab={setActiveTab} />}")) {
  c = c.replace(
    "{activeTab === 'builder' && <FormBuilder />}",
    "{activeTab === 'dashboard' && <DashboardWidget setActiveTab={setActiveTab} />}\n        {activeTab === 'builder' && <FormBuilder />}"
  );
}

// 4. Update the "홈" button in bottom nav to route to dashboard instead of builder
c = c.replace(
  "onClick={() => setActiveTab('builder')}\n          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab !== 'my' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}",
  "onClick={() => setActiveTab('dashboard')}\n          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab !== 'my' && activeTab !== 'account' && activeTab !== 'settings' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}"
);

// 5. Remove the old "메뉴(카테고리) 탭 버튼" block and just show search bar
const tabButtonsRegex = /\{\/\* 메뉴\(카테고리\) 탭 버튼 \*\/\}[\s\S]*?\{\/\* 검색창 \*\/\}/;
if (c.match(tabButtonsRegex)) {
  c = c.replace(tabButtonsRegex, "{/* 검색창 */}");
}

fs.writeFileSync(file, c);
console.log('Updated page.tsx to use DashboardWidget');
