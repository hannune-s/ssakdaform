const fs = require('fs');
const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetStr = `<h3 className="text-xl font-bold text-gray-900 mb-3">계좌번호 무한 추가 & 결제 링크 연동</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                입금 받을 계좌가 여러 개인가요? 싹다폼에서는 필요한 만큼 계좌번호를 등록하고, 토스나 카카오페이 등 간편 송금 링크까지 연동할 수 있어 폼 하나로 결제 안내까지 깔끔하게 끝납니다.
              </p>`;

const newStr = `<h3 className="text-xl font-bold text-gray-900 mb-3">계좌번호 무한 추가</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                입금 받을 계좌가 여러 개인가요? 싹다폼에서는 필요한 만큼 계좌번호를 무제한으로 등록할 수 있어, 폼 하나로 복잡한 입금 안내까지 깔끔하게 끝납니다.
              </p>`;

if (c.includes(targetStr)) {
    c = c.replace(targetStr, newStr);
    fs.writeFileSync(file, c);
    console.log('Successfully updated landing page text');
} else {
    console.log('Target string not found');
}
