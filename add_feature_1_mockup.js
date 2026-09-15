const fs = require('fs');

const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetBlock = `<div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[2.5rem] transform rotate-3 scale-105" />
                <img src="https://placehold.co/800x600/e0e7ff/4f46e5?text=Smart+QR+Link+Screenshot" alt="스마트 접수 화면" className="relative rounded-3xl shadow-2xl border border-gray-100 w-full object-cover" />
                <p className="text-center text-sm text-gray-400 mt-3 font-medium">※ 실제 어드민의 링크 복사/QR 기능 캡처 이미지로 교체해 주세요.</p>
              </div>`;

const newBlock = `<div className="flex-1 w-full relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center mt-10 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[2.5rem] transform rotate-3 scale-105" />
                
                {/* 3 Mobile Mockups Container */}
                <div className="relative w-full max-w-md h-[360px]">
                  
                  {/* Delivery Mockup (Left) */}
                  <div className="absolute top-4 -left-4 sm:left-0 w-48 bg-white rounded-3xl shadow-[0_15px_30px_rgb(0,0,0,0.1)] border border-gray-100 transform -rotate-6 p-4 overflow-hidden z-10 hover:-rotate-2 hover:z-40 transition-all duration-300">
                    <div className="bg-blue-600 text-white text-center py-3 -mx-4 -mt-4 mb-3 text-[13px] font-bold shadow-sm">📦 간편 택배 접수</div>
                    <div className="space-y-3">
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">받는 분 성함</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium">홍길동</span></div></div>
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">연락처</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium">010-1234-5678</span></div></div>
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">주소</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium truncate">서울 강남구 테헤란로</span></div></div>
                      <div className="h-8 bg-blue-600 rounded-xl mt-3 flex items-center justify-center text-white text-[12px] font-bold shadow-md">접수하기</div>
                    </div>
                  </div>

                  {/* Order Mockup (Right) */}
                  <div className="absolute top-12 -right-4 sm:right-0 w-48 bg-white rounded-3xl shadow-[0_15px_30px_rgb(0,0,0,0.1)] border border-gray-100 transform rotate-6 p-4 overflow-hidden z-20 hover:rotate-2 hover:z-40 transition-all duration-300">
                    <div className="bg-purple-600 text-white text-center py-3 -mx-4 -mt-4 mb-3 text-[13px] font-bold shadow-sm">🛍️ 상품 주문서</div>
                    <div className="space-y-3">
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">주문 상품</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium truncate">프리미엄 세트 A</span></div></div>
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">수량</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium">2개</span></div></div>
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">요청사항</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium truncate">선물용 포장 부탁드려요</span></div></div>
                      <div className="h-8 bg-purple-600 rounded-xl mt-3 flex items-center justify-center text-white text-[12px] font-bold shadow-md">주문하기</div>
                    </div>
                  </div>

                  {/* Reservation Mockup (Center/Front) */}
                  <div className="absolute top-24 left-1/2 -translate-x-1/2 w-52 bg-white rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.15)] border border-gray-100 p-4 overflow-hidden z-30 hover:scale-105 transition-all duration-300">
                    <div className="bg-green-600 text-white text-center py-3 -mx-4 -mt-4 mb-3 text-[13px] font-bold shadow-sm">🗓️ 매장 예약 접수</div>
                    <div className="space-y-3">
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">예약자명</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium">이영희</span></div></div>
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">방문 일시</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium">10월 25일 (금) 19:00</span></div></div>
                      <div><div className="text-[10px] text-gray-500 mb-1 font-medium">방문 인원</div><div className="h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 flex items-center"><span className="text-[10px] text-gray-600 font-medium">4명 (성인2, 아동2)</span></div></div>
                      <div className="h-9 bg-green-600 rounded-xl mt-3 flex items-center justify-center text-white text-[12px] font-bold shadow-md">예약하기</div>
                    </div>
                  </div>
                </div>
              </div>`;

if (c.includes(targetBlock)) {
    c = c.replace(targetBlock, newBlock);
    fs.writeFileSync(file, c);
    console.log('Successfully added mockup to feature 1');
} else {
    console.log('Could not find target block in page.tsx');
}
