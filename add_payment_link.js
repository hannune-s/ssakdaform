const fs = require('fs');

// 1. Update SettingsPage
const settingsFile = 'src/app/settings/page.tsx';
let settingsContent = fs.readFileSync(settingsFile, 'utf8');

if (!settingsContent.includes('Link as LinkIcon')) {
  settingsContent = settingsContent.replace(
    "import { Save, Plus, Trash2, Building, CreditCard, User, Store, MapPin, Phone, Clock, CalendarX } from 'lucide-react';",
    "import { Save, Plus, Trash2, Building, CreditCard, User, Store, MapPin, Phone, Clock, CalendarX, Link as LinkIcon } from 'lucide-react';"
  );
}

const targetEndStr = `</button>\n              </div>\n            ))}\n          </div>\n        </div>`;
const paymentSettingBlock = `</button>
              </div>
            ))}
          </div>
          
          {/* 비대면 링크 결제 설정 */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">비대면 링크 결제 설정</h2>
            <p className="text-sm text-gray-500 mb-4">고객이 결제할 수 있는 비대면 카드 결제 링크(토스, 페이앱 등)를 입력하세요.</p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">결제 링크 URL</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="url" 
                  value={storeInfo.paymentLink || ''}
                  onChange={(e) => handleStoreChange('paymentLink', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  placeholder="https://toss.me/..."
                />
              </div>
            </div>
          </div>
        </div>`;

if (settingsContent.includes(targetEndStr)) {
  settingsContent = settingsContent.replace(targetEndStr, paymentSettingBlock);
  fs.writeFileSync(settingsFile, settingsContent);
  console.log("Updated SettingsPage");
} else {
  console.log("Could not find the target location in SettingsPage");
}

// 2. Update the View Pages
const viewFiles = [
  'src/app/store/[slug]/page.tsx',
  'src/app/form/[id]/page.tsx',
  'src/app/preview/page.tsx'
];

for (const file of viewFiles) {
  let c = fs.readFileSync(file, 'utf8');

  // Change the account block condition
  const oldCondition = /\{accounts\.length > 0 && \(/g;
  const newCondition = '{(accounts.length > 0 || (storeInfo && storeInfo.paymentLink)) && (';
  c = c.replace(oldCondition, newCondition);

  // If there's an empty account list but a payment link, we might not want the "계좌 안내" header to be incorrect.
  // Actually, let's change the title to "결제 및 계좌 안내"
  c = c.replace(
    '<h2 className="font-bold text-indigo-900 text-[14px]">계좌 안내</h2>',
    '<h2 className="font-bold text-indigo-900 text-[14px]">결제 및 계좌 안내</h2>'
  );

  // Add the payment link UI at the bottom of the block
  const oldClosing = `</button>\n                </div>\n              ))}\n            </div>\n          </div>`;
  // But wait, the rendering might not exactly match this string format.
  // Let's use a regex to find the end of the accounts.map block
  
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
            
  // Find where accounts.map ends. It's usually `))}\n            </div>\n          </div>\n        )}`
  const injectRegex = /\)\)\}\n\s*<\/div>\n\s*<\/div>\n\s*\)\}/g;
  // Oh wait, if there are no accounts, accounts.map won't render anything, but the div wraps it.
  // Let's just find `</div>\n          </div>\n        )}` which closes the `bg-[#F0F4FF]` div.
  
  // The structure is:
  /*
            <div className="space-y-3">
              {accounts.map(...)}
            </div>
          </div>
        )}
  */
  
  const injectionTarget = /<\/div>\s*<\/div>\s*\)\}/;
  if (c.match(injectionTarget)) {
    // We want to insert the paymentLinkUI right before the closing `</div>` of the `bg-[#F0F4FF]` container.
    // So we replace `</div>\n          </div>\n        )}` with `</div>\n ${paymentLinkUI} \n </div>\n )}`
    c = c.replace(
      /<\/div>\s*<\/div>\s*\)\}/,
      `</div>\n            ${paymentLinkUI}\n          </div>\n        )}`
    );
    fs.writeFileSync(file, c);
    console.log(`Updated ${file}`);
  } else {
    console.log(`Could not find injection target in ${file}`);
  }
}
