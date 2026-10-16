const fs = require('fs');
let content = fs.readFileSync('src/app/preview/page.tsx', 'utf8');

const targetStr = '<form className="space-y-7" onSubmit={(e) => e.preventDefault()}>';
const replacement = `{data.formDescription && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-4 sm:px-5 py-4 shadow-sm">
            <h3 className="font-bold text-amber-900 text-[14px] mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              사장님 안내사항
            </h3>
            <div className="text-[13.5px] text-amber-900/80 leading-relaxed whitespace-pre-wrap">
              {data.formDescription}
            </div>
          </div>
        )}

          <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>`;

content = content.replace(targetStr, replacement);
fs.writeFileSync('src/app/preview/page.tsx', content);
