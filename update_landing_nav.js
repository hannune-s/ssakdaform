const fs = require('fs');
const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const target = `<Link 
            href="/demo"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors"
          >
            어드민으로 이동
          </Link>`;
          
const newStr = `<div className="flex items-center gap-2 sm:gap-3">
            <Link 
              href="/"
              className="text-sm font-bold text-gray-600 hover:text-gray-900 px-2 py-2 transition-colors"
            >
              로그인
            </Link>
            <Link 
              href="/signup"
              className="text-[13px] sm:text-sm font-bold text-white hover:text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors shadow-sm"
            >
              회원가입
            </Link>
          </div>`;

if (c.includes(target)) {
  c = c.replace(target, newStr);
  fs.writeFileSync(file, c);
  console.log('Successfully updated landing nav buttons');
} else {
  console.log('Target not found, trying normalized search...');
  const normalizedC = c.replace(/\\r\\n/g, '\\n');
  const normalizedTarget = target.replace(/\\r\\n/g, '\\n');
  if (normalizedC.includes(normalizedTarget)) {
    c = normalizedC.replace(normalizedTarget, newStr);
    fs.writeFileSync(file, c);
    console.log('Successfully updated landing nav buttons (normalized)');
  } else {
    console.log('Still not found. Need manual replace.');
  }
}
