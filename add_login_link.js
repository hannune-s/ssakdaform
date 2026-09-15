const fs = require('fs');
const file = 'src/app/signup/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetBlock = `<div className="flex justify-center pt-2">
              <button 
                type="button" 
                onClick={() => window.location.href = '/landing'}
                className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                이전 페이지로 돌아가기
              </button>
            </div>`;

const newBlock = `<div className="pt-4 flex flex-col items-center gap-4">
              <div className="text-sm font-medium text-gray-500">
                이미 계정이 있으신가요?{' '}
                <button 
                  type="button" 
                  onClick={() => window.location.href = '/login'}
                  className="ml-1 text-indigo-600 hover:text-indigo-800 font-extrabold underline underline-offset-2 transition-colors"
                >
                  로그인
                </button>
              </div>
              
              <button 
                type="button" 
                onClick={() => window.location.href = '/landing'}
                className="text-sm font-semibold text-gray-400 hover:text-gray-600 flex items-center gap-1 mt-2"
              >
                <ChevronLeft className="w-4 h-4" />
                홈으로 돌아가기
              </button>
            </div>`;

if (c.includes(targetBlock)) {
    c = c.replace(targetBlock, newBlock);
    fs.writeFileSync(file, c);
    console.log('Successfully updated the footer');
} else {
    console.log('Target block not found');
}
