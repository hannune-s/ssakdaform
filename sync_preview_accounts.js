const fs = require('fs');

// 1. Update Preview Page Accounts & Privacy Checkbox
let preview = fs.readFileSync('src/app/preview/page.tsx', 'utf8');

// Add supabase import if not there
if (!preview.includes("import { supabase } from '@/lib/supabase';")) {
  preview = preview.replace("import DaumPostcode from 'react-daum-postcode';", "import DaumPostcode from 'react-daum-postcode';\nimport { supabase } from '@/lib/supabase';");
}

// Change loadAccounts logic in preview
preview = preview.replace(
  "const storedAccounts = localStorage.getItem('ssakdaform_store_accounts');\n    if (storedAccounts) {\n      setAccounts(JSON.parse(storedAccounts));\n    }",
  `async function loadAccounts() {
      const { data } = await supabase.from('ssakdaform_store_accounts').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setAccounts(data.map((d: any) => ({ bank: d.bank, accountNumber: d.account_number, holder: d.holder })));
      }
    }
    loadAccounts();`
);

// Inject privacy checkbox in preview
const privacyCheckboxHtml = `
            {/* 고정 개인정보 수집 동의 */}
            <div className="pt-6">
              <label className="flex items-start gap-2.5 p-3 sm:p-4 rounded-xl border border-gray-300 cursor-pointer transition-colors bg-white hover:bg-gray-50 shadow-sm">
                <input type="checkbox" required className="w-4 h-4 mt-0.5 sm:mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
                <span className="text-sm sm:text-[15px] font-medium text-gray-800 leading-relaxed">
                  [필수] 개인정보 수집 및 이용에 동의합니다.
                </span>
              </label>
            </div>
            
            <div className="pt-6 sm:pt-8">`;

preview = preview.replace('<div className="pt-8">', privacyCheckboxHtml);
fs.writeFileSync('src/app/preview/page.tsx', preview);

// 2. Inject privacy checkbox in Form Page
let form = fs.readFileSync('src/app/form/[id]/page.tsx', 'utf8');
form = form.replace('<div className="pt-8">', privacyCheckboxHtml);
fs.writeFileSync('src/app/form/[id]/page.tsx', form);

console.log('Fixed preview accounts and added privacy checkbox');
