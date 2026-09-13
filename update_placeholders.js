const fs = require('fs');

function updateFormBuilder() {
  const file = 'src/app/form-builder/page.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // Add import if not exists
  if (!content.includes('getSmartPlaceholder')) {
    content = content.replace(
      "import { supabase } from '@/lib/supabase';", 
      "import { supabase } from '@/lib/supabase';\nimport { getSmartPlaceholder } from '@/lib/formUtils';"
    );
  }

  // Replace placeholder="희미하게 보일 문구" with placeholder={getSmartPlaceholder(field.label)}
  content = content.replace(
    /placeholder="희미하게 보일 문구"/g, 
    "placeholder={getSmartPlaceholder(field.label)}"
  );

  fs.writeFileSync(file, content);
  console.log('Updated form-builder');
}

function updatePreviewAndForm() {
  const files = ['src/app/preview/page.tsx', 'src/app/form/[id]/page.tsx'];
  
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    if (!content.includes('getSmartPlaceholder')) {
      content = content.replace(
        "import { supabase } from '@/lib/supabase';", 
        "import { supabase } from '@/lib/supabase';\nimport { getSmartPlaceholder } from '@/lib/formUtils';"
      );
    }

    // Replace placeholder={field.placeholder} with placeholder={field.placeholder || getSmartPlaceholder(field.label)}
    // But be careful, there might be field.placeholder || '문의사항을 남겨주세요' already.
    // Let's do a regex replacement.
    content = content.replace(
      /placeholder=\{field\.placeholder\}/g,
      "placeholder={field.placeholder || getSmartPlaceholder(field.label)}"
    );

    content = content.replace(
      /placeholder=\{field\.placeholder \|\| '[^']*'\}/g,
      "placeholder={field.placeholder || getSmartPlaceholder(field.label)}"
    );

    // Also for textarea: placeholder={field.placeholder}
    // The above regex handles it.

    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}

updateFormBuilder();
updatePreviewAndForm();
