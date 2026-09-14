const fs = require('fs');

let pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');

if (!pageContent.includes('import CustomList')) {
  pageContent = pageContent.replace(
    "import OrderList from './order-list/page';",
    "import OrderList from './order-list/page';\nimport CustomList from './custom-list/page';"
  );
}

if (!pageContent.includes("{activeTab === 'custom' && <CustomList")) {
  pageContent = pageContent.replace(
    "{activeTab === 'order' && <OrderList searchQuery={searchQuery} />}",
    "{activeTab === 'order' && <OrderList searchQuery={searchQuery} />}\n        {activeTab === 'custom' && <CustomList searchQuery={searchQuery} />}"
  );
}

// Add the 4th tab button to the second row (which currently has delivery, reservation, order)
const orderTabRegex = /<button\s*onClick=\{\(\) => setActiveTab\('order'\)\}[\s\S]*?상품 주문 현황\s*<\/button>/;
const customTabButton = `
            <button
              onClick={() => setActiveTab('custom')}
              className={\`flex-1 max-w-[130px] px-0.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[13px] sm:text-[14px] font-bold transition-all whitespace-nowrap tracking-tighter sm:tracking-tight \${
                activeTab === 'custom' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }\`}
            >
              맞춤 주문 현황
            </button>`;

if (pageContent.match(orderTabRegex) && !pageContent.includes("setActiveTab('custom')")) {
  pageContent = pageContent.replace(orderTabRegex, match => match + customTabButton);
}

fs.writeFileSync('src/app/page.tsx', pageContent);
console.log('Updated page.tsx with CustomList');

let dashboardContent = fs.readFileSync('src/app/components/DashboardWidget.tsx', 'utf8');
dashboardContent = dashboardContent.replace(
  "{ id: 'builder', name: '맞춤', count: 0, newCount: 0, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' }",
  "{ id: 'custom', name: '맞춤', count: 0, newCount: 0, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' }"
);
fs.writeFileSync('src/app/components/DashboardWidget.tsx', dashboardContent);
console.log('Updated DashboardWidget');
