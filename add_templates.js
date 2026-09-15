const fs = require('fs');
const file = 'src/app/form-builder/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetStr = `        {/* 왼쪽: 폼 기본 정보 설정 */}`;

const templatesStr = `        {/* 템플릿 선택 영역 */}
        <div className="lg:col-span-1 space-y-4 mb-4 lg:mb-0">
          <div className="bg-indigo-50/50 p-4 sm:p-5 rounded-xl border border-indigo-100 shadow-sm">
            <h3 className="font-semibold text-[15px] text-indigo-900 mb-3 border-b border-indigo-100 pb-2">추천 템플릿 불러오기</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setFormTitle('매장 예약 신청서');
                  setFormDescription('방문 예약 신청서입니다. 예약금(10,000원) 입금 확인 후 예약이 확정됩니다.\\n(계좌: OO은행 123-456-7890 싹다폼)\\n\\n[환불 및 노쇼 규정]\\n- 방문 2일 전 취소: 100% 환불\\n- 방문 1일 전 취소: 50% 환불\\n- 당일 취소 및 노쇼: 환불 불가');
                  setFields([
                    { id: 1, type: 'text', label: '예약자 성함', placeholder: '입금자명과 동일하게 적어주세요', required: true },
                    { id: 2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
                    { id: 3, type: 'date', label: '방문 일자', placeholder: '달력을 선택해주세요', required: true },
                    { id: 4, type: 'time', label: '방문 시간', placeholder: '시간을 선택해주세요', required: true },
                    { id: 5, type: 'text', label: '방문 인원', placeholder: '예: 2명', required: true },
                    { id: 6, type: 'textarea', label: '예약 목적 / 메뉴 선택 (선택 사항)', placeholder: '기념일, 생일, 알러지 여부, 미리 선택할 메뉴 등 자유롭게 적어주세요.', required: false },
                    { id: 7, type: 'text', label: '입금자명 (예약금 입금 시)', placeholder: '홍길동', required: true },
                    { id: 8, type: 'checkbox', label: '[필수] 개인정보 수집 및 노쇼(No-Show) 정책 동의', placeholder: '위 예약금 환불 규정 및 노쇼 정책을 숙지하였으며, 개인정보 수집에 동의합니다.', required: true }
                  ]);
                }}
                className="w-full text-left px-3 py-2 bg-white border border-indigo-200 rounded-lg text-[13px] font-semibold text-indigo-700 hover:bg-indigo-60 transition-colors shadow-sm"
              >
                📝 매장 예약 기본 템플릿
              </button>
              
              <button 
                onClick={() => {
                  setFormTitle('전국 택배 주문서');
                  setFormDescription('전국 택배 주문서입니다. 상품 대금 및 배송비(3,000원) 입금 후 제출해주세요.');
                  setFields([
                    { id: 1, type: 'text', label: '주문자 성함', placeholder: '이름을 입력하세요', required: true },
                    { id: 2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
                    { id: 3, type: 'address', label: '배송지 주소', placeholder: '우편번호 찾기를 눌러주세요', required: true },
                    { id: 4, type: 'textarea', label: '주문 상품 및 수량', placeholder: '예: 사과즙 2박스, 배즙 1박스', required: true },
                    { id: 5, type: 'text', label: '입금자명', placeholder: '주문자와 동일하면 비워두세요', required: false },
                    { id: 6, type: 'checkbox', label: '[필수] 개인정보 수집 동의', placeholder: '상품 배송을 위한 개인정보 수집에 동의합니다.', required: true }
                  ]);
                }}
                className="w-full text-left px-3 py-2 bg-white border border-indigo-200 rounded-lg text-[13px] font-semibold text-indigo-700 hover:bg-indigo-60 transition-colors shadow-sm"
              >
                📦 택배 주문 기본 템플릿
              </button>
            </div>
          </div>
        </div>

        {/* 가운데: 폼 기본 정보 설정 (원래 왼쪽이던 것) */}`;

if (c.includes(targetStr)) {
  c = c.replace(/className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6"/, `className="flex flex-col lg:flex-row gap-5 lg:gap-6"`);
  
  // Actually, wait, let's keep the grid structure but make it 4 cols if we add another panel, or just stack it above the left panel.
  // I will just stack it above the "기본 정보 설정" in the same column!
}

// Safer replace
const betterReplace = `        {/* 왼쪽: 폼 기본 정보 설정 */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm mb-4">
            <h3 className="font-semibold text-[15px] text-gray-900 mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
              <span className="text-xl">💡</span> 템플릿으로 빠른 시작
            </h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setFormTitle('매장 예약 신청서');
                  setFormDescription('방문 예약 신청서입니다. 예약금(10,000원) 입금 확인 후 예약이 확정됩니다.\\n(계좌: OO은행 123-456-7890 싹다폼)\\n\\n[환불 및 노쇼 규정]\\n- 방문 2일 전 취소: 100% 환불\\n- 방문 1일 전 취소: 50% 환불\\n- 당일 취소 및 노쇼: 환불 불가');
                  setFields([
                    { id: Date.now()+1, type: 'text', label: '예약자 성함', placeholder: '입금자명과 동일하게 적어주세요', required: true },
                    { id: Date.now()+2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
                    { id: Date.now()+3, type: 'date', label: '방문 일자', placeholder: '달력을 선택해주세요', required: true },
                    { id: Date.now()+4, type: 'time', label: '방문 시간', placeholder: '시간을 선택해주세요', required: true },
                    { id: Date.now()+5, type: 'text', label: '방문 인원', placeholder: '예: 2명', required: true },
                    { id: Date.now()+6, type: 'textarea', label: '예약 목적 / 메뉴 선택 (선택 사항)', placeholder: '기념일, 생일, 알러지 여부, 미리 선택할 메뉴 등 자유롭게 적어주세요.', required: false },
                    { id: Date.now()+7, type: 'text', label: '입금자명 (예약금 입금 시)', placeholder: '홍길동', required: true },
                    { id: Date.now()+8, type: 'checkbox', label: '[필수] 개인정보 수집 및 노쇼(No-Show) 정책 동의', placeholder: '위 예약금 환불 규정 및 노쇼 정책을 숙지하였으며, 개인정보 수집에 동의합니다.', required: true }
                  ]);
                }}
                className="w-full text-left px-3 py-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-[13px] font-bold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors shadow-sm flex items-center justify-between group"
              >
                <span>📅 매장 예약 템플릿</span>
                <span className="text-indigo-400 group-hover:text-indigo-600">→</span>
              </button>
              
              <button 
                onClick={() => {
                  setFormTitle('전국 택배 주문서');
                  setFormDescription('전국 택배 주문서입니다. 상품 대금 및 배송비(3,000원) 입금 후 제출해주세요.');
                  setFields([
                    { id: Date.now()+1, type: 'text', label: '주문자 성함', placeholder: '이름을 입력하세요', required: true },
                    { id: Date.now()+2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
                    { id: Date.now()+3, type: 'address', label: '배송지 주소', placeholder: '우편번호 찾기를 눌러주세요', required: true },
                    { id: Date.now()+4, type: 'textarea', label: '주문 상품 및 수량', placeholder: '예: 사과즙 2박스, 배즙 1박스', required: true },
                    { id: Date.now()+5, type: 'text', label: '입금자명', placeholder: '주문자와 동일하면 비워두세요', required: false },
                    { id: Date.now()+6, type: 'checkbox', label: '[필수] 개인정보 수집 동의', placeholder: '상품 배송을 위한 개인정보 수집에 동의합니다.', required: true }
                  ]);
                }}
                className="w-full text-left px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-[13px] font-bold text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors shadow-sm flex items-center justify-between group"
              >
                <span>📦 택배 주문 템플릿</span>
                <span className="text-blue-400 group-hover:text-blue-600">→</span>
              </button>
            </div>
          </div>
`;

c = c.replace(`        {/* 왼쪽: 폼 기본 정보 설정 */}
        <div className="lg:col-span-1 space-y-4">`, betterReplace);

fs.writeFileSync(file, c);
console.log('Successfully added template loader to form-builder');
