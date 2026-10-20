"use client";

import { useEffect, useState } from 'react';
import { UserCheck, X, Printer, Check, User, Download, FileText, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getEffectiveAdminStoreId } from '@/lib/storeSession';

export default function ResumeList({ searchQuery = '' }: { searchQuery?: string }) {
  const [responses, setResponses] = useState<any[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [memoInputs, setMemoInputs] = useState<Record<string, string>>({});
  const [savedMemoId, setSavedMemoId] = useState<string | null>(null);

  const filteredResponses = responses.filter(res => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    // Base64 이미지 데이터는 제외하고 텍스트 필드만 검색
    const searchableObj: Record<string, any> = {};
    Object.entries(res.data || {}).forEach(([k, v]) => {
      if (typeof v === 'string' && !v.startsWith('data:')) {
        searchableObj[k] = v;
      }
    });
    const dataStr = JSON.stringify(searchableObj).toLowerCase();
    return dataStr.includes(q);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const paginatedResponses = filteredResponses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data, error } = await supabase
      .from('ssakdaform_responses')
      .select('*')
      .eq('store_id', getEffectiveAdminStoreId())
      .eq('form_id', 'resume-preset')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Load Data Error:', error);
      alert('이력서 목록 불러오기 실패: ' + error.message);
    }

    if (data) {
      setResponses(data);
      const initialMemos: Record<string, string> = {};
      data.forEach(r => {
        initialMemos[r.id] = r.data?._adminMemo || '';
      });
      setMemoInputs(initialMemos);
    }
  };

  const handleSaveMemo = async (res: any, customMemo?: string) => {
    const newMemo = customMemo !== undefined ? customMemo : (memoInputs[res.id] ?? '');
    const updatedData = {
      ...(res.data || {}),
      _adminMemo: newMemo
    };

    const { error } = await supabase
      .from('ssakdaform_responses')
      .update({ data: updatedData })
      .eq('id', res.id);

    if (error) {
      alert('메모 저장 실패: ' + error.message);
      return;
    }

    setResponses(prev => prev.map(item => (item.id === res.id ? { ...item, data: updatedData } : item)));
    if (selectedResponse && selectedResponse.id === res.id) {
      setSelectedResponse((prev: any) => (prev ? { ...prev, data: updatedData } : null));
    }
    setSavedMemoId(res.id);
    setTimeout(() => {
      setSavedMemoId(prev => (prev === res.id ? null : prev));
    }, 1800);
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm('이 내역을 목록에서 완전히 삭제하시겠습니까?\n(삭제 후에는 복구할 수 없습니다)')) return;
    await supabase
      .from('ssakdaform_responses')
      .delete()
      .eq('id', id);
    loadData();
  };

  const openDetails = (res: any) => {
    setSelectedResponse(res);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 print:pb-0">
      <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-3 no-print">
        <div>
          <h1 className="text-[19px] md:text-xl font-bold text-gray-900 mb-1">이력서접수 (직원채용)</h1>
          <p className="text-[13px] text-gray-500">지원자들이 제출한 간편 이력서 리스트입니다. 비고란에 면접 일정이나 근무 특이사항을 자유롭게 메모해보세요.</p>
        </div>
      </div>

      {/* 리스트 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px] no-print">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-indigo-50/70 border-b border-indigo-100">
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900">접수일시</th>
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900">지원자 (이름/연락처)</th>
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900">지원파트 / 희망근무</th>
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900">비고 (특이사항 / 근무메모)</th>
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedResponses.length > 0 ? (
                paginatedResponses.map((res) => {
                  const data = res.data || {};
                  const applicantName = data['이름'] || '-';
                  const applicantPhone = data['연락처'] || '-';
                  const applicantPhoto = data['사진'] || '';
                  const applyPart = data['지원파트'] || '-';
                  const workDays = data['근무가능요일'] || '';
                  const workHours = data['근무가능시간'] || '';
                  const workSchedule = [workDays, workHours].filter(Boolean).join(' · ') || '-';
                  const isMemoSaved = savedMemoId === res.id;

                  return (
                    <tr key={res.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-3 align-middle">
                        <p className="font-semibold text-gray-900 text-[13px]">{new Date(res.submitted_at).toLocaleDateString('ko-KR')}</p>
                        <p className="text-[12.5px] font-semibold text-indigo-600 mt-0.5">{new Date(res.submitted_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute:'2-digit' })}</p>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-2.5">
                          {applicantPhoto && applicantPhoto.startsWith('data:image/') ? (
                            <img 
                              src={applicantPhoto} 
                              alt={applicantName} 
                              className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900 text-[13px]">{applicantName}</p>
                            <p className="text-[12.5px] font-semibold text-indigo-600 mt-0.5">{applicantPhone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <p className="font-bold text-gray-900 text-[13px]">{applyPart}</p>
                        <p className="text-[12.5px] font-semibold text-emerald-700 truncate max-w-[200px] mt-0.5" title={workSchedule}>{workSchedule}</p>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-1.5 min-w-[240px] max-w-[320px]">
                          <input
                            type="text"
                            defaultValue={data._adminMemo || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMemoInputs(prev => ({ ...prev, [res.id]: val }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSaveMemo(res, (e.currentTarget as HTMLInputElement).value);
                              }
                            }}
                            placeholder="면접일정, 시급, 특이사항 등 메모"
                            className="flex-1 px-2.5 py-1.5 text-[12.5px] font-medium text-gray-800 bg-amber-50/40 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveMemo(res)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11.5px] font-bold transition-all shrink-0 flex items-center gap-1 border ${
                              isMemoSaved
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100'
                            }`}
                          >
                            {isMemoSaved ? <Check className="w-3 h-3" /> : null}
                            {isMemoSaved ? '저장됨' : '저장'}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          <button 
                            onClick={() => openDetails(res)}
                            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-[12px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                          >
                            상세 내용
                          </button>
                          <button 
                            onClick={() => deleteItem(res.id)} 
                            className="inline-flex items-center px-2.5 py-1.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:text-red-700 rounded-lg text-[12px] font-bold transition-all"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-gray-900 font-medium text-lg">아직 접수된 이력서가 없습니다</h3>
                    <p className="text-gray-500 mt-1 text-sm">고객 화면의 [직원채용 간편이력서] 메뉴를 통해 지원서를 받아보세요.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 bg-gray-50/50 border-t border-gray-100">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt;
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-[13px] font-bold transition-colors ${
                    currentPage === pageNum 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* 이력서 상세 보기 모달 */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4 print-modal-root">
          <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-black/5 print-modal-card">
            <div className="px-5 py-3.5 flex items-center justify-between bg-gradient-to-r from-emerald-700 to-teal-900 text-white shadow-sm print:bg-none print:text-gray-900 print:border-b-2 print:border-gray-900 print:px-0 print:py-2">
              <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-200 print:text-emerald-700" />
                직원채용 이력서 상세 정보
              </h2>
              <button 
                onClick={() => setSelectedResponse(null)}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors no-print"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-5 overflow-y-auto print-area bg-gray-50 flex-1 min-h-0 space-y-3 print:bg-white print:p-0 print:pt-3">
              {/* 상단 지원일시 및 사장님 비고 메모 */}
              <div className="bg-white rounded-xl px-4 py-3 border border-gray-200/80 shadow-sm space-y-2.5 print:shadow-none print:border-gray-300">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[11px] font-medium text-gray-500">지원 일시</p>
                    <p className="text-[13px] font-bold text-gray-900">{new Date(selectedResponse.submitted_at).toLocaleString('ko-KR')}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-[11.5px] font-bold text-indigo-900 mb-1">
                    비고 (사장님 메모 · 면접/근무 특이사항)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={selectedResponse.data?._adminMemo || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMemoInputs(prev => ({ ...prev, [selectedResponse.id]: val }));
                      }}
                      placeholder="예: 면접완료, 10월 20일 첫출근, 시급 11,000원 등"
                      className="flex-1 px-3 py-1.5 text-[13px] font-medium text-gray-800 bg-amber-50/50 border border-amber-200 rounded-lg focus:bg-white focus:border-indigo-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveMemo(selectedResponse)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 no-print"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {savedMemoId === selectedResponse.id ? '저장됨' : '메모 저장'}
                    </button>
                  </div>
                </div>
              </div>

              {(() => {
                const d = selectedResponse.data || {};
                const photoUrl = d['사진'] || '';
                const docUrl = d['증빙서류 (보건증 등 파일첨부)'] || '';

                return (
                  <div className="space-y-3">
                    {/* 1. 기본 인적사항 (사진 포함) */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-200 print:shadow-none">
                      <h3 className="text-[13px] font-extrabold mb-3 pb-2 border-b text-emerald-900 border-emerald-200 flex items-center gap-2">
                        기본 인적사항
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="shrink-0 mx-auto sm:mx-0">
                          {photoUrl && photoUrl.startsWith('data:image/') ? (
                            <img 
                              src={photoUrl} 
                              alt="지원자 사진" 
                              className="w-24 h-28 object-cover rounded-xl border border-gray-200 shadow-sm"
                            />
                          ) : (
                            <div className="w-24 h-28 rounded-xl bg-gray-100 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                              <User className="w-6 h-6 mb-1" />
                              <span className="text-[10.5px] font-medium">사진 미첨부</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-y-2.5 gap-x-4 w-full">
                          <div>
                            <p className="text-[11.5px] font-semibold text-gray-500 mb-0.5">이름</p>
                            <p className="text-[15.5px] font-extrabold text-gray-900">{d['이름'] || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[11.5px] font-semibold text-gray-500 mb-0.5">연락처</p>
                            <p className="text-[15px] font-extrabold text-indigo-700">{d['연락처'] || '-'}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[11.5px] font-semibold text-gray-500 mb-0.5">거주지 주소</p>
                            <p className="text-[13.5px] font-medium text-gray-900 leading-snug">{d['주소'] || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. 지원 조건 및 경력사항 */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/80 print:shadow-none print:border-gray-300">
                      <h3 className="text-[13px] font-extrabold mb-3 pb-2 border-b text-gray-900 border-gray-200">
                        지원 조건 및 경력사항
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4">
                        <div>
                          <p className="text-[11.5px] font-semibold text-gray-500 mb-0.5">지원파트</p>
                          <p className="text-[14.5px] font-extrabold text-emerald-700">{d['지원파트'] || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[11.5px] font-semibold text-gray-500 mb-0.5">근무가능요일</p>
                          <p className="text-[13.5px] font-bold text-gray-900">{d['근무가능요일'] || '-'}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <p className="text-[11.5px] font-semibold text-gray-500 mb-0.5">근무가능시간</p>
                          <p className="text-[13.5px] font-bold text-gray-900">{d['근무가능시간'] || '-'}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-3">
                          <p className="text-[11.5px] font-semibold text-gray-500 mb-1">관련업종 경력유무 및 상세</p>
                          <p className="text-[13.5px] font-medium text-gray-900 whitespace-pre-wrap leading-snug bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                            {d['관련업종경력유무'] || '-'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 3. 간단한 소개 또는 각오 */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/80 print:shadow-none print:border-gray-300">
                      <h3 className="text-[13px] font-extrabold mb-2 pb-2 border-b text-gray-900 border-gray-200">
                        간단한 소개 또는 각오
                      </h3>
                      <p className="text-[13.5px] font-medium text-gray-900 whitespace-pre-wrap leading-snug">
                        {d['간단한 소개 또는 각오'] || '-'}
                      </p>
                    </div>

                    {/* 4. 증빙서류 (보건증 등 파일첨부) */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/80 print:shadow-none print:border-gray-300">
                      <h3 className="text-[13px] font-extrabold mb-2 pb-2 border-b text-gray-900 border-gray-200 flex items-center justify-between">
                        <span>증빙서류 (보건증 등 첨부파일)</span>
                        {docUrl && (
                          <a
                            href={docUrl}
                            download={`증빙서류_${d['이름'] || '지원자'}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors no-print"
                          >
                            <Download className="w-3.5 h-3.5" /> 파일 저장
                          </a>
                        )}
                      </h3>
                      {docUrl ? (
                        docUrl.startsWith('data:image/') ? (
                          <div className="mt-1">
                            <img 
                              src={docUrl} 
                              alt="첨부 증빙서류" 
                              className="max-h-48 print:max-h-36 w-auto mx-auto rounded-lg border border-gray-200 shadow-sm"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                            <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-800">증빙서류 파일이 첨부되어 있습니다.</p>
                              <p className="text-[11px] text-gray-500 no-print">우측 상단의 [파일 저장] 버튼을 눌러 확인하세요.</p>
                            </div>
                          </div>
                        )
                      ) : (
                        <p className="text-xs text-gray-400">첨부된 증빙서류가 없습니다.</p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="px-5 py-3.5 border-t border-gray-100 bg-white flex justify-end gap-2.5 rounded-b-[20px] no-print">
              <button 
                onClick={() => setSelectedResponse(null)}
                className="px-5 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                닫기
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:scale-95 transition-all text-sm font-bold shadow-md"
              >
                <Printer className="w-4 h-4" />
                출력 / PDF 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
