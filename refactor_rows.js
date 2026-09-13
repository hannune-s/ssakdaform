const fs = require('fs');

let formBuilder = fs.readFileSync('src/app/form-builder/page.tsx', 'utf8');

// 1. Add X icon to imports
formBuilder = formBuilder.replace(/Trash2/, 'Trash2, X');

// 2. Change addField to make required: true
formBuilder = formBuilder.replace(/required: false/, 'required: true');

// 3. Replace the entire fields rendering logic
// From {fields.length === 0 ? to the end of the mapping (before '간단한 항목 추가 버튼' or save buttons)
const oldMappingRegex = /\{fields\.length === 0 \? \([\s\S]*?\}\)\s*\)/;

const newMapping = `{fields.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-[13px] text-gray-500">아직 추가된 입력 칸이 없습니다.<br/>아래의 [새 입력 칸 추가] 버튼을 눌러주세요.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-3">
              <div className="flex items-center gap-3 bg-gray-50/80 px-4 py-2.5 border-b border-gray-200">
                <div className="flex-1 text-[12px] font-semibold text-gray-600 text-center">항목 이름</div>
                <div className="flex-1 text-[12px] font-semibold text-gray-600 text-center">안내 문구</div>
                <div className="w-8"></div>
              </div>
              <div className="divide-y divide-gray-100">
                {fields.map((field) => (
                  <div key={field.id} className="flex items-center gap-3 px-4 py-3 group hover:bg-gray-50/50 transition-colors">
                    <input 
                      type="text" 
                      value={field.label}
                      onChange={(e) => updateField(field.id, 'label', e.target.value)}
                      placeholder="예: 연락처"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px] bg-white transition-shadow" 
                    />
                    <input 
                      type="text" 
                      value={field.placeholder}
                      onChange={(e) => updateField(field.id, 'placeholder', e.target.value)}
                      placeholder="희미하게 보일 문구"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px] bg-white transition-shadow" 
                    />
                    <button 
                      onClick={() => removeField(field.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="삭제"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}`;

formBuilder = formBuilder.replace(oldMappingRegex, newMapping);

fs.writeFileSync('src/app/form-builder/page.tsx', formBuilder);
