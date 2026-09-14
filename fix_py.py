import re
with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """        {activeTab === 'custom' && <CustomList searchQuery={searchQuery} />}
        
        </div>

      {/* 앱 하단 네비게이션 바 (홈 / 마이) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-safe shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)] z-50 h-16 sm:h-16">
        <button 
          onClick={() => setActiveTab('builder')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab !== 'my' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">홈</span>
        </button>
        <button 
          onClick={() => setActiveTab('my')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'my' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold">마이</span>
        </button>
      </div>
      
      </div>
      )}"""

replacement = """        {activeTab === 'custom' && <CustomList searchQuery={searchQuery} />}
        
        </div>
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

if target in c:
    c = c.replace(target, replacement)
    with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Success")
else:
    print("Target not found")
    # try searching by regex
