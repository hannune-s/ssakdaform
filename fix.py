import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# The regex to find the bottom nav block inside the condition
pattern = re.compile(
    r'(<div className="w-full max-w-6xl mx-auto flex-1">[\s\S]*?</div>)\s*\{\/\* 앱 하단 네비게이션 바 \(홈 / 마이\) \*\/\}[\s\S]*?<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-safe shadow-\[0_-5px_15px_-10px_rgba\(0,0,0,0\.05\)\] z-50 h-16 sm:h-16">[\s\S]*?<\/div>\s*<\/div>\s*\)\}',
    re.MULTILINE
)

def replacer(match):
    content_area = match.group(1)
    return content_area + """
        </div>
      )}

      {/* 앱 하단 네비게이션 바 (홈 / 마이) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-safe shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)] z-50 h-16 sm:h-16">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab !== 'my' && activeTab !== 'account' && activeTab !== 'settings' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">홈</span>
        </button>
        <button 
          onClick={() => setActiveTab('my')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'my' || activeTab === 'account' || activeTab === 'settings' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">마이</span>
        </button>
      </div>"""

new_c, count = pattern.subn(replacer, c)
print(f"Replaced {count} times")

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(new_c)
