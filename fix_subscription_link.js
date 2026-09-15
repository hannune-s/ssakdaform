const fs = require('fs');

const file = 'src/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/title: '구독 및 결제 관리',\s*desc: '이용권 상태, 카드 변경, 결제 내역',\s*color: 'bg-purple-900'/, `title: '구독 및 결제 관리',
                desc: '이용권 상태, 카드 변경, 결제 내역',
                color: 'bg-purple-900',
                onClick: () => setActiveTab('subscription')`);

fs.writeFileSync(file, c);
console.log('Successfully added onClick to subscription menu');
