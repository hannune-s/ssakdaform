"use client";

import { Eye, Link as LinkIcon } from 'lucide-react';

export default function BasicForm() {
  const handlePreview = () => {
    const fields = [
      { id: 1, type: 'text', label: '신청자 이름', placeholder: '이름을 입력하세요', required: true },
      { id: 2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
      { id: 3, type: 'text', label: '신청 목적', placeholder: '예: 상담 신청, 견적 문의 등', required: true },
      { id: 4, type: 'textarea', label: '상세 내용', placeholder: '궁금하신 점이나 요청사항을 자세히 적어주세요.', required: true }
    ];

    localStorage.setItem('ssakdaform_preview', JSON.stringify({
      storeName: '내 매장 이름 (기본 설정)',
      formTitle: '기본 신청서 폼',
      fields
    }));

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

  const handleCopyLink = () => {
    const dummyLink = "https://ssakdaform.vercel.app/form/basic-preset";
    navigator.clipboard.writeText(dummyLink).then(() => {
      alert(`고객에게 전송할 기본 신청서 링크가 복사되었습니다!\n\n${dummyLink}`);
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">기본 신청서 폼</h1>
          <p className="text-gray-500">가장 기본적인 형태의 다목적 신청서입니다.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button 
            onClick={handleCopyLink}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-100 transition shadow-sm font-medium"
          >
            <LinkIcon className="w-5 h-5" />
            고객링크 발행
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

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <form className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 (필수)
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연락처 (필수)
            </label>
            <input 
              type="tel" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              placeholder="010-0000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일 주소
            </label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              신청 사유 및 문의사항
            </label>
            <textarea 
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              placeholder="내용을 입력해주세요."
            ></textarea>
          </div>

        </form>
      </div>
    </div>
  );
}
