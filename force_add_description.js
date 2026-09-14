const fs = require('fs');

const file = 'src/app/form-builder/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Change the outer div style for Basic Info
const regexOuterDiv = /<div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm mb-3 lg:mb-4">\s*<h3 className="font-semibold text-\[15px\] text-gray-800">기본 정보 설정<\/h3>/;
const newOuterDiv = `<div className="bg-indigo-50/40 p-4 sm:p-5 rounded-xl border border-indigo-100 shadow-sm mb-3 lg:mb-4">
            <h3 className="font-semibold text-[15px] text-indigo-900">기본 정보 설정</h3>`;
if (content.match(regexOuterDiv)) {
  content = content.replace(regexOuterDiv, newOuterDiv);
  console.log("Outer div replaced successfully.");
} else {
  // Let's try matching just the h3 part to locate it
  const idx = content.indexOf('기본 정보 설정</h3>');
  if (idx !== -1) {
    console.log("Found the header but regex didn't match.");
  }
}

// 2. Add the textarea after formTitle input
const inputPart = `<input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px]" 
                />
              </div>`;

const newInputPart = `<input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px]" 
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">사장님 안내글 (고객에게 전달할 내용)</label>
                <textarea 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="예: 주문 전 필독사항, 제작 기간 안내 등을 적어주세요."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px] resize-y" 
                  rows={3}
                />
              </div>`;

if (content.includes(inputPart)) {
  content = content.replace(inputPart, newInputPart);
  console.log("Textarea added successfully.");
} else {
  console.log("Failed to add textarea. Couldn't find exact match.");
  // Fallback replace
  const fallbackRegex = /(<input\s+type="text"\s+value=\{formTitle\}[\s\S]*?<\/div>)/;
  if (content.match(fallbackRegex)) {
     content = content.replace(fallbackRegex, `$1\n              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">사장님 안내글 (고객에게 전달할 내용)</label>
                <textarea 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="예: 주문 전 필독사항, 제작 기간 안내 등을 적어주세요."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px] resize-y" 
                  rows={3}
                />
              </div>`);
      console.log("Textarea added via fallback regex.");
  }
}

fs.writeFileSync(file, content);
