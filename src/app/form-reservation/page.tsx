export default function ReservationForm() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">예약 신청서</h1>
        <p className="text-gray-500">원하시는 날짜와 시간을 선택해 예약을 진행해주세요.</p>
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
