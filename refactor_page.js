const fs = require('fs');

let pageTsx = fs.readFileSync('src/app/page.tsx', 'utf8');

// Change default activeTab
pageTsx = pageTsx.replace(/useState\('delivery'\);/g, "useState('builder');");

// Move builder button before delivery
const builderBtnRegex = /<button\s+onClick=\{\(\) => setActiveTab\('builder'\)\}[\s\S]*?맞춤형 폼 만들기\s*<\/button>/;
const builderBtnMatch = pageTsx.match(builderBtnRegex);

if (builderBtnMatch) {
  // Remove the old builder button
  pageTsx = pageTsx.replace(builderBtnMatch[0], '');
  
  // Insert it before delivery button
  pageTsx = pageTsx.replace(
    /<button\s+onClick=\{\(\) => setActiveTab\('delivery'\)\}/,
    `${builderBtnMatch[0]}\n          <button\n            onClick={() => setActiveTab('delivery')}`
  );
}

// Move form builder component render
pageTsx = pageTsx.replace(
  /\{activeTab === 'builder' && <FormBuilder \/>\}/,
  ''
);
pageTsx = pageTsx.replace(
  /\{activeTab === 'delivery' && <DeliveryList searchQuery=\{searchQuery\} \/>\}/,
  `{activeTab === 'builder' && <FormBuilder />}\n        {activeTab === 'delivery' && <DeliveryList searchQuery={searchQuery} />}`
);

fs.writeFileSync('src/app/page.tsx', pageTsx);
