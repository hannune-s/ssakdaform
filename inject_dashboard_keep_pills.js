const fs = require('fs');

const file = 'src/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Add Import for DashboardWidget
if (!c.includes('import DashboardWidget')) {
  c = c.replace(
    "import AccountPage from './account/page';",
    "import AccountPage from './account/page';\nimport DashboardWidget from './components/DashboardWidget';"
  );
}

// 2. Change initial state
c = c.replace(
  "const [activeTab, setActiveTab] = useState('builder');",
  "const [activeTab, setActiveTab] = useState('dashboard');"
);

// 3. Add Dashboard pill button
const builderButtonRegex = /<button\s*onClick=\{\(\) => setActiveTab\('builder'\)\}\s*className=\{`px-6 py-2 rounded-full[^>]*>[\s\S]*?맞춤형 폼 만들기\s*<\/button>/;
const dashboardAndBuilderButtons = `<div className="flex flex-row justify-center gap-1 sm:gap-2 w-full">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={\`flex-1 max-w-[150px] px-2 py-2 rounded-full text-[13.5px] sm:text-[15px] font-bold transition-all whitespace-nowrap tracking-tight \${
                activeTab === 'dashboard' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }\`}
            >
              대시보드
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={\`flex-1 max-w-[150px] px-2 py-2 rounded-full text-[13.5px] sm:text-[15px] font-bold transition-all whitespace-nowrap tracking-tight \${
                activeTab === 'builder' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }\`}
            >
              맞춤형 폼 만들기
            </button>
          </div>`;

if (c.match(builderButtonRegex)) {
  c = c.replace(builderButtonRegex, dashboardAndBuilderButtons);
}

// 4. Render DashboardWidget
if (!c.includes("{activeTab === 'dashboard' && <DashboardWidget setActiveTab={setActiveTab} />}")) {
  c = c.replace(
    "{activeTab === 'builder' && <FormBuilder />}",
    "{activeTab === 'dashboard' && <DashboardWidget setActiveTab={setActiveTab} />}\n        {activeTab === 'builder' && <FormBuilder />}"
  );
}

// 5. Update bottom nav to route to dashboard
c = c.replace(
  "onClick={() => setActiveTab('builder')}\n          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab !== 'my' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}",
  "onClick={() => setActiveTab('dashboard')}\n          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab !== 'my' && activeTab !== 'account' && activeTab !== 'settings' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}"
);

fs.writeFileSync(file, c);
console.log('Restored pill buttons and added Dashboard');
