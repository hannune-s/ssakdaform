const fs = require('fs');
const file = 'src/app/subscription/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetStr = `          <div>
            <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 px-1 sm:px-2 text-[14px] sm:text-base">결제 내역 및 수단 관리</h3>
            <div className="border border-gray-100 rounded-xl divide-y divide-gray-100">
              <button className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors rounded-t-xl group text-left">
                <div>
                  <div className="font-bold text-gray-900 text-[13px] sm:text-sm mb-0.5 sm:mb-1">결제 수단 관리</div>
                  <div className="text-[11px] sm:text-xs text-gray-500">등록된 카드 변경 및 삭제</div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors rounded-b-xl group text-left">
                <div>
                  <div className="font-bold text-gray-900 text-[13px] sm:text-sm mb-0.5 sm:mb-1">결제 내역 및 영수증</div>
                  <div className="text-[11px] sm:text-xs text-gray-500">과거 결제 내역 확인 및 매출 전표 출력</div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </button>
            </div>
          </div>`;

const newStr = `          <div>
            <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 px-1 sm:px-2 text-[14px] sm:text-base">결제 내역 및 영수증</h3>
            <div className="border border-gray-100 rounded-xl">
              <button className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors rounded-xl group text-left">
                <div>
                  <div className="font-bold text-gray-900 text-[13px] sm:text-sm mb-0.5 sm:mb-1">결제 내역 및 영수증</div>
                  <div className="text-[11px] sm:text-xs text-gray-500">과거 결제 내역 확인 및 매출 전표 출력</div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </button>
            </div>
          </div>`;

if (c.includes(targetStr)) {
    c = c.replace(targetStr, newStr);
    fs.writeFileSync(file, c);
    console.log('Successfully updated payment management section');
} else {
    console.log('Target string not found');
}
