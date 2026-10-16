const fs = require('fs');
let content = fs.readFileSync('src/app/form/[id]/page.tsx', 'utf8');

// 1. Remove formDescription from the top
const topRegex = /\s*\{data\.formDescription && \([\s\S]*?\{data\.formDescription\}[\s\S]*?<\/div>\s*\)\}/;
content = content.replace(topRegex, '');

// 2. Add it below the accounts block
const targetStr = `          </div>
        )}`;
const replacement = `          </div>
        )}

        {data.formDescription && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-4 sm:px-5 py-4 shadow-sm">
            <h3 className="font-bold text-amber-900 text-[14px] mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              사장님 안내사항
            </h3>
            <div className="text-[13.5px] text-amber-900/80 leading-relaxed whitespace-pre-wrap">
              {data.formDescription}
            </div>
          </div>
        )}`;

content = content.replace(targetStr, replacement);
fs.writeFileSync('src/app/form/[id]/page.tsx', content);
