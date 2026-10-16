const fs = require('fs');

let content = fs.readFileSync('src/app/components/DashboardWidget.tsx', 'utf8');

// Add recentActivities state
if (!content.includes('const [recentActivities')) {
  content = content.replace(
    /const \[counts, setCounts\] = useState\(\{ delivery: 0, reservation: 0, order: 0, custom: 0 \}\);/,
    `const [counts, setCounts] = useState({ delivery: 0, reservation: 0, order: 0, custom: 0 });\n  const [recentActivities, setRecentActivities] = useState<any[]>([]);`
  );
}

// Modify fetchCounts to also fetch recent activities
const targetFetchEnd = `        setCounts(newCounts);
      }
    }`;

const replacementFetchEnd = `        setCounts(newCounts);
      }

      // 2. Fetch recent 5 activities
      const { data: recentData } = await supabase
        .from('ssakdaform_responses')
        .select('*')
        .order('submitted_at', { ascending: false })
        .limit(5);

      if (recentData) {
        const parsedActivities = recentData.map(row => {
          let type = '간편폼';
          let tab = 'custom';
          let name = '고객 님';
          let desc = '새로운 신청서가 접수되었습니다.';
          
          const d = row.data || {};
          
          const nameKey = Object.keys(d).find(k => k.includes('이름') || k.includes('고객명') || k.includes('예약자'));
          if (nameKey && d[nameKey]) name = \`\${d[nameKey]} 님\`;

          if (row.form_id === 'delivery-preset') {
            type = '택배'; tab = 'delivery';
            if (d['보내는 분 - 이름']) name = \`\${d['보내는 분 - 이름']} 님\`;
            if (d['받는 분 - 주소']) desc = d['받는 분 - 주소'];
          } else if (row.form_id === 'reservation-preset') {
            type = '예약'; tab = 'reservation';
            const date = d['예약 날짜'] || '';
            const time = d['예약 시간'] || '';
            const people = d['방문 인원'] ? \`\${d['방문 인원']}명\` : '';
            desc = [date, time, people].filter(Boolean).join(' - ');
          } else if (row.form_id === 'order-preset') {
            type = '상품'; tab = 'order';
            if (d['상품명']) desc = d['상품명'];
          } else {
            type = '간편폼'; tab = 'custom';
            const descKey = Object.keys(d).find(k => k.includes('상품명') || k.includes('내용') || k.includes('주소'));
            if (descKey && d[descKey]) desc = d[descKey];
          }

          const now = new Date();
          const submitted = new Date(row.submitted_at);
          const diffMs = now.getTime() - submitted.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          let timeStr = '';
          if (diffMins < 60) timeStr = \`\${diffMins || 1}분 전\`;
          else if (diffMins < 24 * 60) timeStr = \`\${Math.floor(diffMins / 60)}시간 전\`;
          else timeStr = \`\${Math.floor(diffMins / (24 * 60))}일 전\`;

          return { type, name, desc, time: timeStr, isNew: diffMins < 24 * 60, tab };
        });
        setRecentActivities(parsedActivities);
      }
    }`;

content = content.replace(targetFetchEnd, replacementFetchEnd);

// Remove the static mock data declaration
const staticRegex = /\s*const recentActivities = \[\s*\{[\s\S]*?\}\s*\];/g;
content = content.replace(staticRegex, '');

// Update render block
const renderRegex = /\{recentActivities\.map\(\(activity, i\) => \(/g;
const newRender = `{recentActivities.length === 0 && (
            <div className="py-10 text-center text-gray-400 text-[13px]">
              최근 들어온 알림이 없습니다.
            </div>
          )}
          {recentActivities.map((activity, i) => (`;
content = content.replace(renderRegex, newRender);

fs.writeFileSync('src/app/components/DashboardWidget.tsx', content);
