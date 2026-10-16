const fs = require('fs');

let preview = fs.readFileSync('src/app/preview/page.tsx', 'utf8');

// 1. Add supabase import if not there
if (!preview.includes("import { supabase } from '@/lib/supabase';")) {
  preview = preview.replace("import DaumPostcode from 'react-daum-postcode';", "import DaumPostcode from 'react-daum-postcode';\nimport { supabase } from '@/lib/supabase';");
}

// 2. Replace the entire useEffect
const oldUseEffectRegex = /useEffect\(\(\) => \{\s*const storedAccounts[\s\S]*?setData\(JSON\.parse\(stored\)\);\s*\}\s*\}, \[\]\);/;

const newUseEffect = `useEffect(() => {
    async function loadData() {
      // Load store info
      const savedStoreInfo = localStorage.getItem('ssakdaform_store_details');
      if (savedStoreInfo) { 
        setStoreInfo(JSON.parse(savedStoreInfo)); 
      } else {
        setStoreInfo({
          name: '싹다폼 (데모 상호명)',
          ownerName: '홍길동',
          address: '서울시 서초구 (데모 주소)',
          phone: '010-1234-5678',
          hours: '09:00 ~ 18:00',
          closedDays: '일요일',
          paymentLink: ''
        });
      }

      // Load accounts from Supabase (like the main page does)
      const { data } = await supabase.from('ssakdaform_store_accounts').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setAccounts(data.map((d: any) => ({ bank: d.bank, accountNumber: d.account_number, holder: d.holder })));
      }

      // Load preview form data
      const stored = localStorage.getItem('ssakdaform_preview');
      if (stored) {
        setData(JSON.parse(stored));
      }
    }
    loadData();
  }, []);`;

if (oldUseEffectRegex.test(preview)) {
  preview = preview.replace(oldUseEffectRegex, newUseEffect);
  fs.writeFileSync('src/app/preview/page.tsx', preview);
  console.log('Successfully updated preview page useEffect');
} else {
  console.log('Could not find useEffect block to replace');
}
