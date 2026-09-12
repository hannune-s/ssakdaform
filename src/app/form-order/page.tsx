"use client";

import { Eye, Link as LinkIcon } from 'lucide-react';

export default function OrderForm() {
  const handlePreview = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
      
    const fields = [
      { id: 1, type: 'date', label: '주문 날짜', defaultValue: todayStr, required: true },
      { id: 2, type: 'text', label: '상품명', placeholder: '주문하실 상품명을 입력하세요', required: true },
      { id: 3, type: 'text', label: '고객명', placeholder: '주문자 성함을 입력하세요', required: true },
      { id: 4, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
      { id: 5, type: 'text', label: '입금자명', placeholder: '입금하실 분의 성함을 입력하세요', required: true },
      { id: 6, type: 'textarea', label: '기타 전달 내용', placeholder: '배송 메시지 등 기타 요청사항을 적어주세요.', required: false }
    ];

    localStorage.setItem('ssakdaform_preview', JSON.stringify({
      storeName: '내 매장 이름 (기본 설정)',
      formTitle: '간편한 상품 주문서',
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
    const dummyLink = `${window.location.origin}/form/order-preset`;
    navigator.clipboard.writeText(dummyLink).then(() => {
      alert(`고객에게 전송할 상품 주문서 링크가 복사되었습니다!\n\n${dummyLink}`);
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">상품 주문서</h1>
          <p className="text-gray-500">원하시는 상품을 쉽고 빠르게 주문받을 수 있는 폼입니다.</p>
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
