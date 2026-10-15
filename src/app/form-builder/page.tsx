"use client";
import { getSmartPlaceholder } from "@/lib/formUtils";

import { useState, useEffect } from 'react';
import { X, Eye, Link as LinkIcon, RotateCcw, Copy, Check, Pencil, Trash2, PlusCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getActiveStoreId, getLoggedInStore } from '@/lib/storeSession';

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
  const [savedForms, setSavedForms] = useState<any[]>([]);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [copiedFormId, setCopiedFormId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [fields, setFields] = useState<FormField[]>([
    { id: 1, type: 'text', label: '이름', placeholder: '이름을 입력하세요', required: true }
  ]);

  const syncCustomFormsToDb = async (forms: any[]) => {
    const activeStoreId = getActiveStoreId();
    localStorage.setItem(`ssakdaform_custom_forms_${activeStoreId}`, JSON.stringify(forms));
    localStorage.setItem('ssakdaform_custom_forms', JSON.stringify(forms));
    try {
      await supabase
        .from('ssakdaform_stores')
        .update({ custom_forms: forms })
        .eq('store_id', activeStoreId);
    } catch (e) {
      console.error('Failed to sync custom forms to DB', e);
    }
  };

  // 로컬 스토리지 및 DB에서 초안 및 저장된 폼 목록 불러오기
  useEffect(() => {
    const activeStoreId = getActiveStoreId();
    const loggedIn = getLoggedInStore();
    if (loggedIn?.store_name) {
      setStoreName(loggedIn.store_name);
    }

    const draft = localStorage.getItem(`ssakdaform_draft_${activeStoreId}`) || localStorage.getItem('ssakdaform_draft');
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

    const storedForms = localStorage.getItem(`ssakdaform_custom_forms_${activeStoreId}`) || localStorage.getItem('ssakdaform_custom_forms');
    if (storedForms) {
      try {
        setSavedForms(JSON.parse(storedForms));
      } catch (e) {}
    }

    supabase
      .from('ssakdaform_stores')
      .select('store_name, custom_forms')
      .eq('store_id', activeStoreId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          if (data.store_name && (!draft || storeName === '내 매장 이름')) {
            setStoreName(data.store_name);
          }
          if (Array.isArray(data.custom_forms) && data.custom_forms.length > 0) {
            setSavedForms(data.custom_forms);
            localStorage.setItem(`ssakdaform_custom_forms_${activeStoreId}`, JSON.stringify(data.custom_forms));
            localStorage.setItem('ssakdaform_custom_forms', JSON.stringify(data.custom_forms));
          }
        }
      });

    setIsLoaded(true);
  }, []);

  // 값이 변경될 때마다 로컬 스토리지에 자동 저장 (새로고침 방지)
  useEffect(() => {
    if (isLoaded) {
      const activeStoreId = getActiveStoreId();
      const draftStr = JSON.stringify({
        storeName,
        formTitle,
        formDescription,
        fields
      });
      localStorage.setItem(`ssakdaform_draft_${activeStoreId}`, draftStr);
      localStorage.setItem('ssakdaform_draft', draftStr);
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
    if (window.confirm('작성 중인 폼을 정말 초기화하시겠습니까? (모든 항목이 기본값으로 초기화됩니다)')) {
      const loggedIn = getLoggedInStore();
      setEditingFormId(null);
      setStoreName(loggedIn?.store_name || '내 매장 이름');
      setFormTitle('새로운 맞춤형 신청서');
      setFormDescription('');
      setFields([{ id: Date.now(), type: 'text', label: '이름', placeholder: '이름을 입력하세요', required: true }]);
      setFormKey(prev => prev + 1);
    }
  };

  const handleCancelEdit = () => {
    const loggedIn = getLoggedInStore();
    setEditingFormId(null);
    setStoreName(loggedIn?.store_name || '내 매장 이름');
    setFormTitle('새로운 맞춤형 신청서');
    setFormDescription('');
    setFields([{ id: Date.now(), type: 'text', label: '이름', placeholder: '이름을 입력하세요', required: true }]);
    setFormKey(prev => prev + 1);
  };

  const handleCopyLink = () => {
    const activeStoreId = getActiveStoreId();
    if (editingFormId) {
      const editLink = `${window.location.origin}/form/${editingFormId}?store=${encodeURIComponent(activeStoreId)}`;
      navigator.clipboard.writeText(editLink).then(() => {
        alert(`현재 수정 중인 폼의 고객용 링크가 복사되었습니다!\n\n${editLink}`);
      });
      return;
    }
    alert('먼저 우측의 [폼 저장하기] 버튼을 눌러 폼을 저장하신 후,\n하단 [저장된 맞춤형 폼 관리] 목록에서 개별 [링크 복사] 버튼을 눌러주세요!');
  };

  const handleCopySavedFormLink = (form: any) => {
    const activeStoreId = getActiveStoreId();
    const link = `${window.location.origin}/form/${form.id}?store=${encodeURIComponent(activeStoreId)}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedFormId(form.id);
      setTimeout(() => setCopiedFormId(null), 2000);
      alert(`'${form.formTitle}' 링크가 복사되었습니다!\n원하시는 고객에게 카톡이나 문자로 전달해 보세요.\n\n${link}`);
    });
  };

  const handleEditForm = (form: any) => {
    setEditingFormId(form.id);
    setStoreName(form.storeName || '내 매장 이름');
    setFormTitle(form.formTitle || '');
    setFormDescription(form.formDescription || '');
    setFields(
      form.fields && form.fields.length > 0
        ? form.fields.map((f: any, idx: number) => ({ ...f, id: f.id || Date.now() + idx }))
        : [{ id: Date.now(), type: 'text', label: '이름', placeholder: '이름을 입력하세요', required: true }]
    );
    setFormKey(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteForm = async (id: string) => {
    if (window.confirm('이 폼을 정말 삭제하시겠습니까? 삭제하면 해당 링크로 더 이상 접속할 수 없습니다.')) {
      const updated = savedForms.filter(f => f.id !== id);
      setSavedForms(updated);
      await syncCustomFormsToDb(updated);
      if (editingFormId === id) {
        handleCancelEdit();
      }
    }
  };

  const handleSave = async () => {
    const existingForms = [...savedForms];

    if (editingFormId) {
      // 기존 폼 수정 덮어쓰기 (링크 ID 유지)
      const updatedForms = existingForms.map(f => {
        if (f.id === editingFormId) {
          return {
            ...f,
            storeName,
            formTitle,
            formDescription,
            fields
          };
        }
        return f;
      });
      setSavedForms(updatedForms);
      await syncCustomFormsToDb(updatedForms);
      alert('폼 수정사항이 성공적으로 저장되었습니다!');
    } else {
      // 새 폼 추가
      const newFormData = {
        id: `custom-${Date.now()}`,
        storeName,
        formTitle,
        formDescription,
        fields
      };
      const updatedForms = [...existingForms, newFormData];
      setSavedForms(updatedForms);
      await syncCustomFormsToDb(updatedForms);
      alert('새로운 맞춤형 폼이 저장되었습니다!\n아래 [저장된 맞춤형 폼 관리] 목록에서 링크를 복사해 고객에게 전달해 보세요.');
    }
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
          <p className="text-[13px] text-gray-500">우리 매장에 딱 맞는 신청서를 만들고, 필요한 고객에게만 개별 링크로 전달해보세요.</p>
        </div>
        {editingFormId && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl">
            <span className="text-[12.5px] font-bold text-amber-800 flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5 text-amber-600" />
              기존 폼 수정 중
            </span>
            <button
              onClick={handleCancelEdit}
              className="ml-2 px-2.5 py-1 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 rounded-lg text-[11.5px] font-bold transition-colors flex items-center gap-1"
            >
              <PlusCircle className="w-3 h-3" />
              새 폼 만들기로 전환
            </button>
          </div>
        )}
      </div>

      <div key={formKey} className="flex flex-col lg:flex-row gap-5 lg:gap-6">
        
        {/* 왼쪽: 폼 기본 정보 설정 */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-indigo-50/50 p-4 sm:p-5 rounded-xl border border-indigo-100 shadow-sm">
            <h3 className="font-semibold text-[15px] text-indigo-900 mb-3 border-b border-indigo-100 pb-2">기본 정보 설정</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">폼 제목 (신청서 이름)</label>
                <input 
                  type="text" 
                  defaultValue={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px] bg-white" 
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">사장님 안내글 (고객에게 전달할 내용)</label>
                <textarea 
                  defaultValue={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="예: 주문 전 필독사항, 제작 기간 안내 등을 적어주세요."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px] resize-y bg-white" 
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 입력 항목 리스트 (빌더) */}
        <div className="lg:col-span-2 space-y-3 flex-1">
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
                        defaultValue={field.label}
                        onChange={(e) => updateField(field.id, 'label', e.target.value)}
                        placeholder="예: 연락처"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-[13px] bg-white transition-shadow" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1.5 text-left">안내 문구</label>
                      <input 
                        type="text" 
                        defaultValue={field.placeholder}
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
                  {editingFormId ? '수정사항 저장하기' : '폼 저장하기'}
                </button>
              </div>
            )}
          </div>

          {savedForms.length > 0 && (
            <div className="mt-10 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="mb-4">
                <h3 className="font-extrabold text-gray-900 text-[16px] sm:text-[17px] flex items-center gap-2">
                  <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
                  저장된 맞춤형 폼 관리
                </h3>
                <p className="text-[12.5px] text-gray-500 mt-1">
                  각 폼의 <strong>[바로가기]</strong>로 화면을 확인하거나, <strong>[링크 복사]</strong>를 눌러 원하는 고객에게만 신청서를 보내실 수 있습니다.
                </p>
              </div>
              <div className="space-y-2.5">
                {savedForms.map((form, idx) => {
                  const isEditingThis = editingFormId === form.id;
                  const isCopiedThis = copiedFormId === form.id;
                  return (
                    <div 
                      key={form.id || idx} 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all ${
                        isEditingThis 
                          ? 'bg-amber-50/60 border-amber-300 shadow-sm' 
                          : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-indigo-100 hover:shadow-sm'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-800 text-[14.5px] sm:text-[15px] truncate">{form.formTitle}</h4>
                          {isEditingThis && (
                            <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-200/80 text-amber-900 rounded-md shrink-0">
                              수정 중
                            </span>
                          )}
                        </div>
                        {form.formDescription ? (
                          <p className="text-[12.5px] text-gray-500 mt-0.5 line-clamp-1">{form.formDescription}</p>
                        ) : (
                          <p className="text-[12px] text-gray-400 mt-0.5">입력 항목 {form.fields?.length || 0}개</p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-center">
                        <a
                          href={`/form/${form.id}?store=${encodeURIComponent(getActiveStoreId())}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-[12.5px] font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          바로가기
                        </a>
                        <button 
                          onClick={() => handleCopySavedFormLink(form)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-[12.5px] font-bold rounded-lg transition-colors whitespace-nowrap border ${
                            isCopiedThis
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100'
                          }`}
                        >
                          {isCopiedThis ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {isCopiedThis ? '복사됨' : '링크 복사'}
                        </button>
                        <button 
                          onClick={() => handleEditForm(form)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-[12.5px] font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                        >
                          <Pencil className="w-3.5 h-3.5 text-gray-500" />
                          수정
                        </button>
                        <button 
                          onClick={() => handleDeleteForm(form.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-[12.5px] font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          삭제
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
