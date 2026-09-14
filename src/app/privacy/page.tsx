import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 bg-white z-10">
          <h1 className="text-xl font-bold text-gray-900">개인정보처리방침 (표준양식)</h1>
          <Link href="/landing" className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> 돌아가기
          </Link>
        </div>
        <div className="p-6 sm:p-10 prose prose-sm text-gray-600 max-w-none h-[70vh] overflow-y-auto">
          
          <p className="mb-8 font-medium">싹다폼(이하 "회사"라 함)은 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.</p>

          <h2 className="text-base font-bold text-gray-900 mt-0 mb-2">제1조 (개인정보의 처리 목적)</h2>
          <p className="mb-6">회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 관련 법령에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.<br/>
          1. 홈페이지 회원 가입 및 관리<br/>
          회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 만 14세 미만 아동의 개인정보 처리 시 법정대리인의 동의여부 확인, 각종 고지·통지 등을 목적으로 개인정보를 처리합니다.<br/>
          2. 재화 또는 서비스 제공<br/>
          서비스 제공, 청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 연령인증, 요금결제·정산 등을 목적으로 개인정보를 처리합니다.<br/>
          3. 고충처리<br/>
          민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보 등의 목적으로 개인정보를 처리합니다.</p>
          
          <h2 className="text-base font-bold text-gray-900 mb-2">제2조 (처리하는 개인정보 항목)</h2>
          <p className="mb-6">회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.<br/>
          - 필수항목 : 아이디(이메일), 비밀번호, 이름, 연락처(휴대전화번호), 상호명, 서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보<br/>
          - 선택항목 : 매장 주소, 업종, 팩스 번호</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제3조 (개인정보의 처리 및 보유기간)</h2>
          <p className="mb-6">① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.<br/>
          ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.<br/>
          1. 홈페이지 회원 가입 및 관리 : 사업자/단체 홈페이지 탈퇴시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료시까지)<br/>
          2. 재화 또는 서비스 제공 : 재화·서비스 공급완료 및 요금결제·정산 완료시까지<br/>
          - 전자상거래 등에서의 소비자 보호에 관한 법률에 따른 표시·광고, 계약내용 및 이행 등 거래에 관한 기록<br/>
          - 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년<br/>
          - 대금결제 및 재화 등의 공급에 관한 기록 : 5년<br/>
          - 계약 또는 청약철회 등에 관한 기록 : 5년</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제4조 (개인정보의 제3자 제공)</h2>
          <p className="mb-6">회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제5조 (개인정보처리의 위탁)</h2>
          <p className="mb-6">① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.<br/>
          - 위탁받는 자 (수탁자) : AWS, 토스페이먼츠(주)<br/>
          - 위탁하는 업무의 내용 : 서비스 인프라 호스팅, 결제 처리<br/>
          ② 회사는 위탁계약 체결시 관련 법령에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
          <p className="mb-6">① 정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.<br/>
          ② 제1항에 따른 권리 행사는 회사에 대해 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제7조 (개인정보의 파기)</h2>
          <p className="mb-6">① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.<br/>
          ② 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제8조 (개인정보의 안전성 확보조치)</h2>
          <p className="mb-6">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.<br/>
          1. 관리적 조치 : 내부관리계획 수립·시행, 정기적 직원 교육 등<br/>
          2. 기술적 조치 : 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제9조 (개인정보 보호책임자)</h2>
          <p className="mb-6">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.<br/>
          - 책임자: 김싹다 (대표이사)<br/>
          - 연락처: support@ssakdaform.com, 070-1234-5678</p>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm font-medium text-gray-500">
            부칙: 이 방침은 2026년 1월 1일부터 적용됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}
