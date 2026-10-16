const fs = require('fs');

// 1. Update form-builder/page.tsx to save custom forms
let formBuilder = fs.readFileSync('src/app/form-builder/page.tsx', 'utf8');

const newHandleSave = `
  const handleSave = () => {
    const formData = {
      id: \`custom-\${Date.now()}\`,
      storeName,
      formTitle,
      formDescription,
      fields
    };
    
    let existingForms = [];
    try {
      const stored = localStorage.getItem('ssakdaform_custom_forms');
      if (stored) {
        existingForms = JSON.parse(stored);
      }
    } catch(e) {}
    
    // We append the new form
    existingForms.push(formData);
    localStorage.setItem('ssakdaform_custom_forms', JSON.stringify(existingForms));
    
    alert('폼이 성공적으로 저장되었습니다!');
  };
`;
formBuilder = formBuilder.replace(/const handleSave = \(\) => {[\s\S]*?};/, newHandleSave.trim());
fs.writeFileSync('src/app/form-builder/page.tsx', formBuilder);


// 2. Update store/[slug]/page.tsx to display custom forms
let storePage = fs.readFileSync('src/app/store/[slug]/page.tsx', 'utf8');

// Add state for custom forms
if (!storePage.includes('const [customForms')) {
  storePage = storePage.replace(
    'const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);',
    'const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);\n  const [customForms, setCustomForms] = useState<any[]>([]);'
  );
  
  // Update useEffect to load custom forms
  storePage = storePage.replace(
    'if (data && data.length > 0) {\n        setAccounts(data.map(d => ({ bank: d.bank, accountNumber: d.account_number, holder: d.holder })));\n      }\n    }',
    `if (data && data.length > 0) {
        setAccounts(data.map(d => ({ bank: d.bank, accountNumber: d.account_number, holder: d.holder })));
      }
      
      const storedForms = localStorage.getItem('ssakdaform_custom_forms');
      if (storedForms) {
        setCustomForms(JSON.parse(storedForms));
      }
    }`
  );
  
  // Replace the hardcoded custom form link with mapped links
  const customFormHtml = `
          {customForms.length > 0 ? (
            customForms.map((form, idx) => (
              <Link key={form.id || idx} href={\`/form/\${form.id}\`} className="block group mb-3 last:mb-0">
                <div className="relative p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 border-b-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 flex items-center justify-between group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] group-hover:border-indigo-200 group-hover:border-b-indigo-300 cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/0 to-indigo-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <div className="relative z-10">
                    <h4 className="font-bold text-gray-800">{form.formTitle}</h4>
                    {form.formDescription && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{form.formDescription}</p>}
                  </div>
                  <ChevronRight className="relative z-10 w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                </div>
              </Link>
            ))
          ) : (
            <Link href="/form/demo-12345" className="block group">
              <div className="relative p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 border-b-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 flex items-center justify-between group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] group-hover:border-indigo-200 group-hover:border-b-indigo-300 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/0 to-indigo-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <div className="relative z-10">
                  <h4 className="font-bold text-gray-800">🎉 추석 맞이 특별 할인 신청</h4>
                  <p className="text-xs text-gray-500 mt-1">2026.09.15 ~ 09.30</p>
                </div>
                <ChevronRight className="relative z-10 w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            </Link>
          )}
  `;
  
  storePage = storePage.replace(
    /<Link href="\/form\/demo-12345"[\s\S]*?<\/Link>/,
    customFormHtml.trim()
  );
  fs.writeFileSync('src/app/store/[slug]/page.tsx', storePage);
}

// 3. Update form/[id]/page.tsx to load custom form data
let formPage = fs.readFileSync('src/app/form/[id]/page.tsx', 'utf8');

const customFormLoadBlock = `
    const storedForms = localStorage.getItem('ssakdaform_custom_forms');
    if (storedForms) {
      const forms = JSON.parse(storedForms);
      const foundForm = forms.find((f: any) => f.id === id);
      if (foundForm) {
        setData(foundForm);
        return;
      }
    }
`;

if (!formPage.includes('ssakdaform_custom_forms')) {
  formPage = formPage.replace(
    "if (id === 'delivery-preset') {",
    customFormLoadBlock + "\n    if (id === 'delivery-preset') {"
  );
  fs.writeFileSync('src/app/form/[id]/page.tsx', formPage);
}

console.log('Successfully linked custom forms');
