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
        fields: [
          { id: 1, type: 'text', label: '예약자 이름', placeholder: '이름을 입력하세요', required: true },
          { id: 2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
          { id: 3, type: 'date', label: '예약 날짜', placeholder: '날짜를 선택해주세요', required: true },
          { id: 4, type: 'time', label: '예약 시간', placeholder: '시간을 선택해주세요', required: true },
          { id: 5, type: 'text', label: '방문 인원', placeholder: '예: 성인 2명, 아이 1명', required: true },
          { id: 6, type: 'textarea', label: '기타 전달하고 싶은 내용', placeholder: '매장에 미리 요청하실 사항이나 알러지 정보 등을 자유롭게 적어주세요.', required: false },
          { id: 7, type: 'checkbox', label: '[필수] 개인정보 수집 동의', placeholder: '개인정보 수집 및 이용에 동의합니다.', required: true }
        ]
      });
      return;
    } else if (`;
        
        c = c.replace(replacePortion, newPortion);
        fs.writeFileSync(file, c);
        console.log('Restored preset and added only privacy checkbox');
    }
}
