"use client";
import { getSmartPlaceholder } from "@/lib/formUtils";

import { useState, useEffect } from 'react';
import { Plus, X, Eye, ArrowLeft, Type, Hash, Calendar, Phone, CheckSquare, Link as LinkIcon, RotateCcw } from 'lucide-react';

type FieldType = 'text' | 'number' | 'phone' | 'date' | 'time' | 'textarea' | 'checkbox' | 'address';

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
  const [formDescription, setFormDescription] = useState('');
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
        if (parsed.formDescription !== undefined) setFormDescription(parsed.formDescription);
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
  }, [storeName, formTitle, formDescription, fields, isLoaded]);

  const addField = (type: FieldType) => {
    setFields([...fields, { 
      id: Date.now(), 
      type, 
      label: '', 
      placeholder: '', 
      required: true 
    }]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: number, key: keyof FormField, value: any) => {
    setFields(fields.map(f => {
      if (f.id !== id) return f;
      
      const updatedField = { ...f, [key]: value };
      
      // 스마트 감지: 항목 이름(label)을 분석하여 폼 타입 자동 변환
      if (key === 'label' && typeof value === 'string') {
        const text = value.replace(/\s+/g, ''); // 공백 제거 후 검사
        if (text.includes('날짜') || text.includes('방문일') || text.includes('예약일') || text.includes('생일')) {
          updatedField.type = 'date';
        } else if (text.includes('연락처') || text.includes('전화번호') || text.includes('휴대폰') || text.includes('번호')) {
          updatedField.type = 'phone';
        } else if (text.includes('주소')) {
          updatedField.type = 'address';
        } else if (text.includes('시간')) {
          updatedField.type = 'time';
        } else {
          updatedField.type = 'text'; // 기본값
        }
      }
      
      return updatedField;
    }));
  };

  const handlePreview = () => {
    localStorage.setItem('ssakdaform_preview', JSON.stringify({ storeName, formTitle, formDescription, fields }));
    
    // 모바일 크기에 맞춘 팝업창 띄우기 (화면 중앙 정렬)
    const width = 480;
    const height = 850;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    window.open(
      '/preview', 
      'PreviewPopup', 
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );
  };

  const handleReset = () => {
    if (window.confirm('작성 중인 폼을 정말 초기화하시겠습니까? (모든 항목이 지워집니다)')) {
      setStoreName('내 매장 이름');
      setFormTitle('새로운 맞춤형 신청서');
      setFormDescription('');
      setFields([{ id: Date.now(), type: 'text', label: '이름', placeholder: '이름을 입력하세요', required: true }]);
    }
  };

  const handleCopyLink = () => {
    // 향후 실제 DB ID로 대체될 가짜 링크
    const dummyLink = `${window.location.origin}/form/demo-12345`;
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-[19px] md:text-xl font-bold text-gray-900 mb-1">맞춤형 폼 만들기</h1>
          <p className="text-[13px] text-gray-500">우리 매장에 딱 맞는 신청서를 직접 만들어보세요.</p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        
        {/* 왼쪽: 폼 기본 정보 설정 */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-indigo-50/50 p-4 sm:p-5 rounded-xl border border-indigo-100 shadow-sm">
            <h3 className="font-semibold text-[15px] text-indigo-900 mb-3 border-b border-indigo-100 pb-2">기본 정보 설정</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">상호명 (스토어 이름)</label>
                <input 
                  type="text" 
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px]" 
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">폼 제목 (신청서 이름)</label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px]" 
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">사장님 안내글 (고객에게 전달할 내용)</label>
                <textarea 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="예: 주문 전 필독사항, 제작 기간 안내 등을 적어주세요."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px] resize-y" 
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 입력 항목 리스트 (빌더) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm mb-3">
            <h3 className="font-semibold text-[15px] text-gray-800">입력 항목 관리</h3>
            <p className="text-[13px] text-gray-500 mt-1">고객이 입력할 항목의 이름과 설명을 설정하세요.</p>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-[13px] text-gray-500">아직 추가된 입력 칸이 없습니다.<br/>아래의 [새 입력 칸 추가] 버튼을 눌러주세요.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-3">
              
              <div className="divide-y divide-gray-100">
                {fields.map((field) => (
                  <div key={field.id} className="flex items-end gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 group hover:bg-gray-50/50 transition-colors">
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
                        placeholder={getSmartPlaceholder(field.label)}
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
                  </div>
                ))}
              </div>
            </div>
          )}
          
          
          {/* 간단한 칸 추가 버튼 */}
          <button 
            onClick={() => addField('text')}
            className="w-full mt-2 py-3.5 border-2 border-dashed border-indigo-200 bg-indigo-50/50 text-indigo-600 rounded-xl hover:bg-indigo-100 hover:border-indigo-400 transition-all flex items-center justify-center gap-2 font-bold text-[14px]"
          >
            <span className="text-xl leading-none">+</span> 새 입력 칸 추가
          </button>
          
          
          {/* 하단 액션 버튼 그룹 */}
          <div className="pt-6 mt-4 border-t border-gray-200 flex flex-col gap-2.5">
            {/* 윗줄: 보조 액션 (초기화, 미리보기) */}
            <div className="flex flex-row gap-2">
              <button 
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm text-[13px] sm:text-[14px] font-medium"
              >
                <RotateCcw className="w-4 h-4 text-gray-500" />
                초기화
              </button>
              <button 
                onClick={handlePreview}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm text-[13px] sm:text-[14px] font-medium"
              >
                <Eye className="w-4 h-4 text-gray-500" />
                고객화면 미리보기
              </button>
            </div>
            
            {/* 아랫줄: 주요 액션 (링크 복사, 저장) */}
            {fields.length > 0 && (
              <div className="flex flex-row gap-2">
                <button 
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium shadow-sm text-[13px] sm:text-[14px]"
                >
                  <LinkIcon className="w-4 h-4" />
                  고객링크 복사
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm text-[13px] sm:text-[14px]"
                >
                  폼 저장하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
