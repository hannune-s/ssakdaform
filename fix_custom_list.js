const fs = require('fs');
let c = fs.readFileSync('src/app/custom-list/page.tsx', 'utf8');

const regex = /<td className="px-4 py-3 align-middle">\s*<div className="font-bold text-gray-900 text-\[13px\]">\{customerName\}<\/div>\s*<div className="text-\[12\.5px\] font-semibold text-indigo-600 mt-0\.5">\{customerPhone\}<\/div>\s*<\/td>\s*<td className="px-4 py-3 align-middle">\s*<div className="font-bold text-gray-900 text-\[13px\]">\{productName\}<\/div>\s*<div className="text-\[12\.5px\] font-semibold text-indigo-600 mt-0\.5">\{depositorName\}<\/div>\s*<\/td>/g;

const replacement = `<td className="px-4 py-3 align-middle">
                        <div className="font-bold text-gray-900 text-[13px]">{customerName}</div>
                        <div className="text-[11px] font-medium text-gray-400 mt-0.5 truncate max-w-[120px]" title={formTitle}>{formTitle}</div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="text-[12.5px] font-semibold text-indigo-600">{customerPhone}</div>
                      </td>`;

if (c.match(regex)) {
  c = c.replace(regex, replacement);
  fs.writeFileSync('src/app/custom-list/page.tsx', c);
  console.log('Fixed custom-list rows');
} else {
  console.log('Could not match regex');
}
