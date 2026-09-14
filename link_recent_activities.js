const fs = require('fs');
let c = fs.readFileSync('src/app/components/DashboardWidget.tsx', 'utf8');

const oldRecent = /const recentActivities = \[[\s\S]*?\];/;
const newRecent = `const recentActivities = [
    { title: '[택배] 홍길동 님', desc: '서울 강남구 테헤란로 123', time: '10분 전', isNew: true, tab: 'delivery' },
    { title: '[주문] 김철수 님', desc: '한우 특수부위 세트 외 1건', time: '1시간 전', isNew: true, tab: 'order' },
    { title: '[예약] 이영희 님', desc: '10/25 (금) 19:00 - 4명 방문', time: '3시간 전', isNew: false, tab: 'reservation' },
  ];`;

if (c.match(oldRecent)) {
  c = c.replace(oldRecent, newRecent);
}

const oldRecentRender = /<div key=\{i\} className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50\/50 border border-gray-100\/50 hover:bg-gray-50 transition-colors cursor-pointer">/;
const newRecentRender = `<div key={i} onClick={() => setActiveTab(activity.tab)} className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100/50 hover:bg-gray-50 transition-colors cursor-pointer active:scale-[0.99]">`;

if (c.match(oldRecentRender)) {
  c = c.replace(oldRecentRender, newRecentRender);
}

fs.writeFileSync('src/app/components/DashboardWidget.tsx', c);
console.log('Updated recent activities to link to tabs');
