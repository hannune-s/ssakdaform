"use client";

import { useState } from 'react';
import { Plus, Trash2, Eye, ArrowLeft, Type, Hash, Calendar, Phone, CheckSquare } from 'lucide-react';

type FieldType = 'text' | 'number' | 'phone' | 'date' | 'textarea' | 'checkbox';

interface FormField {
  id: number;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
}

export default function FormBuilder() {
  const [storeName, setStoreName] = useState('내 매장 이름');
  const [formTitle, setFormTitle] = useState('새로운 맞춤형 신청서');
  const [fields, setFields] = useState<FormField[]>([
    { id: 1, type: 'text', label: '이름', placeholder: '이름을 입력하세요', required: true }
  ]);

  const addField = (type: FieldType) => {
    setFields([...fields, { 
      id: Date.now(), 
      type, 
      label: '', 
      placeholder: '', 
      required: false 
    }]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: number, key: keyof FormField, value: any) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const handlePreview = () => {
    // 미리보기 데이터를 로컬 스토리지에 임시 저장하고 새 창 열기
    localStorage.setItem('ssakdaform_preview', JSON.stringify({
      storeName,
      formTitle,
      fields
    }));
    window.open('/preview', '_blank');
  };

  // --- 어드민용 '맞춤형 폼 만들기' 화면 ---
  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">맞춤형 폼 만들기</h1>
          <p className="text-gray-500">우리 매장에 딱 맞는 신청서를 직접 만들어보세요.</p>
        </div>
        <button 
          onClick={handlePreview}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition shadow-md"
        >
          <Eye className="w-5 h-5" />
          새 창에서 미리보기
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 왼쪽: 폼 기본 정보 설정 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">기본 정보 설정</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상호명 (스토어 이름)</label>
                <input 
                  type="text" 
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">폼 제목 (신청서 이름)</label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">항목 추가하기</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => addField('text')} className="flex items-center justify-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition">
                <Type className="w-4 h-4" /> 텍스트
              </button>
              <button onClick={() => addField('number')} className="flex items-center justify-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition">
                <Hash className="w-4 h-4" /> 숫자
              </button>
              <button onClick={() => addField('phone')} className="flex items-center justify-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition">
                <Phone className="w-4 h-4" /> 연락처
              </button>
              <button onClick={() => addField('date')} className="flex items-center justify-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition">
                <Calendar className="w-4 h-4" /> 날짜
              </button>
              <button onClick={() => addField('textarea')} className="flex items-center justify-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition col-span-2">
                <Type className="w-4 h-4" /> 장문 텍스트
              </button>
              <button onClick={() => addField('checkbox')} className="flex items-center justify-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition col-span-2">
                <CheckSquare className="w-4 h-4" /> 체크박스(동의)
              </button>
            </div>
          </div>
        </div>

        {/* 오른쪽: 폼 항목 리스트 (빌더) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-4">
            <h3 className="font-semibold text-gray-800">입력 항목 관리</h3>
            <p className="text-sm text-gray-500">고객이 입력할 항목의 이름과 설명을 설정하세요.</p>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500">아직 추가된 항목이 없습니다.<br/>왼쪽 메뉴에서 항목을 추가해주세요.</p>
            </div>
          ) : (
            fields.map((field, index) => (
              <div key={field.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative group">
                <div className="absolute -left-3 -top-3 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                  {index + 1}
                </div>
                
                <button 
                  onClick={() => removeField(field.id)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">항목 이름 (Label)</label>
                    <input 
                      type="text" 
                      value={field.label}
                      onChange={(e) => updateField(field.id, 'label', e.target.value)}
                      placeholder="예: 연락처, 방문일자 등"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">안내 문구 (Placeholder)</label>
                    <input 
                      type="text" 
                      value={field.placeholder}
                      onChange={(e) => updateField(field.id, 'placeholder', e.target.value)}
                      placeholder="입력칸 안에 희미하게 보일 문구"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" 
                    />
                  </div>
                  
                  <div className="md:col-span-2 flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200 uppercase tracking-wider">
                        {field.type}
                      </span>
                      <span className="text-sm text-gray-600">입력 타입</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={field.required}
                        onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500" 
                      />
                      <span className="text-sm font-medium text-gray-700">필수 항목으로 설정</span>
                    </label>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {fields.length > 0 && (
            <div className="pt-4 flex justify-end">
              <button 
                onClick={() => alert('폼이 성공적으로 저장되었습니다! (추후 데이터베이스와 연동됩니다)')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
              >
                폼 저장하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
