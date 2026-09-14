import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 bg-white z-10">
          <h1 className="text-xl font-bold text-gray-900">이용약관 (표준약관)</h1>
          <Link href="/landing" className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> 돌아가기
          </Link>
        </div>
        <div className="p-6 sm:p-10 prose prose-sm text-gray-600 max-w-none h-[70vh] overflow-y-auto">
          
          <h2 className="text-base font-bold text-gray-900 mt-0 mb-2">제1조 (목적)</h2>
          <p className="mb-6">본 약관은 싹다폼(이하 "회사"라 합니다)이 제공하는 제반 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다. (본 약관은 공정거래위원회 표준약관 제10023호를 준용합니다.)</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제2조 (정의)</h2>
          <p className="mb-6">① "서비스"라 함은 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는 싹다폼 및 관련 제반 서비스를 의미합니다.<br/>
          ② "회원"이라 함은 회사의 "서비스"에 접속하여 이 약관에 따라 "회사"와 이용계약을 체결하고 "회사"가 제공하는 "서비스"를 이용하는 고객을 말합니다.<br/>
          ③ "아이디(ID)"라 함은 "회원"의 식별과 "서비스" 이용을 위하여 "회원"이 정하고 "회사"가 승인하는 문자와 숫자의 조합을 의미합니다.<br/>
          ④ "비밀번호"라 함은 "회원"이 부여 받은 "아이디와 일치되는 "회원"임을 확인하고 비밀보호를 위해 "회원" 자신이 정한 문자 또는 숫자의 조합을 의미합니다.</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제3조 (약관의 게시와 개정)</h2>
          <p className="mb-6">① "회사"는 이 약관의 내용을 "회원"이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.<br/>
          ② "회사"는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 "정보통신망법")" 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.<br/>
          ③ "회사"가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 제1항의 방식에 따라 그 개정약관의 적용일자 7일 전부터 적용일자 전일까지 공지합니다.</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제4조 (이용계약 체결)</h2>
          <p className="mb-6">① 이용계약은 "회원"이 되고자 하는 자(이하 "가입신청자")가 약관의 내용에 대하여 동의를 한 다음 회원가입신청을 하고 "회사"가 이러한 신청에 대하여 승낙함으로써 체결됩니다.<br/>
          ② "회사"는 "가입신청자"의 신청에 대하여 "서비스" 이용을 승낙함을 원칙으로 합니다. 다만, "회사"는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제5조 (회원정보의 변경)</h2>
          <p className="mb-6">① "회원"은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다.<br/>
          ② "회원"은 회원가입신청 시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나 전자우편 기타 방법으로 "회사"에 대하여 그 변경사항을 알려야 합니다.</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제6조 (개인정보보호 의무)</h2>
          <p className="mb-6">"회사"는 "정보통신망법" 등 관계 법령이 정하는 바에 따라 "회원"의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련법 및 "회사"의 개인정보처리방침이 적용됩니다.</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제7조 ("회사"의 의무)</h2>
          <p className="mb-6">① "회사"는 관련법과 이 약관이 금지하거나 미풍양속에 반하는 행위를 하지 않으며, 계속적이고 안정적으로 "서비스"를 제공하기 위하여 최선을 다하여 노력합니다.<br/>
          ② "회사"는 "회원"이 안전하게 "서비스"를 이용할 수 있도록 개인정보(신용정보 포함)보호를 위해 보안시스템을 갖추어야 하며 개인정보처리방침을 공시하고 준수합니다.</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제8조 ("회원"의 의무)</h2>
          <p className="mb-6">① "회원"은 다음 행위를 하여서는 안 됩니다.<br/>
          1. 신청 또는 변경 시 허위내용의 등록<br/>
          2. 타인의 정보도용<br/>
          3. "회사"가 게시한 정보의 변경<br/>
          4. "회사" 기타 제3자의 저작권 등 지적재산권에 대한 침해</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제9조 (서비스의 제공 등)</h2>
          <p className="mb-6">① 회사는 회원에게 아래와 같은 서비스를 제공합니다.<br/>
          1. 폼 생성 및 주문/예약 관리 서비스<br/>
          2. 기타 "회사"가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 "회원"에게 제공하는 일체의 서비스<br/>
          ② "회사"는 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간 서비스 제공을 원칙으로 합니다.</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제10조 (계약해제, 해지 등)</h2>
          <p className="mb-6">① "회원"은 언제든지 서비스 초기화면의 고객센터 또는 내 정보 관리 메뉴 등을 통하여 이용계약 해지 신청을 할 수 있으며, "회사"는 관련법 등이 정하는 바에 따라 이를 즉시 처리하여야 합니다.</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제11조 (책임제한)</h2>
          <p className="mb-6">① "회사"는 천재지변 또는 이에 준하는 불가항력으로 인하여 "서비스"를 제공할 수 없는 경우에는 "서비스" 제공에 관한 책임이 면제됩니다.<br/>
          ② "회사"는 "회원"의 귀책사유로 인한 "서비스" 이용의 장애에 대하여는 책임을 지지 않습니다.</p>

          <h2 className="text-base font-bold text-gray-900 mb-2">제12조 (준거법 및 재판관할)</h2>
          <p className="mb-6">① "회사"와 "회원" 간 제기된 소송은 대한민국법을 준거법으로 합니다.<br/>
          ② "회사"와 "회원"간 발생한 분쟁에 관한 소송은 제소 당시의 "회원"의 주소에 의하고, 주소가 없는 경우 거소를 관할하는 지방법원의 전속관할로 합니다.</p>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm font-medium text-gray-500">
            부칙: 이 약관은 2026년 1월 1일부터 적용됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}
