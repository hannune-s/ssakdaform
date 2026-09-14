import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100 p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">이용약관 (표준약관)</h1>
          <Link href="/landing" className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> 돌아가기
          </Link>
        </div>
        <div className="p-6 sm:p-10 prose prose-sm text-gray-600 max-w-none">
          <h2 className="text-lg font-bold text-gray-900 mt-0 mb-4">제1조 (목적)</h2>
          <p className="mb-6">이 약관은 싹다폼(이하 "회사")이 제공하는 폼 생성 및 관리 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다. 본 약관은 공정거래위원회의 표준약관을 준수합니다.</p>
          
          <h2 className="text-lg font-bold text-gray-900 mb-4">제2조 (용어의 정의)</h2>
          <p className="mb-6">① "서비스"라 함은 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는 싹다폼 관련 제반 서비스를 의미합니다.</p>
          <p className="mb-6">② "회원"이라 함은 회사의 "서비스"에 접속하여 이 약관에 따라 "회사"와 이용계약을 체결하고 "회사"가 제공하는 "서비스"를 이용하는 고객을 말합니다.</p>

          <h2 className="text-lg font-bold text-gray-900 mb-4">제3조 (약관의 게시와 개정)</h2>
          <p className="mb-6">① "회사"는 이 약관의 내용을 "회원"이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</p>
          <p className="mb-6">② "회사"는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호 등에 관한 법률" 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>

          <h2 className="text-lg font-bold text-gray-900 mb-4">제4조 (서비스의 제공 등)</h2>
          <p className="mb-6">"회사"는 회원에게 아래와 같은 서비스를 제공합니다.<br/>1. 간편 폼 생성 및 관리<br/>2. 고객 주문/예약 관리 대시보드<br/>3. 기타 "회사"가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 "회원"에게 제공하는 일체의 서비스</p>

          <div className="mt-10 p-4 bg-gray-50 rounded-lg text-center text-sm font-medium text-gray-500">
            본 약관은 2026년 1월 1일부터 시행됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}
