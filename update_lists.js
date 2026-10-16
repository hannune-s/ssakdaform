const fs = require('fs');
const path = require('path');

const files = [
  { file: 'src/app/delivery-list/page.tsx', completedLabel: '발송완료' },
  { file: 'src/app/reservation-list/page.tsx', completedLabel: '예약확정' },
  { file: 'src/app/order-list/page.tsx', completedLabel: '발송완료' },
  { file: 'src/app/custom-list/page.tsx', completedLabel: '확인완료' },
];

files.forEach(({ file, completedLabel }) => {
  let content = fs.readFileSync(file, 'utf8');

  // Fix custom-list specific broken toggle logic
  if (file.includes('custom-list')) {
    content = content.replace(/currentStatus === '발송완료' \? '접수대기' : '발송완료'/g, "currentStatus === '확인완료' ? '접수대기' : '확인완료'");
    content = content.replace(/res\.status === '결제완료'/g, "res.status === '확인완료'");
  }

  // 1. Update toggleStatus and add cancelStatus
  const toggleStatusRegex = /const toggleStatus = async \(id: string, currentStatus: string\) => \{[\s\S]*?loadData\(\);\s*\};/;
  
  const newToggleAndCancel = `const toggleStatus = async (id: string, currentStatus: string) => {
    if (currentStatus === '취소됨') return;
    const newStatus = currentStatus === '${completedLabel}' ? '접수대기' : '${completedLabel}';
    await supabase
      .from('ssakdaform_responses')
      .update({ status: newStatus })
      .eq('id', id);
    loadData();
  };

  const cancelStatus = async (id: string) => {
    if (!window.confirm('정말 취소 처리하시겠습니까?')) return;
    await supabase
      .from('ssakdaform_responses')
      .update({ status: '취소됨' })
      .eq('id', id);
    loadData();
  };`;
  
  content = content.replace(toggleStatusRegex, newToggleAndCancel);

  // 2. Update the status TD cell
  // It looks like:
  // <td className="px-4 py-3 align-middle">
  //   <button 
  //     onClick={() => toggleStatus(res.id, res.status)}
  //     className={`...`}
  //     title="..."
  //   >
  //     {isCompleted ? <CheckCircle ... /> : null}
  //     {isCompleted ? '...' : '접수대기'}
  //   </button>
  // </td>
  
  const tdRegex = /<td className="px-4 py-3 align-middle">\s*<button\s*onClick=\{\(\) => toggleStatus\(res\.id, res\.status\)\}[\s\S]*?<\/button>\s*<\/td>/;
  
  const newTd = `<td className="px-4 py-3 align-middle">
                        <div className="flex flex-col gap-1.5 items-start">
                          <button 
                            onClick={() => toggleStatus(res.id, res.status)}
                            className={\`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors \${
                              res.status === '취소됨'
                                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                : isCompleted 
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' 
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                            }\`}
                            title={res.status === '취소됨' ? "취소된 내역입니다" : "상태를 변경하시려면 클릭하세요"}
                          >
                            {res.status === '취소됨' ? <X className="w-3 h-3 mr-1" /> : isCompleted ? <CheckCircle className="w-3 h-3 mr-1" /> : null}
                            {res.status === '취소됨' ? '취소됨' : isCompleted ? '${completedLabel}' : '접수대기'}
                          </button>
                          {res.status !== '취소됨' && (
                            <button onClick={() => cancelStatus(res.id)} className="text-[11px] text-gray-400 hover:text-red-600 font-medium ml-1 transition-colors">
                              취소하기
                            </button>
                          )}
                        </div>
                      </td>`;

  content = content.replace(tdRegex, newTd);

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
});
