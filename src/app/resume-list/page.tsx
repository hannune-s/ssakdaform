"use client";

import { useEffect, useState } from 'react';
import { UserCheck, X, Printer, CheckCircle, User, Download, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ResumeList({ searchQuery = '' }: { searchQuery?: string }) {
  const [responses, setResponses] = useState<any[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);

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
      .eq('form_id', 'resume-preset')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Load Data Error:', error);
      alert('이력서 목록 불러오기 실패: ' + error.message);
    }

    if (data) {
      setResponses(data);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    if (currentStatus === '취소됨') return;
    const newStatus = currentStatus === '검토완료' ? '접수대기' : '검토완료';
    await supabase
      .from('ssakdaform_responses')
      .update({ status: newStatus })
      .eq('id', id);
    loadData();
  };

  const cancelStatus = async (id: string) => {
    if (!window.confirm('이 지원 내역을 정말 취소 처리하시겠습니까?')) return;
    await supabase
      .from('ssakdaform_responses')
      .update({ status: '취소됨' })
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
    <div className="max-w-6xl mx-auto pb-12">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .fixed.inset-0 {
            position: absolute !important;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
          .print-area, .print-area * { visibility: visible; }
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
        }
      `}</style>
      
      <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-[19px] md:text-xl font-bold text-gray-900 mb-1">이력서접수 (직원채용)</h1>
          <p className="text-[13px] text-gray-500">지원자들이 제출한 간편 이력서 및 증빙서류 리스트입니다.</p>
        </div>
      </div>

      {/* 리스트 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-indigo-50/70 border-b border-indigo-100">
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900">접수일시</th>
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900">지원자 (이름/연락처)</th>
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900">지원파트 / 희망근무</th>
                <th className="px-4 py-3 text-[13px] font-bold text-indigo-900">상태</th>
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
                  const isCompleted = res.status === '검토완료';

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
                        <p className="text-[12.5px] font-semibold text-emerald-700 truncate max-w-[220px] mt-0.5" title={workSchedule}>{workSchedule}</p>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <button 
                          onClick={() => toggleStatus(res.id, res.status)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                            res.status === '취소됨'
                              ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                              : isCompleted 
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' 
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                          }`}
                          title={res.status === '취소됨' ? "취소된 내역입니다" : "상태를 변경하시려면 클릭하세요"}
                        >
                          {res.status === '취소됨' ? <X className="w-3 h-3 mr-1" /> : isCompleted ? <CheckCircle className="w-3 h-3 mr-1" /> : null}
                          {res.status === '취소됨' ? '취소됨' : isCompleted ? '검토완료' : '접수대기'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right align-middle">
                        <div className="flex items-center justify-end gap-2">
                          {res.status !== '취소됨' && (
                            <button 
                              onClick={() => cancelStatus(res.id)} 
                              className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg text-[12px] font-bold transition-all"
                            >
                              지원 취소
                            </button>
                          )}
                          <button 
                            onClick={() => openDetails(res)}
                            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-[12px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                          >
                            상세 내용
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
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-black/5">
            <div className="px-6 py-5 flex items-center justify-between bg-gradient-to-r from-emerald-700 to-teal-900 text-white shadow-md">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-200" />
                직원채용 이력서 상세 정보
              </h2>
              <button 
                onClick={() => setSelectedResponse(null)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto print-area bg-gray-100 flex-1 min-h-0 space-y-6">
              {/* 상단 접수일시 및 상태 */}
              <div className="bg-white rounded-2xl p-5 shadow-md shadow-gray-200/50 flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">지원 일시</p>
                  <p className="text-sm font-bold text-gray-900">{new Date(selectedResponse.submitted_at).toLocaleString('ko-KR')}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 mb-1">현재 상태</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-bold">
                    {selectedResponse.status === '검토완료' ? <CheckCircle className="w-4 h-4" /> : null}
                    {selectedResponse.status || '접수대기'}
                  </div>
                </div>
              </div>

              {(() => {
                const d = selectedResponse.data || {};
                const photoUrl = d['사진'] || '';
                const docUrl = d['증빙서류 (보건증 등 파일첨부)'] || '';

                return (
                  <div className="space-y-6">
                    {/* 1. 기본 인적사항 (사진 포함) */}
                    <div className="bg-white rounded-2xl p-6 shadow-md shadow-emerald-100/40 border border-emerald-100">
                      <h3 className="text-sm font-extrabold mb-5 pb-3 border-b-2 text-emerald-900 border-emerald-900 flex items-center gap-2">
                        기본 인적사항
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="shrink-0 mx-auto sm:mx-0">
                          {photoUrl && photoUrl.startsWith('data:image/') ? (
                            <img 
                              src={photoUrl} 
                              alt="지원자 사진" 
                              className="w-28 h-36 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                            />
                          ) : (
                            <div className="w-28 h-36 rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                              <User className="w-8 h-8 mb-1" />
                              <span className="text-[11px] font-medium">사진 미첨부</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 w-full">
                          <div>
                            <p className="text-[12.5px] font-semibold text-gray-500 mb-1">이름</p>
                            <p className="text-[18px] font-extrabold text-gray-900">{d['이름'] || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[12.5px] font-semibold text-gray-500 mb-1">연락처</p>
                            <p className="text-[17px] font-extrabold text-indigo-700">{d['연락처'] || '-'}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-[12.5px] font-semibold text-gray-500 mb-1">거주지 주소</p>
                            <p className="text-[15px] font-medium text-gray-900 leading-relaxed">{d['주소'] || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. 지원 조건 및 경력사항 */}
                    <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50">
                      <h3 className="text-sm font-extrabold mb-5 pb-3 border-b-2 text-gray-900 border-gray-900">
                        지원 조건 및 경력사항
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                        <div>
                          <p className="text-[12.5px] font-semibold text-gray-500 mb-1">지원파트</p>
                          <p className="text-[16px] font-extrabold text-emerald-700">{d['지원파트'] || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[12.5px] font-semibold text-gray-500 mb-1">근무가능요일</p>
                          <p className="text-[15px] font-bold text-gray-900">{d['근무가능요일'] || '-'}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-[12.5px] font-semibold text-gray-500 mb-1">근무가능시간</p>
                          <p className="text-[15px] font-bold text-gray-900">{d['근무가능시간'] || '-'}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-[12.5px] font-semibold text-gray-500 mb-1">관련업종 경력유무 및 상세</p>
                          <p className="text-[15px] font-medium text-gray-900 whitespace-pre-wrap leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            {d['관련업종경력유무'] || '-'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 3. 간단한 소개 또는 각오 */}
                    <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50">
                      <h3 className="text-sm font-extrabold mb-4 pb-3 border-b-2 text-gray-900 border-gray-900">
                        간단한 소개 또는 각오
                      </h3>
                      <p className="text-[15px] font-medium text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {d['간단한 소개 또는 각오'] || '-'}
                      </p>
                    </div>

                    {/* 4. 증빙서류 (보건증 등 파일첨부) */}
                    <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50">
                      <h3 className="text-sm font-extrabold mb-4 pb-3 border-b-2 text-gray-900 border-gray-900 flex items-center justify-between">
                        <span>증빙서류 (보건증 등 첨부파일)</span>
                        {docUrl && (
                          <a
                            href={docUrl}
                            download={`증빙서류_${d['이름'] || '지원자'}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> 파일 저장
                          </a>
                        )}
                      </h3>
                      {docUrl ? (
                        docUrl.startsWith('data:image/') ? (
                          <div className="mt-2">
                            <img 
                              src={docUrl} 
                              alt="첨부 증빙서류" 
                              className="max-h-96 w-auto mx-auto rounded-xl border border-gray-200 shadow-sm"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <FileText className="w-6 h-6 text-indigo-600 shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-800">증빙서류 파일이 첨부되어 있습니다.</p>
                              <p className="text-xs text-gray-500">우측 상단의 [파일 저장] 버튼을 눌러 확인하세요.</p>
                            </div>
                          </div>
                        )
                      ) : (
                        <p className="text-sm text-gray-400">첨부된 증빙서류가 없습니다.</p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="px-6 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-[20px]">
              <button 
                onClick={() => setSelectedResponse(null)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                닫기
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-7 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:scale-95 transition-all font-bold shadow-md"
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
