const fs = require('fs');
const file = 'src/app/form/[id]/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
    `{ id: 8, type: 'textarea', label: '기타 전달하고 싶은 내용', placeholder: '사장님께 전달하실 기타 요청사항을 자유롭게 적어주세요.', required: false }
        ]`,
    `{ id: 8, type: 'textarea', label: '기타 전달하고 싶은 내용', placeholder: '사장님께 전달하실 기타 요청사항을 자유롭게 적어주세요.', required: false },
          { id: 9, type: 'checkbox', label: '[필수] 개인정보 수집 동의', placeholder: '개인정보 수집 및 이용에 동의합니다.', required: true }
        ]`
);

c = c.replace(
    `{ id: 7, type: 'textarea', label: '기타 전달 내용', placeholder: '배송 메시지 등 기타 요청사항을 적어주세요', required: false }
        ]`,
    `{ id: 7, type: 'textarea', label: '기타 전달 내용', placeholder: '배송 메시지 등 기타 요청사항을 적어주세요', required: false },
          { id: 8, type: 'checkbox', label: '[필수] 개인정보 수집 동의', placeholder: '개인정보 수집 및 이용에 동의합니다.', required: true }
        ]`
);

fs.writeFileSync(file, c);
console.log('Added checkbox to delivery and order presets');
