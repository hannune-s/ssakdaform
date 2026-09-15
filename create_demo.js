const fs = require('fs');
const path = require('path');

// 1. Create demo page
const pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');

// Regex replacements to remove 'my', 'settings', 'account'
let demoContent = pageContent;

// Remove imports
demoContent = demoContent.replace(/import SettingsPage from '\.\/settings\/page';\n/g, '');
demoContent = demoContent.replace(/import AccountPage from '\.\/account\/page';\n/g, '');

// Update component name
demoContent = demoContent.replace('export default function AdminHub()', 'export default function DemoAdminHub()');

// Remove bottom nav entirely and replace with custom demo bottom nav
const bottomNavRegex = /\{\/\* 🔹 하단 네비게이션바 \(홈 \/ 마이\) \*\/\}[\s\S]*?<\/div>\s*(?=\{\/\* 계정 정보 페이지 \*\/})/g;

const customBottomNav = `{/* 🔹 하단 네비게이션바 (데모 버전: 대시보드 / 나가기) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-safe shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)] z-50 h-16 sm:h-16">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={\`flex flex-col items-center justify-center w-full h-full space-y-1 \${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}\`}
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">대시보드</span>
        </button>
        <button 
          onClick={() => window.location.href = '/landing'}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-rose-500 hover:text-rose-600"
        >
          <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">체험 종료하기</span>
        </button>
      </div>\n\n      `;

demoContent = demoContent.replace(bottomNavRegex, customBottomNav);

// Remove account, settings, my content blocks
// We can use a simpler approach: finding the start of these blocks and slicing, or regex if we are careful.
// The blocks are:
// {/* 계정 정보 페이지 */} ...
// {/* 마이 메뉴 컨텐츠 */} ... (settings)
// {/* 마이 메뉴 컨텐츠 */} ... (my)
// They go until the `</div>` before `</div>\n  );\n}`
const accountStart = demoContent.indexOf('{/* 계정 정보 페이지 */}');
if (accountStart !== -1) {
    // Find the end of the main wrapper div
    const endOfComponent = demoContent.lastIndexOf('</div>\n  );\n}');
    if (endOfComponent !== -1) {
        // Just slice out everything from accountStart to endOfComponent
        demoContent = demoContent.substring(0, accountStart) + demoContent.substring(endOfComponent);
    }
}

// Write demo page
const demoDir = 'src/app/demo';
if (!fs.existsSync(demoDir)) {
    fs.mkdirSync(demoDir, { recursive: true });
}
fs.writeFileSync(path.join(demoDir, 'page.tsx'), demoContent);
console.log('Created src/app/demo/page.tsx');

// 2. Update landing page links
const landingFile = 'src/app/landing/page.tsx';
let landingContent = fs.readFileSync(landingFile, 'utf8');
landingContent = landingContent.replace(/href="\/"/g, 'href="/demo"');
landingContent = landingContent.replace(/onClick=\{\(\) => window\.location\.href = '\/'\}/g, "onClick={() => window.location.href = '/demo'}");
fs.writeFileSync(landingFile, landingContent);
console.log('Updated src/app/landing/page.tsx');
