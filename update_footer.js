const fs = require('fs');
const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetStr = `      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-gray-500" />
            </div>
            <span className="font-bold text-gray-400">SSAKDAFORM</span>
          </div>
          <p className="text-sm text-gray-400 font-medium">© 2026 싹다폼. All rights reserved.</p>
        </div>
      </footer>`;

const newStr = `      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between gap-8 md:gap-4">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-gray-500" />
              </div>
              <span className="font-bold text-gray-400">SSAKDAFORM</span>
            </div>
            
            {/* 사업자 정보 아코디언 */}
            <details className="group">
              <summary className="text-sm font-bold text-gray-500 cursor-pointer list-none flex items-center gap-1 hover:text-gray-700 transition-colors">
                사업자 정보 
                <span className="text-[10px] text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 text-[13px] text-gray-400 space-y-1.5 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p><span className="font-semibold">상호명:</span> (주)싹다폼 | <span className="font-semibold">대표:</span> 김싹다</p>
                <p><span className="font-semibold">사업자등록번호:</span> 123-45-67890</p>
                <p><span className="font-semibold">통신판매업신고:</span> 제2026-서울강남-1234호</p>
                <p><span className="font-semibold">이메일:</span> support@ssakdaform.com | <span className="font-semibold">고객센터:</span> 070-1234-5678</p>
                <p><span className="font-semibold">주소:</span> 서울특별시 강남구 테헤란로 123, 싹다빌딩 4층</p>
              </div>
            </details>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-4 text-[13px] font-bold text-gray-500">
              <Link href="/terms" className="hover:text-gray-800 transition-colors">이용약관</Link>
              <span className="text-gray-300">|</span>
              <Link href="/privacy" className="hover:text-gray-800 transition-colors">개인정보처리방침</Link>
            </div>
            <p className="text-[13px] text-gray-400 font-medium">© 2026 싹다폼. All rights reserved.</p>
          </div>
          
        </div>
      </footer>`;

if (c.includes(targetStr)) {
    c = c.replace(targetStr, newStr);
    fs.writeFileSync(file, c);
    console.log('Successfully updated footer');
} else {
    console.log('Target string not found');
}
