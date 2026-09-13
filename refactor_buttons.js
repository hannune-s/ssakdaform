const fs = require('fs');
let content = fs.readFileSync('src/app/form-builder/page.tsx', 'utf8');

// 1. Remove the top buttons block
const topButtonsRegex = /<div className="flex flex-row items-center gap-2 w-full md:w-auto">[\s\S]*?<\/div>\s*<\/div>/;
// Wait, the div above is:
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
//         <div>
//           <h1 className="text-[19px] md:text-xl font-bold text-gray-900 mb-1">맞춤형 폼 만들기</h1>
//           <p className="text-[13px] text-gray-500">우리 매장에 딱 맞는 신청서를 직접 만들어보세요.</p>
//         </div>
//         <div className="flex flex-row items-center gap-2 w-full md:w-auto">
//            ...
//         </div>
//       </div>
// We only want to remove the <div className="flex flex-row items-center gap-2 w-full md:w-auto">...</div> part, but it has nested buttons.
content = content.replace(/<div className="flex flex-row items-center gap-2 w-full md:w-auto">[\s\S]*?<\/div>/, '');

// 2. Replace the bottom buttons block
const bottomButtonsRegex = /\{fields\.length > 0 && \([\s\S]*?<div className="pt-6 flex flex-row gap-2 mt-4 border-t border-gray-200">[\s\S]*?<\/div>\s*\)\}/;

const newBottomButtons = `
          {/* 하단 액션 버튼 그룹 */}
          <div className="pt-6 mt-4 border-t border-gray-200 flex flex-col gap-2.5">
            {/* 윗줄: 보조 액션 (초기화, 미리보기) */}
            <div className="flex flex-row gap-2">
              <button 
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm text-[13px] sm:text-[14px] font-medium"
              >
                <RotateCcw className="w-4 h-4 text-gray-500" />
                초기화
              </button>
              <button 
                onClick={handlePreview}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm text-[13px] sm:text-[14px] font-medium"
              >
                <Eye className="w-4 h-4 text-gray-500" />
                고객화면 미리보기
              </button>
            </div>
            
            {/* 아랫줄: 주요 액션 (링크 복사, 저장) */}
            {fields.length > 0 && (
              <div className="flex flex-row gap-2">
                <button 
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium shadow-sm text-[13px] sm:text-[14px]"
                >
                  <LinkIcon className="w-4 h-4" />
                  고객링크 복사
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm text-[13px] sm:text-[14px]"
                >
                  폼 저장하기
                </button>
              </div>
            )}
          </div>`;

content = content.replace(bottomButtonsRegex, newBottomButtons);

fs.writeFileSync('src/app/form-builder/page.tsx', content);
