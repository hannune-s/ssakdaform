const fs = require('fs');
const file = 'src/app/form-builder/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the header bar
const headerRegex = /<div className="flex items-center gap-1\.5 sm:gap-3 bg-gray-50\/80 px-2 sm:px-4 py-2\.5 border-b border-gray-200">[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(headerRegex, '');

// 2. Modify the mapping row
const rowRegex = /<div key=\{field\.id\} className="flex items-center gap-1\.5 sm:gap-3 px-2 sm:px-4 py-2\.5 sm:py-3 group hover:bg-gray-50\/50 transition-colors">[\s\S]*?<button[\s\S]*?onClick=\{\(\) => removeField\(field\.id\)\}[\s\S]*?>[\s\S]*?<\/button>\s*<\/div>/g;

const newRow = `<div key={field.id} className="flex items-end gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 group hover:bg-gray-50/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1.5 text-left">항목 이름</label>
                      <input 
                        type="text" 
                        value={field.label}
                        onChange={(e) => updateField(field.id, 'label', e.target.value)}
                        placeholder="예: 연락처"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px] bg-white transition-shadow" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1.5 text-left">안내 문구</label>
                      <input 
                        type="text" 
                        value={field.placeholder}
                        onChange={(e) => updateField(field.id, 'placeholder', e.target.value)}
                        placeholder="희미하게 보일 문구"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px] bg-white transition-shadow" 
                      />
                    </div>
                    <button 
                      onClick={() => removeField(field.id)}
                      className="w-8 h-8 shrink-0 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mb-0.5"
                      title="삭제"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>`;

if (content.match(rowRegex)) {
  content = content.replace(rowRegex, newRow);
  fs.writeFileSync(file, content);
  console.log('Successfully updated the form-builder fields layout');
} else {
  console.log('Failed to find row regex match in file');
}
