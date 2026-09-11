export default function BasicForm() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">기본 신청서 폼</h1>
        <p className="text-gray-500">가장 기본적인 형태의 신청서를 작성하고 관리합니다.</p>
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

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              취소
            </button>
            <button type="button" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm">
              신청서 저장하기
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
