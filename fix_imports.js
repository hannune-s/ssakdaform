const fs = require('fs');
['src/app/form-builder/page.tsx', 'src/app/preview/page.tsx'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (!c.includes('import { getSmartPlaceholder }')) {
    c = c.replace('"use client";', '"use client";\nimport { getSmartPlaceholder } from "@/lib/formUtils";');
    fs.writeFileSync(f, c);
    console.log('Fixed imports in ' + f);
  }
});
