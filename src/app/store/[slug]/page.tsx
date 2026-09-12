"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Package, Calendar, FileText, ChevronRight, Store } from 'lucide-react';

export default function StoreHubPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // 실제로는 slug를 이용해 DB에서 매장 정보를 불러옵니다.
  // 데모를 위해 임시로 slug를 파싱하여 매장명을 생성합니다.
  const storeName = slug === 'demo' ? '싹다 데모 매장' : `${decodeURIComponent(slug || '우리')} 매장`;

  const standardForms = [
    {
      id: 'delivery-preset',
      title: '간편 택배 접수',
      description: '보내실 물품의 택배 발송을 신청합니다.',
      icon: <Package className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-100 group-hover:border-blue-300',
    },
    {
      id: 'reservation-preset',
      title: '매장 예약',
      description: '방문 일정과 인원을 미리 예약합니다.',
      icon: <Calendar className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-100 group-hover:border-emerald-300',
    },
    {
      id: 'basic-preset',
      title: '기타 신청 / 문의',
      description: '회원가입 및 기타 문의사항을 남겨주세요.',
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50 border-purple-100 group-hover:border-purple-300',
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center py-12 px-4 font-sans relative">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4">
            <Store className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{storeName}</h1>
          <p className="text-gray-500">원하시는 서비스를 선택해주세요</p>
        </div>

        {/* Form Links */}
        <div className="space-y-4">
          {standardForms.map((form) => (
            <Link href={`/form/${form.id}`} key={form.id} className="block group">
              <div className="p-5 rounded-2xl border border-transparent transition-all duration-200 flex items-center gap-4 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] group-hover:shadow-md cursor-pointer">
                <div className={`p-3 rounded-xl ${form.color} transition-colors border`}>
                  {form.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-0.5">{form.title}</h3>
                  <p className="text-sm text-gray-500">{form.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
        
        {/* Custom Forms Section (Placeholder for Demo) */}
        <div className="mt-12 pt-8 border-t border-gray-200">
           <h3 className="text-sm font-bold text-gray-400 mb-4 px-2 uppercase tracking-wider">이벤트 & 기획전 (커스텀 폼 예시)</h3>
           <Link href="/form/demo-12345" className="block group">
              <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm group-hover:shadow-md transition-all flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800">🎉 추석 맞이 특별 할인 신청</h4>
                  <p className="text-xs text-gray-500 mt-1">2026.09.15 ~ 09.30</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
              </div>
           </Link>
        </div>

        <div className="mt-12 text-center text-sm text-stone-400 font-medium">
          Powered by <span className="text-emerald-600 font-semibold">싹다폼</span>
        </div>
      </div>
    </div>
  );
}
