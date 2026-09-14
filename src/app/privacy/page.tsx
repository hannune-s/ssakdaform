import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100 p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">개인정보처리방침</h1>
          <Link href="/landing" className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> 돌아가기
          </Link>
        </div>
        <div className="p-6 sm:p-10 prose prose-sm text-gray-600 max-w-none">
          <h2 className="text-lg font-bold text-gray-900 mt-0 mb-4">1. 개인정보의 수집 및 이용 목적</h2>
          <p className="mb-6">싹다폼(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>회원 가입 및 관리: 회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리</li>
            <li>서비스 제공: 폼 생성 및 관리, 알림톡 발송, 결제 안내 등 서비스 제공에 관한 계약 이행</li>
            <li>고충 처리: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보</li>
          </ul>
          
          <h2 className="text-lg font-bold text-gray-900 mb-4">2. 수집하는 개인정보의 항목</h2>
          <p className="mb-6">회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>필수항목: 아이디, 비밀번호, 이름, 연락처, 상호명</li>
            <li>선택항목: 이메일 주소, 업종, 매장 주소</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900 mb-4">3. 개인정보의 보유 및 이용기간</h2>
          <p className="mb-6">회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다. 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>

          <h2 className="text-lg font-bold text-gray-900 mb-4">4. 개인정보보호 책임자</h2>
          <p className="mb-6">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>책임자: 홍길동 (보안팀장)</li>
            <li>연락처: support@ssakdaform.com, 070-1234-5678</li>
          </ul>

          <div className="mt-10 p-4 bg-gray-50 rounded-lg text-center text-sm font-medium text-gray-500">
            본 방침은 2026년 1월 1일부터 시행됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}
