import StoreLinkBox from "@/components/StoreLinkBox";

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <StoreLinkBox />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">방문자 접속 통계</h1>
        <p className="text-gray-500">싹다폼 플랫폼의 통합 관리자 시스템입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-green-500">
          <h3 className="text-gray-500 font-medium mb-4">오늘 총 방문자</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-green-500">2</span>
            <span className="text-gray-500">명</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-yellow-500">
          <h3 className="text-gray-500 font-medium mb-4">오늘 신규 가입자</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-yellow-500">0</span>
            <span className="text-gray-500">명</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-teal-500">
          <h3 className="text-gray-500 font-medium mb-4">유입 경로 (고유 방문자)</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">App</span>
              <span className="text-teal-500 font-medium">129명 <span className="text-gray-400 font-normal">(58%)</span></span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Mobile Web</span>
              <span className="text-teal-500 font-medium">60명 <span className="text-gray-400 font-normal">(27%)</span></span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">PC Web</span>
              <span className="text-teal-500 font-medium">32명 <span className="text-gray-400 font-normal">(14%)</span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">최근 접속 기록 (최근 10건)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">접속 시간</th>
                <th className="px-6 py-4 font-medium">유입 경로</th>
                <th className="px-6 py-4 font-medium">이메일 / 유저</th>
                <th className="px-6 py-4 font-medium">인구통계</th>
                <th className="px-6 py-4 font-medium">접속 상세경로</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">2026. 9. 11. 오후 3:51:30</td>
                <td className="px-6 py-4 text-gray-700 font-medium">Mobile Web</td>
                <td className="px-6 py-4 text-gray-600">user@example.com</td>
                <td className="px-6 py-4 text-gray-400">-</td>
                <td className="px-6 py-4 text-gray-400">/</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">2026. 9. 11. 오전 9:52:40</td>
                <td className="px-6 py-4 text-gray-700 font-medium">Mobile Web</td>
                <td className="px-6 py-4 text-gray-600">guest</td>
                <td className="px-6 py-4 text-gray-400">-</td>
                <td className="px-6 py-4 text-gray-400">/index.html</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">2026. 9. 9. 오후 10:17:59</td>
                <td className="px-6 py-4 text-gray-700 font-medium">PC Web</td>
                <td className="px-6 py-4 text-gray-600">guest</td>
                <td className="px-6 py-4 text-gray-400">-</td>
                <td className="px-6 py-4 text-gray-400">/</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
