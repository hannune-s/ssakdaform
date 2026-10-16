const fs = require('fs');

let page = fs.readFileSync('src/app/form-builder/page.tsx', 'utf8');

// 1. Add state
if (!page.includes('savedForms')) {
  page = page.replace(
    /const \[fields, setFields\] = useState<FormField\[\]>\(\[/,
    "const [savedForms, setSavedForms] = useState<any[]>([]);\n  const [fields, setFields] = useState<FormField[]>(["
  );
}

// 2. Load forms in useEffect
if (!page.includes('setSavedForms(JSON.parse')) {
  page = page.replace(
    /setIsLoaded\(true\);/,
    "const storedForms = localStorage.getItem('ssakdaform_custom_forms');\n    if (storedForms) {\n      setSavedForms(JSON.parse(storedForms));\n    }\n    setIsLoaded(true);"
  );
}

// 3. Update handleSave to set state
if (!page.includes('setSavedForms(existingForms)')) {
  page = page.replace(
    /localStorage\.setItem\('ssakdaform_custom_forms', JSON\.stringify\(existingForms\)\);/,
    "localStorage.setItem('ssakdaform_custom_forms', JSON.stringify(existingForms));\n    setSavedForms(existingForms);"
  );
}

// 4. Add handleDeleteForm
const deleteFn = `
  const handleDeleteForm = (id: string) => {
    if (window.confirm('이 폼을 정말 삭제하시겠습니까? 고객 화면에서도 즉시 사라집니다.')) {
      const updated = savedForms.filter(f => f.id !== id);
      setSavedForms(updated);
      localStorage.setItem('ssakdaform_custom_forms', JSON.stringify(updated));
    }
  };
`;
if (!page.includes('handleDeleteForm')) {
  page = page.replace(
    /const handleSave = \(\) => \{/,
    deleteFn + "\n  const handleSave = () => {"
  );
}

// 5. Add UI at the end
const listHtml = `
      {savedForms.length > 0 && (
        <div className="mt-10 bg-white p-6 rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="font-extrabold text-gray-900 mb-5 text-[17px] flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
            저장된 맞춤형 폼 관리
          </h3>
          <div className="space-y-3">
            {savedForms.map((form, idx) => (
              <div key={form.id || idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all group">
                <div>
                  <h4 className="font-bold text-gray-800 text-[15px]">{form.formTitle}</h4>
                  {form.formDescription && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{form.formDescription}</p>}
                </div>
                <button 
                  onClick={() => handleDeleteForm(form.id)}
                  className="px-3 sm:px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap ml-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
`;

if (!page.includes('저장된 맞춤형 폼 관리')) {
  page = page.replace(
    /(<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\;\s*\})/,
    "      </div>\n" + listHtml + "\n    </div>\n  );\n}"
  );
}

fs.writeFileSync('src/app/form-builder/page.tsx', page);
console.log('Robustly added saved forms management list to form builder');
