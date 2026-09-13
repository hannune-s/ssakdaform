const fs = require('fs');

let formBuilder = fs.readFileSync('src/app/form-builder/page.tsx', 'utf8');

// 1. 좌측 "항목 추가하기" 패널 제거
// This starts right after the storeName/formTitle div which ends at:
//               </div>
//             </div>
//           </div>
//
//           <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
//             <h3 className="font-semibold text-[15px] text-gray-800 mb-3 border-b pb-2">항목 추가하기</h3>
//             ...
//           </div>
//         </div>

const panelRegex = /<div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">\s*<h3 className="font-semibold text-\[15px\] text-gray-800 mb-3 border-b pb-2">항목 추가하기<\/h3>[\s\S]*?<\/div>\s*<\/div>/;
formBuilder = formBuilder.replace(panelRegex, '</div>'); // keep the closing div of "lg:col-span-1 space-y-4"

// 2. 우측 리스트 아래에 "+ 항목 추가" 버튼 삽입
// We insert it right before the "fields.length > 0 && (" block
const addBtnHtml = `
          {/* 간단한 항목 추가 버튼 */}
          <button 
            onClick={() => addField('text')}
            className="w-full mt-2 py-3.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 font-medium text-[14px]"
          >
            <span className="text-xl leading-none">+</span> 새 입력 칸 추가
          </button>
          
          {fields.length > 0 && (`;

formBuilder = formBuilder.replace(/\{fields\.length > 0 && \(/, addBtnHtml);

// 3. 필드 타입 텍스트/표시 제거 (너무 복잡하다고 하니 타입 표시를 숨기거나 단순화)
// The field card has:
// <div className="flex items-center gap-1.5">
//   <span className="text-[10px] font-bold text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200 uppercase tracking-wider">
//     {field.type}
//   </span>
//   <span className="text-[12px] text-gray-600 font-medium">입력 타입</span>
// </div>
// Replace this with just a simple label "기본 입력칸"
const typeBadgeRegex = /<div className="flex items-center gap-1\.5">[\s\S]*?<span className="text-\[12px\] text-gray-600 font-medium">입력 타입<\/span>\s*<\/div>/;
formBuilder = formBuilder.replace(typeBadgeRegex, 
  `<div className="flex items-center gap-1.5">
                      <span className="text-[12px] text-gray-500 font-medium">일반 텍스트 입력칸</span>
                    </div>`
);

// 4. "아직 추가된 항목이 없습니다. 왼쪽 메뉴에서 항목을 추가해주세요." 텍스트 수정
formBuilder = formBuilder.replace(
  /아직 추가된 항목이 없습니다\.<br\/>왼쪽 메뉴에서 항목을 추가해주세요\./,
  '아직 추가된 입력 칸이 없습니다.<br/>아래의 [새 입력 칸 추가] 버튼을 눌러주세요.'
);

fs.writeFileSync('src/app/form-builder/page.tsx', formBuilder);
