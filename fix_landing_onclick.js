const fs = require('fs');
const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const target1 = `<button 
                onClick={() => window.location.href = '/signup'}
                className="w-full py-4 sm:py-5 rounded-2xl font-black text-white text-lg bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-[0.98]"
              >
                월간 플랜으로 시작하기
              </button>`;
const repl1 = `<a 
                href="/signup"
                className="block text-center w-full py-4 sm:py-5 rounded-2xl font-black text-white text-lg bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-[0.98]"
              >
                월간 플랜으로 시작하기
              </a>`;

const target2 = `<button 
                onClick={() => window.location.href = '/signup'}
                className="w-full py-4 rounded-2xl font-bold text-gray-700 text-lg bg-gray-50 border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all active:scale-[0.98]"
              >
                연간 플랜으로 혜택받기
              </button>`;
const repl2 = `<a 
                href="/signup"
                className="block text-center w-full py-4 rounded-2xl font-bold text-gray-700 text-lg bg-gray-50 border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all active:scale-[0.98]"
              >
                연간 플랜으로 혜택받기
              </a>`;

c = c.replace(target1, repl1);
c = c.replace(target2, repl2);

fs.writeFileSync(file, c);
console.log('Successfully replaced buttons with anchor tags');
