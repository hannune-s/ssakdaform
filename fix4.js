const fs = require('fs');

['src/app/delivery-list/page.tsx', 'src/app/reservation-list/page.tsx', 'src/app/order-list/page.tsx'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/\}\}\s*<\/div>/g, '})}\n                          </div>');
  fs.writeFileSync(f, c, 'utf8');
});
