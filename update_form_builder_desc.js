const fs = require('fs');

function updateFormBuilder() {
  const file = 'src/app/form-builder/page.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // Add state
  content = content.replace(
    "const [formTitle, setFormTitle] = useState('새로운 맞춤형 신청서');",
    "const [formTitle, setFormTitle] = useState('새로운 맞춤형 신청서');\n  const [formDescription, setFormDescription] = useState('');"
  );

  // Draft load
  content = content.replace(
    "if (parsed.formTitle) setFormTitle(parsed.formTitle);",
    "if (parsed.formTitle) setFormTitle(parsed.formTitle);\n        if (parsed.formDescription !== undefined) setFormDescription(parsed.formDescription);"
  );

  // Draft save
  content = content.replace(
    "formTitle,\n          fields",
    "formTitle,\n          formDescription,\n          fields"
  );

  // Dependency array
  content = content.replace(
    "[storeName, formTitle, fields, isLoaded]",
    "[storeName, formTitle, formDescription, fields, isLoaded]"
  );

  // Preview save
  content = content.replace(
    "JSON.stringify({ storeName, formTitle, fields })",
    "JSON.stringify({ storeName, formTitle, formDescription, fields })"
  );

  // Reset
  content = content.replace(
    "setFormTitle('새로운 맞춤형 신청서');",
    "setFormTitle('새로운 맞춤형 신청서');\n      setFormDescription('');"
  );

  // UI styling & new textarea
  // <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm mb-3 lg:mb-4">
  // Change to bg-indigo-50/50 border-indigo-100
  content = content.replace(
    /<div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm mb-3 lg:mb-4">[\s\S]*?<h3 className="font-semibold text-\[15px\] text-gray-800">기본 정보 설정<\/h3>/,
    `<div className="bg-indigo-50/40 p-4 sm:p-5 rounded-xl border border-indigo-100 shadow-sm mb-3 lg:mb-4">
              <h3 className="font-semibold text-[15px] text-indigo-900">기본 정보 설정</h3>`
  );

  // Add the textarea
  const titleInputBlock = `<div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">폼 제목 (신청서 이름)</label>
                  <input 
                    type="text" 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px]" 
                  />
                </div>`;

  const newDescriptionBlock = `<div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">사장님 안내글 (고객에게 전달할 내용)</label>
                  <textarea 
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="예: 주문 전 필독사항, 제작 기간 안내 등을 적어주세요."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px]" 
                    rows={3}
                  />
                </div>`;

  content = content.replace(titleInputBlock, titleInputBlock + '\n                ' + newDescriptionBlock);

  fs.writeFileSync(file, content);
  console.log('Updated form-builder');
}

updateFormBuilder();
