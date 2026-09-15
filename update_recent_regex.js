const fs = require('fs');

const file = 'src/app/components/DashboardWidget.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const recentActivities = \[[\s\S]*?\];/, `const recentActivities = [
    { type: '택배', name: '홍길동 님', desc: '서울 강남구 테헤란로 123', time: '10분 전', isNew: true, tab: 'delivery' },
    { type: '주문', name: '김철수 님', desc: '한우 특수부위 세트 외 1건', time: '1시간 전', isNew: true, tab: 'order' },
    { type: '예약', name: '이영희 님', desc: '10/25 (금) 19:00 - 4명 방문', time: '3시간 전', isNew: false, tab: 'reservation' },
    { type: '간편폼', name: '박지민 님', desc: '이벤트 참여 신청서', time: '5시간 전', isNew: false, tab: 'custom' }
  ];`);

c = c.replace(/<div className="flex justify-between items-center mb-0\.5">[\s\S]*?<\/div>/, `<div className="flex justify-between items-center mb-0.5 gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={\`px-1.5 py-0.5 rounded text-[10.5px] font-bold shrink-0 \${
                      activity.tab === 'delivery' ? 'bg-blue-50 text-blue-600' :
                      activity.tab === 'order' ? 'bg-purple-50 text-purple-600' :
                      activity.tab === 'reservation' ? 'bg-green-50 text-green-600' :
                      'bg-orange-50 text-orange-600'
                    }\`}>
                      {activity.type}
                    </span>
                    <p className={\`text-[12.5px] sm:text-[13px] font-bold truncate \${activity.isNew ? 'text-gray-900' : 'text-gray-600'}\`}>{activity.name}</p>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-400 whitespace-nowrap shrink-0">{activity.time}</span>
                </div>`);

fs.writeFileSync(file, c);
console.log('Done with regex replacement');
