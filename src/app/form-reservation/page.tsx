"use client";

import { Eye, Link as LinkIcon } from 'lucide-react';

export default function ReservationForm() {
  const handlePreview = () => {
    const fields = [
      { id: 1, type: 'text', label: '예약자 이름', placeholder: '이름을 입력하세요', required: true },
      { id: 2, type: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
      { id: 3, type: 'date', label: '예약 희망 날짜', placeholder: '연도-월-일', required: true },
      { id: 4, type: 'text', label: '예약 희망 시간', placeholder: '예: 오후 6시 30분', required: true },
      { id: 5, type: 'number', label: '방문 인원', placeholder: '예: 2', required: true },
      { id: 6, type: 'textarea', label: '추가 요청 사항', placeholder: '알레르기 정보나 특별한 요청사항을 적어주세요.', required: false }
    ];

    localStorage.setItem('ssakdaform_preview', JSON.stringify({
      storeName: '내 매장 이름 (기본 설정)',
      formTitle: '예약 신청서',
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
    const dummyLink = "https://ssakdaform.vercel.app/form/reservation-preset";
    navigator.clipboard.writeText(dummyLink).then(() => {
      alert(`고객에게 전송할 예약 신청서 링크가 복사되었습니다!\n\n${dummyLink}`);
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">예약 신청서</h1>
          <p className="text-gray-500">방문하실 날짜와 인원을 입력하여 예약을 신청해주세요.</p>
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

      <div className="bg-white p-5 md:p-8 rounded-xl border border-gray-200 shadow-sm">
        <form className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">예약자 성함</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="이름을 입력하세요" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
              <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="010-0000-0000" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">예약 날짜</label>
              <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">예약 시간</label>
              <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-700" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">방문 인원</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white">
              <option>1명</option>
              <option>2명</option>
              <option>3명</option>
              <option>4명</option>
              <option>5명 이상</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">요청 사항</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
              placeholder="특별히 요청하실 내용이나 문의사항이 있다면 적어주세요."
            ></textarea>
          </div>

          <div className="pt-6 flex flex-col md:flex-row justify-end gap-3 border-t border-gray-100">
            <button type="button" className="w-full md:w-auto px-6 py-3 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              취소
            </button>
            <button type="button" className="w-full md:w-auto px-6 py-3 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm">
              예약 완료하기
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
