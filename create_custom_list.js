const fs = require('fs');

const orderListCode = fs.readFileSync('src/app/order-list/page.tsx', 'utf8');

// We replace things to make it CustomList.
let customListCode = orderListCode.replace(/OrderList/g, 'CustomList');
customListCode = customListCode.replace(/상품 주문 현황/g, '맞춤 주문 현황');
customListCode = customListCode.replace(/고객들이 제출한 상품 주문서 리스트입니다./g, '고객들이 제출한 맞춤 폼(설문/주문) 리스트입니다.');

// Fix the Supabase query to load custom forms instead of 'order-preset'
// Instead of `.eq('form_id', 'order-preset')`, we do `.not('form_id', 'in', '("delivery-preset","reservation-preset","order-preset")')`
customListCode = customListCode.replace(
  /\.eq\('form_id', 'order-preset'\)/g,
  `.not('form_id', 'in', '("delivery-preset","reservation-preset","order-preset")')`
);

// We need to change the table headers.
// OrderList headers were: 주문일시, 주문자 (이름/연락처), 주문상품 (상품명/입금자명), 진행상태
// User wants: 접수일시, 이름, 연락처, 상태, 상세내용
const oldTheadRegex = /<thead[\s\S]*?<\/thead>/;
const newThead = `<thead className="bg-indigo-50/50 border-y border-indigo-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-[12px] font-extrabold text-gray-500 tracking-wider">접수일시</th>
                    <th className="px-4 py-3 text-left text-[12px] font-extrabold text-gray-500 tracking-wider">이름 / 폼 종류</th>
                    <th className="px-4 py-3 text-left text-[12px] font-extrabold text-gray-500 tracking-wider">연락처</th>
                    <th className="px-4 py-3 text-center text-[12px] font-extrabold text-gray-500 tracking-wider">진행상태</th>
                    <th className="px-4 py-3 text-center text-[12px] font-extrabold text-gray-500 tracking-wider">상세보기</th>
                  </tr>
                </thead>`;

customListCode = customListCode.replace(oldTheadRegex, newThead);

// Fix the empty state icon/text
customListCode = customListCode.replace(
  /<ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" \/>/g,
  `<FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />`
);
customListCode = customListCode.replace(/아직 접수된 주문이 없습니다/g, '아직 접수된 맞춤 주문이 없습니다');

// Fix the rows
// OrderList extracts: customerName, customerPhone, productName, depositorName
// For CustomList, we want to extract: name, phone, formTitle
// Then display them.
const oldRowExtractionRegex = /const customerName =[\s\S]*?const depositorName = [^\n]*;/;
const newRowExtraction = `
                      // Extract dynamic fields (name, phone, form name)
                      let customerName = '-';
                      let customerPhone = '-';
                      let formTitle = res.form_id || '맞춤 폼'; // we might not have the form title easily available if it's a UUID, but we can try to find it in data.
                      
                      const dataEntries = Object.entries(res.data || {});
                      for (const [k, v] of dataEntries) {
                        if (k.includes('이름') || k.includes('성함')) customerName = String(v);
                        if (k.includes('연락처') || k.includes('전화번호') || k.includes('휴대폰')) customerPhone = String(v);
                        if (k === 'formTitle') formTitle = String(v);
                      }
                      
                      // If name/phone still '-', use the first two fields
                      if (customerName === '-' && dataEntries.length > 0) {
                        if (dataEntries[0][0] !== 'formTitle') customerName = String(dataEntries[0][1]);
                      }
`;
customListCode = customListCode.replace(oldRowExtractionRegex, newRowExtraction);

// Fix the tr body
const oldTrBodyRegex = /<td className="px-4 py-3 align-middle">[\s\S]*?<\/td>[\s\S]*?<td className="px-4 py-3 align-middle">[\s\S]*?<\/td>[\s\S]*?<td className="px-4 py-3 align-middle">[\s\S]*?<\/td>[\s\S]*?<td className="px-4 py-3 align-middle">[\s\S]*?<\/td>[\s\S]*?<td className="px-4 py-3 align-middle text-right">[\s\S]*?<\/td>/;
const newTrBody = `<td className="px-4 py-3 align-middle">
                          <div className="font-semibold text-gray-900 text-[13px]">
                            {new Date(res.submitted_at).toLocaleDateString('ko-KR')}
                          </div>
                          <div className="text-[12.5px] font-semibold text-indigo-600 mt-0.5">
                            {new Date(res.submitted_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <div className="font-bold text-gray-900 text-[13px]">{customerName}</div>
                          <div className="text-[11px] font-medium text-gray-400 mt-0.5 truncate max-w-[120px]" title={formTitle}>{formTitle}</div>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <div className="font-bold text-gray-900 text-[13px]">{customerPhone}</div>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <button 
                            onClick={() => toggleStatus(res.id, res.status)}
                            className={\`mx-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all active:scale-95 \${
                              res.status === '완료' || res.status === '발송완료' || res.status === '입금확인'
                                ? 'bg-indigo-50 text-indigo-700' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }\`}
                          >
                            {(res.status === '완료' || res.status === '발송완료' || res.status === '입금확인') && <CheckCircle className="w-3.5 h-3.5" />}
                            {res.status || '접수됨'}
                          </button>
                        </td>
                        <td className="px-4 py-3 align-middle text-right">
                          <button 
                            onClick={() => setSelectedResponse(res)}
                            className="inline-flex items-center justify-center p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors active:scale-95"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </td>`;
customListCode = customListCode.replace(oldTrBodyRegex, newTrBody);

// Make sure FileText is imported
if (!customListCode.includes('FileText')) {
  customListCode = customListCode.replace(/import \{ Package, ShoppingCart/g, 'import { Package, ShoppingCart, FileText');
}

fs.writeFileSync('src/app/custom-list/page.tsx', customListCode);
console.log('Created CustomList component');
