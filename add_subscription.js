const fs = require('fs');

const file = 'src/app/settings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetStr = `      {/* 계좌 설정 */}`;

const subscriptionBlock = `      {/* 구독 및 결제 관리 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                구독 및 결제 관리
              </h2>
              <p className="text-sm text-gray-500 mt-1">현재 이용 중인 플랜과 결제 주기를 관리합니다.</p>
            </div>
            <div className="px-3 py-1.5 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-full inline-flex items-center w-fit">
              현재 무료 체험 중
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6">
            <h3 className="font-bold text-gray-900 mb-2">프리미엄 요금제로 업그레이드 하세요!</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              월 9,900원으로 제한 없는 폼 생성과 자동화된 고객 관리 시스템을 경험해 보세요.<br className="hidden sm:block" />
              아날로그 수기 장부에 뺏기던 사장님의 금쪽같은 시간을 확실하게 찾아드립니다.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {/* 월간 결제 버튼 */}
              <button onClick={() => alert('월간 결제 페이지로 이동합니다.')} className="relative w-full bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600 transition-all group">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-xl rounded-tr-xl">
                  얼리버드 특가
                </div>
                <div className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">월간 결제</div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">9,900<span className="text-sm font-medium text-gray-500">원</span></span>
                  <span className="text-xs text-gray-400 line-through mb-1 ml-1">14,900원</span>
                </div>
                <div className="text-xs text-gray-500">매월 정기 결제됩니다.</div>
              </button>

              {/* 연간 결제 버튼 */}
              <button onClick={() => alert('연간 결제 페이지로 이동합니다.')} className="relative w-full bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600 transition-all group">
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-xl rounded-tr-xl">
                  강력 추천! 2개월 무료
                </div>
                <div className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">연간 결제</div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">99,000<span className="text-sm font-medium text-gray-500">원</span></span>
                </div>
                <div className="text-xs text-rose-500 font-bold mb-1">월 8,250원 꼴 (약 17% 추가 할인)</div>
                <div className="text-[11px] text-gray-500">1년 치가 한 번에 결제됩니다.</div>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 bg-white border-t border-gray-100 pt-4 mt-2">
            <div>
              결제 수단 및 영수증 관리는 플랜 구독 후 활성화됩니다.
            </div>
            <button className="text-gray-400 hover:text-gray-600 underline underline-offset-2 mt-2 sm:mt-0 text-xs">
              결제 관련 문의하기
            </button>
          </div>
        </div>
      </div>

`;

if (c.includes(targetStr)) {
  c = c.replace(targetStr, subscriptionBlock + targetStr);
  fs.writeFileSync(file, c);
  console.log('Successfully added subscription block');
} else {
  console.log('Could not find target string');
}
