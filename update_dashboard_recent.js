const fs = require('fs');
const file = 'src/app/components/DashboardWidget.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Remove "전체보기" button
const viewAllRegex = /<button className="text-\[11px\] sm:text-\[12px\] text-gray-500 font-medium flex items-center hover:text-gray-900">[\s\S]*?전체보기 <ChevronRight className="w-3 h-3 ml-0\.5" \/>[\s\S]*?<\/button>/;
c = c.replace(viewAllRegex, '');

// 2. Add 5th dummy item to recentActivities
const listRegex = /const recentActivities = \[[\s\S]*?\];/;
const newList = `const recentActivities = [
    { type: '택배', name: '홍길동 님', desc: '서울 강남구 테헤란로 123', time: '10분 전', isNew: true, tab: 'delivery' },
    { type: '상품', name: '김철수 님', desc: '한우 특수부위 세트 외 1건', time: '1시간 전', isNew: true, tab: 'order' },
    { type: '예약', name: '이영희 님', desc: '10/25 (금) 19:00 - 4명 방문', time: '3시간 전', isNew: false, tab: 'reservation' },
    { type: '간편폼', name: '박지민 님', desc: '이벤트 참여 신청서', time: '5시간 전', isNew: false, tab: 'custom' },
    { type: '택배', name: '이순신 님', desc: '제주 서귀포시 중문관광로 72', time: '6시간 전', isNew: false, tab: 'delivery' }
  ];`;

c = c.replace(listRegex, newList);

fs.writeFileSync(file, c);
console.log('Successfully updated DashboardWidget');
