const fs = require('fs');
let c = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Change builder to dashboard in bottom nav
c = c.replace(
  "onClick={() => setActiveTab('builder')}",
  "onClick={() => setActiveTab('dashboard')}"
);

// 2. Change the text colors for bottom nav so it works properly
c = c.replace(
  "${activeTab !== 'my' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}",
  "${activeTab !== 'my' && activeTab !== 'account' && activeTab !== 'settings' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}"
);
c = c.replace(
  "${activeTab === 'my' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}",
  "${activeTab === 'my' || activeTab === 'account' || activeTab === 'settings' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}"
);

// 3. Move the closing tags.
// Right now, it's:
//       </div>
//       
//       </div>
//       )}
// Let's replace the one right after the bottom nav div with just `</div>`
// Wait, the bottom nav div ends with `</div>`.
// Then we have `\n      \n      </div>\n      )}`
// Let's just find that sequence and replace it.
const endSeq = `</div>
      
      </div>
      )}`;

const newEndSeq = `</div>`;

if (c.includes(endSeq)) {
  c = c.replace(endSeq, newEndSeq);
  // Now we need to insert `</div>\n      )}` BEFORE `{/* 앱 하단 네비게이션 바 (홈 / 마이) */}`
  c = c.replace(
    "{/* 앱 하단 네비게이션 바 (홈 / 마이) */}",
    "</div>\n      )}\n\n      {/* 앱 하단 네비게이션 바 (홈 / 마이) */}"
  );
  fs.writeFileSync('src/app/page.tsx', c);
  console.log("Fixed everything using simple string replacement!");
} else {
  console.log("Could not find endSeq");
}
