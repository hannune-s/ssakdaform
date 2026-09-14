const fs = require('fs');
let c = fs.readFileSync('src/app/page.tsx', 'utf8');

// The bottom nav always starts with `{/* 앱 하단`
const idx = c.indexOf('{/* 앱 하단');
const top = c.substring(0, idx);
const bottom = c.substring(idx);

// Top should end with:
//         </div>
//
// We want to insert `</div>\n      )}` there.
// Currently it ends with:
//         </div>\n\n      
const trimmedTop = top.trimRight();
// `trimmedTop` now ends with `</div>`.
// We change it to end with `</div>\n      </div>\n      )}\n\n      `

// For the bottom, it's the nav bar + `\n      </div>\n      )}` at the end.
// We remove `</div>\n      )}` from the end of the file.
const newBottom = bottom.replace(/<\/div>\s*<\/div>\s*\)\}\s*$/, "");

// And we also replace 'builder' with 'dashboard' in the newBottom
let fixedBottom = newBottom.replace("setActiveTab('builder')", "setActiveTab('dashboard')");
// And replace the classNames
fixedBottom = fixedBottom.replace(
  "activeTab !== 'my' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'",
  "activeTab !== 'my' && activeTab !== 'account' && activeTab !== 'settings' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'"
);
fixedBottom = fixedBottom.replace(
  "activeTab === 'my' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'",
  "activeTab === 'my' || activeTab === 'account' || activeTab === 'settings' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'"
);

const newC = trimmedTop + "\n      </div>\n      )}\n\n      " + fixedBottom;
fs.writeFileSync('src/app/page.tsx', newC);
console.log("Successfully fixed using slice and dice!");
