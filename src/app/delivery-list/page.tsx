"use client";

import { useEffect, useState } from 'react';
import { Package, Search, Calendar, ChevronRight } from 'lucide-react';

interface DeliveryResponse {
  id: string;
  formId: string;
  submittedAt: string;
  status: string;
  receiverName: string;
  receiverAddress: string;
}

export default function DeliveryListPage() {
  const [responses, setResponses] = useState<DeliveryResponse[]>([]);

  useEffect(() => {
    // 실제로는 Supabase 데이터베이스에서 데이터를 fetch 합니다.
    // 여기서는 테스트를 위해 localStorage에서 임시로 불러옵니다.
    const stored = localStorage.getItem('ssakdaform_responses');
    if (stored) {
      // 내림차순 정렬 (최신순)
      const data = JSON.parse(stored).sort((a: any, b: any) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      setResponses(data);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">택배 신청 현황</h1>
          <p className="text-gray-500">고객들이 제출한 택배 배송 신청서 리스트입니다.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="수령인 이름 검색..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-full md:w-64"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            기간 필터
          </button>
        </div>
      </div>

      {/* 현황 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: '전체 신청', count: responses.length, color: 'bg-blue-50 text-blue-700' },
          { label: '접수 대기', count: responses.length, color: 'bg-yellow-50 text-yellow-700' },
          { label: '배송 준비중', count: 0, color: 'bg-indigo-50 text-indigo-700' },
          { label: '발송 완료', count: 0, color: 'bg-gray-50 text-gray-700' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{stat.count}</span>
              <span className="text-sm text-gray-400">건</span>
            </div>
          </div>
        ))}
      </div>

      {/* 리스트 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">접수일시</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">수령인</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">배송 주소</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">상태</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {responses.length > 0 ? (
                responses.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {new Date(res.submittedAt).toLocaleDateString('ko-KR')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(res.submittedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{res.receiverName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 truncate max-w-xs" title={res.receiverAddress}>
                        {res.receiverAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700">
                        상세보기 <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-gray-900 font-medium text-lg">아직 접수된 택배가 없습니다</h3>
                    <p className="text-gray-500 mt-1 text-sm">고객에게 폼 링크를 전달하여 접수를 받아보세요.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
