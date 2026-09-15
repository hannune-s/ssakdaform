const fs = require('fs');

const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const ctaSectionSplit = "{/* CTA Section */}";

const pricingSection = `      {/* Pricing Section */}
      <section className="py-24 sm:py-32 bg-gray-50 relative overflow-hidden border-t border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-indigo-600 font-extrabold tracking-widest uppercase text-sm mb-3">Pricing</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">
              복잡한 종이 노트와 수기 관리를 끝내는 비용,<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">커피 두 잔 값도 안 되는 월 9,900원으로 시작하세요!</span>
            </h3>
            <p className="text-lg sm:text-xl text-gray-500 font-medium">
              합리적인 요금으로 매장 업무의 혁신을 경험해보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            
            {/* Monthly Plan (Early Bird) */}
            <div className="relative bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 border-2 border-indigo-500 p-8 sm:p-10 z-10 transform md:-translate-y-4">
              <div className="absolute -top-5 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[13px] font-black px-4 py-2 rounded-full shadow-lg animate-bounce">
                2026 얼리버드 특가 🚀
              </div>
              
              <h4 className="text-2xl font-black text-gray-900 mb-2">월간 구독 플랜</h4>
              <div className="flex items-end gap-2 mb-2">
                <span className="line-through text-gray-400 text-lg font-bold">정상가 월 14,900원</span>
              </div>
              <div className="flex items-end gap-2 mb-8 border-b border-gray-100 pb-8">
                <span className="text-5xl sm:text-6xl font-black text-indigo-600 tracking-tight">9,900<span className="text-xl font-bold text-gray-500 ml-1">원 / 월</span></span>
              </div>
              
              <ul className="space-y-4 mb-10">
                {['아날로그 접수 혁신 (QR/링크 결제)', '무제한 폼 생성 및 커스텀', '자동 고객 및 주문 관리', '모바일 주문서 다운로드 및 출력', '싹다폼의 모든 강력한 기능 포함'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0" />
                    <span className="text-gray-700 font-bold text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => window.location.href = '/signup'}
                className="w-full py-4 sm:py-5 rounded-2xl font-black text-white text-lg bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-[0.98]"
              >
                월간 플랜으로 시작하기
              </button>
            </div>

            {/* Yearly Plan */}
            <div className="relative bg-white rounded-[2rem] border border-gray-200 p-8 sm:p-10 h-fit shadow-lg shadow-gray-100/50">
              <div className="absolute -top-4 left-8 bg-gray-800 text-white text-[12px] font-black px-4 py-1.5 rounded-full shadow-md">
                추천! 2개월 무료 🎁
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">연간 구독 플랜 (선택 옵션)</h4>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">99,000<span className="text-lg font-bold text-gray-500 ml-1">원 / 년</span></span>
              </div>
              <p className="text-indigo-600 text-sm font-black mb-6 pb-6 border-b border-gray-100">
                월 8,250원 꼴 (약 17% 추가 할인 혜택!)
              </p>
              
              <p className="text-[15px] text-gray-500 mb-8 font-medium leading-relaxed">
                1년 치를 한 번에 결제하시면<br/>
                <strong className="text-gray-900">두 달치 요금을 완전히 면제</strong>해 드립니다.
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-gray-600 font-medium">월간 플랜의 <strong>모든 기능 무제한 포함</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-gray-900 font-bold">12개월 중 2개월 무료 혜택 제공</span>
                </li>
              </ul>
              
              <button 
                onClick={() => window.location.href = '/signup'}
                className="w-full py-4 rounded-2xl font-bold text-gray-700 text-lg bg-gray-50 border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all active:scale-[0.98]"
              >
                연간 플랜으로 혜택받기
              </button>
            </div>

          </div>
        </div>
      </section>

      `;

if (c.includes(ctaSectionSplit)) {
    c = c.replace(ctaSectionSplit, pricingSection + ctaSectionSplit);
    fs.writeFileSync(file, c);
    console.log('Successfully inserted pricing section');
} else {
    console.log('Could not find CTA section marker');
}
