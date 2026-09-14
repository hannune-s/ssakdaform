const fs = require('fs');

// 1. Fix CustomList Grouping
let c = fs.readFileSync('src/app/custom-list/page.tsx', 'utf8');

const oldGroupingRegex = /const orderEntries = [\s\S]*?const otherEntries = [^\n]*;/;
const newGrouping = `const customerEntries = dataEntries.filter(([k]) => k.includes('고객') || k.includes('이름') || k.includes('성함') || k.includes('연락처') || k.includes('전화번호') || k.includes('휴대폰') || k.includes('주소'));
                    const otherEntries = dataEntries.filter(([k]) => !customerEntries.some(e => e[0] === k));`;

if (c.match(oldGroupingRegex)) {
  c = c.replace(oldGroupingRegex, newGrouping);
}

// And change the rendering of sections
// The render was:
// {renderSection("주문 정보", orderEntries, true)}
// {renderSection("고객 정보", customerEntries, false)}
// {renderSection("기타 요청사항", otherEntries, false)}
const oldRenderCallsRegex = /\{renderSection\("주문 정보", orderEntries, true\)\}\s*\{renderSection\("고객 정보", customerEntries, false\)\}\s*\{renderSection\("기타 요청사항", otherEntries, false\)\}/;
const newRenderCalls = `{renderSection("고객 정보", customerEntries, true)}
                    {renderSection("상세 입력 내용", otherEntries, false)}`;

if (c.match(oldRenderCallsRegex)) {
  c = c.replace(oldRenderCallsRegex, newRenderCalls);
}

fs.writeFileSync('src/app/custom-list/page.tsx', c);
console.log('Fixed CustomList grouping');


// 2. Fix DashboardWidget to fetch real counts
let d = fs.readFileSync('src/app/components/DashboardWidget.tsx', 'utf8');

// Add imports
if (!d.includes("import { useEffect, useState } from 'react';")) {
  d = d.replace('"use client";', '"use client";\n\nimport { useEffect, useState } from \'react\';\nimport { supabase } from \'@/lib/supabase\';');
}

// Update the component to use state for counts
const oldStatsRegex = /\/\/ Demo data for today\s*const stats = \[[\s\S]*?\];/;
const newStatsLogic = `const [counts, setCounts] = useState({ delivery: 0, reservation: 0, order: 0, custom: 0 });

  useEffect(() => {
    async function fetchCounts() {
      // Get today's start and end in local time
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfDay = today.toISOString();
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const endOfDay = tomorrow.toISOString();

      const { data, error } = await supabase
        .from('ssakdaform_responses')
        .select('form_id')
        .gte('submitted_at', startOfDay)
        .lt('submitted_at', endOfDay);
      
      if (data) {
        const newCounts = { delivery: 0, reservation: 0, order: 0, custom: 0 };
        data.forEach(row => {
          if (row.form_id === 'delivery-preset') newCounts.delivery++;
          else if (row.form_id === 'reservation-preset') newCounts.reservation++;
          else if (row.form_id === 'order-preset') newCounts.order++;
          else newCounts.custom++;
        });
        setCounts(newCounts);
      }
    }
    fetchCounts();
  }, []);

  const stats = [
    { id: 'delivery', name: '택배', count: counts.delivery, newCount: 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { id: 'reservation', name: '예약', count: counts.reservation, newCount: 0, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { id: 'order', name: '주문', count: counts.order, newCount: 0, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { id: 'custom', name: '맞춤', count: counts.custom, newCount: 0, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' }
  ];`;

if (d.match(oldStatsRegex)) {
  d = d.replace(oldStatsRegex, newStatsLogic);
}

fs.writeFileSync('src/app/components/DashboardWidget.tsx', d);
console.log('Fixed DashboardWidget counts');
