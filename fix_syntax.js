const fs = require('fs');

let page = fs.readFileSync('src/app/form-builder/page.tsx', 'utf8');

// I need to find the end of the file:
//       )}
// 
//     </div>
//   );
// }

// And replace it with:
//       )}
//       </div>
//       </div>
//     </div>
//   );
// }

const regex = /      \)\}\r?\n\r?\n    <\/div>\r?\n  \);\r?\n\}/;
if (regex.test(page)) {
  page = page.replace(regex, "      )}\n      </div>\n      </div>\n    </div>\n  );\n}");
  fs.writeFileSync('src/app/form-builder/page.tsx', page);
  console.log('Fixed syntax error!');
} else {
  console.log('Regex did not match for fixing syntax error');
}
