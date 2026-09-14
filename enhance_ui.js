const fs = require('fs');

const files = [
    'src/app/page.tsx',
    'src/app/settings/page.tsx',
    'src/app/account/page.tsx',
    'src/app/form-builder/page.tsx',
    'src/app/components/DashboardWidget.tsx',
    'src/app/custom-list/page.tsx',
    'src/app/order-list/page.tsx',
    'src/app/delivery-list/page.tsx',
    'src/app/reservation-list/page.tsx',
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    content = content.replace(/border border-gray-300/g, 'border-2 border-gray-300 font-semibold');
    content = content.replace(/border border-gray-200/g, 'border-2 border-gray-300'); // changed from 200 to 300 for higher contrast
    content = content.replace(/border-gray-200/g, 'border-gray-300'); // make all 200 borders darker
    
    // buttons
    content = content.replace(/bg-blue-600/g, 'bg-blue-600 font-bold border-2 border-blue-600 shadow-md');
    content = content.replace(/bg-indigo-600/g, 'bg-indigo-600 font-bold border-2 border-indigo-600 shadow-md');
    
    // Fix doubles
    content = content.replace(/font-bold font-bold/g, 'font-bold');
    content = content.replace(/font-semibold font-semibold/g, 'font-semibold');
    content = content.replace(/border-2 border-blue-600 border-2 border-blue-600/g, 'border-2 border-blue-600');
    content = content.replace(/border-2 border-indigo-600 border-2 border-indigo-600/g, 'border-2 border-indigo-600');
    content = content.replace(/shadow-md shadow-md/g, 'shadow-md');

    if (file.includes('page.tsx') && !file.includes('list') && !file.includes('builder') && !file.includes('settings') && !file.includes('account')) {
        // search input specific
        content = content.replace(/bg-gray-50 border border-gray-200/g, 'bg-white border-2 border-gray-300');
        // pill buttons unselected
        content = content.replace(/bg-gray-50 text-gray-600 hover:bg-gray-100/g, 'bg-white text-gray-700 font-bold border-2 border-gray-300 hover:bg-gray-50 shadow-sm');
    }

    if (file.includes('DashboardWidget.tsx')) {
        content = content.replace(/border border-gray-100/g, 'border-2 border-gray-200 shadow-sm');
    }

    fs.writeFileSync(file, content);
}
console.log('UI enhanced');
