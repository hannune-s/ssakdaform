const fs = require('fs');

function updatePreview() {
  const file = 'src/app/preview/page.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // Add formDescription state
  content = content.replace(
    "const [formTitle, setFormTitle] = useState('');",
    "const [formTitle, setFormTitle] = useState('');\n  const [formDescription, setFormDescription] = useState('');"
  );

  content = content.replace(
    "if (parsed.formTitle) setFormTitle(parsed.formTitle);",
    "if (parsed.formTitle) setFormTitle(parsed.formTitle);\n        if (parsed.formDescription) setFormDescription(parsed.formDescription);"
  );

  // Render formDescription
  const headerBlock = `<div className="px-6 py-8 sm:px-8 border-b border-gray-100 bg-white">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                  {formTitle}
                </h1>
              </div>`;

  const newHeaderBlock = `<div className="px-6 py-8 sm:px-8 border-b border-gray-100 bg-white">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                  {formTitle}
                </h1>
                {formDescription && (
                  <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 text-indigo-900/90 text-sm leading-relaxed whitespace-pre-wrap">
                    {formDescription}
                  </div>
                )}
              </div>`;

  content = content.replace(headerBlock, newHeaderBlock);
  fs.writeFileSync(file, content);
  console.log('Updated preview');
}

function updateForm() {
  const file = 'src/app/form/[id]/page.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // Hardcode formDescription in the presets
  content = content.replace(
    /formTitle: '간편한 상품 주문서',/g,
    "formTitle: '간편한 상품 주문서',\n          formDescription: '주문 전에 반드시 공지사항을 확인해주세요. 제작 기간은 영업일 기준 3~5일 소요됩니다.',"
  );
  content = content.replace(
    /formTitle: '매장 방문 예약',/g,
    "formTitle: '매장 방문 예약',\n          formDescription: '원하시는 방문 시간을 선택해주세요. 노쇼 방지를 위해 예약금 제도를 운영 중입니다.',"
  );

  // For dbData
  content = content.replace(
    "formTitle: dbData.title,",
    "formTitle: dbData.title,\n          formDescription: dbData.description,"
  );

  // Render formDescription
  const headerBlock = `<div className="px-6 py-8 sm:px-8 border-b border-gray-100 bg-white">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                    {data.formTitle}
                  </h1>
                </div>`;

  const newHeaderBlock = `<div className="px-6 py-8 sm:px-8 border-b border-gray-100 bg-white">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                    {data.formTitle}
                  </h1>
                  {data.formDescription && (
                    <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 text-indigo-900/90 text-[14px] leading-relaxed whitespace-pre-wrap">
                      {data.formDescription}
                    </div>
                  )}
                </div>`;

  content = content.replace(headerBlock, newHeaderBlock);
  fs.writeFileSync(file, content);
  console.log('Updated form');
}

updatePreview();
updateForm();
