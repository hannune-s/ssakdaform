const fs = require('fs');

const files = [
    'src/app/custom-list/page.tsx',
    'src/app/delivery-list/page.tsx',
    'src/app/order-list/page.tsx',
    'src/app/reservation-list/page.tsx'
];

const newStyle = `<style>{\`
        @media print {
          body * { visibility: hidden; }
          .fixed.inset-0 {
            position: absolute !important;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
          .print-area, .print-area * { visibility: visible; }
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
        }
      \`}</style>`;

files.forEach(file => {
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(/<style>\{`[\s\S]*?`\}<\/style>/, newStyle);
    fs.writeFileSync(file, c);
    console.log('Updated ' + file);
});
