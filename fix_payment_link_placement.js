const fs = require('fs');

const paymentLinkUI = `{storeInfo && storeInfo.paymentLink && (
              <div className="mt-4 pt-4 border-t border-indigo-200/50">
                <h3 className="text-[12px] font-bold text-indigo-900 mb-2">비대면 카드 결제</h3>
                <a 
                  href={storeInfo.paymentLink.startsWith('http') ? storeInfo.paymentLink : \`https://\${storeInfo.paymentLink}\`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors text-[14px] shadow-sm active:scale-[0.98]"
                >
                  <CreditCard className="w-4 h-4" />
                  결제하러 가기
                </a>
              </div>
            )}`;

const files = [
  'src/app/store/[slug]/page.tsx',
  'src/app/form/[id]/page.tsx',
  'src/app/preview/page.tsx'
];

for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');

  // 1. Remove the misplaced block and restore the original closing tags
  const badRegex = /\{\s*storeInfo\.name\s*\}\s*<\/div>\n\s*\{\s*storeInfo\s*&&\s*storeInfo\.paymentLink\s*&&\s*\([\s\S]*?결제하러 가기\s*<\/a>\s*<\/div>\s*\)\}\s*<\/div>\s*\)\}/;
  
  if (c.match(badRegex)) {
    c = c.replace(badRegex, `{storeInfo.name}</div>\n                  </div>\n                )}`);
  } else {
    // If it's already fixed or not matched, let's try a simpler one just in case
    const badRegex2 = /\{\s*storeInfo\.name\s*\}\s*<\/div>\r?\n\s*\{\s*storeInfo\s*&&\s*storeInfo\.paymentLink\s*&&\s*\([\s\S]*?결제하러 가기\s*<\/a>\r?\n\s*<\/div>\r?\n\s*\)\}\r?\n\s*<\/div>\r?\n\s*\)\}/;
    if (c.match(badRegex2)) {
      c = c.replace(badRegex2, `{storeInfo.name}</div>\n                  </div>\n                )}`);
    }
  }

  // 2. Insert paymentLinkUI correctly inside the accounts block.
  // The accounts block looks like:
  /*
            <div className="space-y-3">
              {accounts.map((acc, idx) => (
                ...
              ))}
            </div>
          </div>
        )}
  */
  // We want to insert it right before the last `</div>` of the `bg-[#F0F4FF]` wrapper.
  // A safe way is to find `{accounts.map` block end.
  const accountsMapEndRegex = /\)\)\}\n\s*<\/div>\n\s*<\/div>\n\s*\)\}/;
  if (c.match(accountsMapEndRegex)) {
    c = c.replace(
      accountsMapEndRegex,
      `))}\n            </div>\n            ${paymentLinkUI}\n          </div>\n        )}`
    );
  } else {
    // Try with \r\n
    const accountsMapEndRegex2 = /\)\)\}\r?\n\s*<\/div>\r?\n\s*<\/div>\r?\n\s*\)\}/;
    if (c.match(accountsMapEndRegex2)) {
      c = c.replace(
        accountsMapEndRegex2,
        `))}\n            </div>\n            ${paymentLinkUI}\n          </div>\n        )}`
      );
    }
  }

  fs.writeFileSync(file, c);
  console.log(`Fixed ${file}`);
}
