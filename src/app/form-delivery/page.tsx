export default function DeliveryForm() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">간편한 택배 접수</h1>
        <p className="text-gray-500">보내는 분과 받는 분의 정보를 정확하게 입력해주세요.</p>
      </div>

      <div className="bg-white p-5 md:p-8 rounded-xl border border-gray-200 shadow-sm">
        <form className="space-y-8">
          
          {/* 보내는 사람 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">보내는 분 (발송인)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="이름을 입력하세요" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="010-0000-0000" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="상세 주소를 포함하여 입력해주세요" />
              </div>
            </div>
          </section>

          {/* 받는 사람 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">받는 분 (수령인)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="이름을 입력하세요" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="010-0000-0000" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="상세 주소를 포함하여 입력해주세요" />
              </div>
            </div>
          </section>

          {/* 요청 사항 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">요청 사항</h2>
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">배송 기사님께 남길 말씀 (배송 메시지)</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="예: 문 앞에 놓고 문자 부탁드립니다." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">기타 전달하고 싶은 내용 (선택)</label>
                <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="사장님께 전달하실 기타 요청사항을 자유롭게 적어주세요." rows={3}></textarea>
              </div>
            </div>
          </section>

          <div className="pt-6 flex flex-col md:flex-row justify-end gap-3 border-t border-gray-100">
            <button type="button" className="w-full md:w-auto px-6 py-3 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              취소
            </button>
            <button type="button" className="w-full md:w-auto px-6 py-3 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm">
              접수하기
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
