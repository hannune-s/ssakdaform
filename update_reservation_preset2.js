const fs = require('fs');
const file = 'src/app/form/[id]/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const startIdx = c.indexOf("id === 'reservation-preset'");
if (startIdx !== -1) {
    const endIdx = c.indexOf("id === 'order-preset'", startIdx);
    if (endIdx !== -1) {
        const replacePortion = c.substring(startIdx, endIdx);
        
        const newPortion = `id === 'reservation-preset') {
      setData({
        storeName: '내 매장 이름 (기본 설정)',
        formTitle: '간편한 매장 예약 신청',
        formDescription: '예약금(10,000원) 입금 확인 후 예약이 확정됩니다.\\n(계좌: OO은행 123-456-7890 싹다폼)\\n\\n[환불 및 노쇼(No-Show) 규정]\\n- 방문 2일 전 취소: 100% 환불\\n- 방문 1일 전 취소: 50% 환불\\n- 당일 취소 및 노쇼: 환불 불가',
        fields: [
          { id: 1, type: 'text', label: '예약자 이름', placeholder: '입금자명과 동일하게 적어주세요', required: true },
          { id: 2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
          { id: 3, type: 'date', label: '예약 날짜', placeholder: '날짜를 선택해주세요', required: true },
          { id: 4, type: 'time', label: '예약 시간', placeholder: '시간을 선택해주세요', required: true },
          { id: 5, type: 'text', label: '방문 인원', placeholder: '예: 성인 2명, 아이 1명', required: true },
          { id: 6, type: 'textarea', label: '예약 목적 / 메뉴 선택 (사장님 선택 옵션)', placeholder: '기념일, 생일, 알러지 여부, 미리 선택할 메뉴 등 자유롭게 적어주세요.', required: false },
          { id: 7, type: 'text', label: '입금자명 (예약금 입금 시)', placeholder: '예약자와 동일하면 비워두세요', required: false },
          { id: 8, type: 'checkbox', label: '[필수] 개인정보 수집 및 노쇼(No-Show) 정책 동의', placeholder: '위 예약금 환불 규정 및 노쇼 정책을 숙지하였으며, 개인정보 수집에 동의합니다.', required: true }
        ]
      });
      return;
    } else if (`;
        
        c = c.replace(replacePortion, newPortion);
        fs.writeFileSync(file, c);
        console.log('Updated preset');
    }
}
