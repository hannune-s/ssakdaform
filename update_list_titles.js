const fs = require('fs');

function replaceInFile(path, replacements) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    for (const [oldText, newText] of replacements) {
        content = content.replace(new RegExp(oldText, 'g'), newText);
    }
    fs.writeFileSync(path, content);
}

replaceInFile('src/app/custom-list/page.tsx', [
    ['맞춤 주문 현황', '간편폼접수'],
    ['고객들이 제출한 맞춤 폼', '고객들이 제출한 간편폼']
]);

replaceInFile('src/app/order-list/page.tsx', [
    ['상품 주문 현황', '상품접수']
]);

replaceInFile('src/app/delivery-list/page.tsx', [
    ['택배 신청 현황', '택배접수']
]);

replaceInFile('src/app/reservation-list/page.tsx', [
    ['매장 예약 현황', '예약접수']
]);

console.log('Updated list titles');
