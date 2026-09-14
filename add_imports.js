const fs = require('fs');
let c = fs.readFileSync('src/app/page.tsx', 'utf8');
if (!c.includes('Home, User')) {
  c = c.replace(
    "import { Search, Package, Copy, ExternalLink, Check } from 'lucide-react';",
    "import { Search, Package, Copy, ExternalLink, Check, Home, User } from 'lucide-react';"
  );
  fs.writeFileSync('src/app/page.tsx', c);
  console.log('Added imports!');
}
