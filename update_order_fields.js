const fs = require('fs');

const file = 'src/app/form/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /fields:\s*\[\s*\{\s*id:\s*1,\s*type:\s*'date'[\s\S]*?id:\s*6,\s*type:\s*'textarea'[\s\S]*?\}\s*\]/;

const replacement = `fields: [
          { id: 1, type: 'date', label: '주문 날짜', defaultValue: todayStr, required: true },
          { id: 2, type: 'textarea', label: '상품명', placeholder: '주문하실 상품명, 수량, 옵션 등을 자유롭게 적어주세요', required: true },
          { id: 3, type: 'text', label: '고객명', placeholder: '주문자 성함을 입력하세요', required: true },
          { id: 4, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
          { id: 5, type: 'address', label: '배송지 주소', placeholder: '클릭하여 배송지 검색', required: true },
          { id: 6, type: 'text', label: '입금자명', placeholder: '입금하실 분의 성함을 입력하세요', required: true },
          { id: 7, type: 'textarea', label: '기타 전달 내용', placeholder: '배송 메시지 등 기타 요청사항을 적어주세요', required: false }
        ]`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Successfully updated order-preset fields');
} else {
    console.log('Failed to find regex match in file');
}
