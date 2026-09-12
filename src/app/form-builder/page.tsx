"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, ArrowLeft, Type, Hash, Calendar, Phone, CheckSquare, Link as LinkIcon, RotateCcw } from 'lucide-react';

type FieldType = 'text' | 'number' | 'phone' | 'date' | 'textarea' | 'checkbox';

interface FormField {
  id: number;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
}

export default function FormBuilder() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [storeName, setStoreName] = useState('내 매장 이름');
  const [formTitle, setFormTitle] = useState('새로운 맞춤형 신청서');
  const [fields, setFields] = useState<FormField[]>([
    { id: 1, type: 'text', label: '이름', placeholder: '이름을 입력하세요', required: true }
  ]);

  // 로컬 스토리지에서 자동 저장된 초안 불러오기
  useEffect(() => {
    const draft = localStorage.getItem('ssakdaform_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.storeName) setStoreName(parsed.storeName);
        if (parsed.formTitle) setFormTitle(parsed.formTitle);
        if (parsed.fields && parsed.fields.length > 0) setFields(parsed.fields);
      } catch (e) {
        console.error("Draft parsing error", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 값이 변경될 때마다 로컬 스토리지에 자동 저장 (새로고침 방지)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ssakdaform_draft', JSON.stringify({
        storeName,
        formTitle,
        fields
      }));
    }
  }, [storeName, formTitle, fields, isLoaded]);

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
    localStorage.setItem('ssakdaform_preview', JSON.stringify({ storeName, formTitle, fields }));
    window.open('/preview', '_blank');
  };

  const handleReset = () => {
    if (window.confirm('작성 중인 폼을 정말 초기화하시겠습니까? (모든 항목이 지워집니다)')) {
      setStoreName('내 매장 이름');
      setFormTitle('새로운 맞춤형 신청서');
      setFields([{ id: Date.now(), type: 'text', label: '이름', placeholder: '이름을 입력하세요', required: true }]);
    }
  };

  const handleCopyLink = () => {
    // 향후 실제 DB ID로 대체될 가짜 링크
    const dummyLink = "https://ssakdaform.vercel.app/form/demo-12345";
    navigator.clipboard.writeText(dummyLink).then(() => {
      alert(`고객에게 전송할 폼 링크가 복사되었습니다!\n\n${dummyLink}\n\n(아직 DB 연동 전이라 가상의 링크가 복사됩니다)`);
    });
  };

  const handleSave = () => {
    alert('폼이 성공적으로 저장되었습니다! (추후 데이터베이스와 연동됩니다)');
  };

  if (!isLoaded) {
    return <div className="p-10 text-center text-gray-500">에디터 불러오는 중...</div>;
  }

  // --- 어드민용 '맞춤형 폼 만들기' 화면 ---
  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">맞춤형 폼 만들기</h1>
          <p className="text-gray-500">우리 매장에 딱 맞는 신청서를 직접 만들어보세요.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button 
            onClick={handleReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm"
          >
            <RotateCcw className="w-5 h-5 text-gray-500" />
            초기화
          </button>
          <button 
            onClick={handlePreview}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition shadow-md"
          >
            <Eye className="w-5 h-5" />
            고객화면 미리보기
          </button>
        </div>
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
            <p className="text-sm text-gray-500">고객이 입력할 항목의 이름과 설명을 설정하세요. (자동 저장됨)</p>
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
                  title="삭제"
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
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500 cursor-pointer" 
                      />
                      <span className="text-sm font-medium text-gray-700 select-none">필수 항목으로 설정</span>
                    </label>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {fields.length > 0 && (
            <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3 mt-4 border-t border-gray-200">
              <button 
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium shadow-sm"
              >
                <LinkIcon className="w-5 h-5" />
                고객링크 발행 (복사)
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-sm"
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
