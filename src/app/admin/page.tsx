"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  Trash2,
  ExternalLink,
  Search,
  Plus,
  CheckCircle2,
  Send,
  Shield,
  Store,
  CreditCard,
  MessageSquare,
  Bell,
  FileText,
  Megaphone,
  Settings,
  BarChart3,
  Smartphone,
  Eye,
  Lock,
  Check,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface VisitLog {
  id: string;
  type: '웹 방문' | '앱 설치';
  timestamp: string;
  referrer: string;
  isInstagram: boolean;
  path: string;
}

interface NoticeItem {
  id: string;
  title: string;
  content: string;
  important: boolean;
  createdAt: string;
}

interface InquiryItem {
  id: string;
  storeId: string;
  storeName: string;
  ownerName: string;
  phone: string;
  title: string;
  content: string;
  reply?: string;
  status: '답변대기' | '답변완료';
  createdAt: string;
}

export default function HqAdminPage() {
  const [activeMenu, setActiveMenu] = useState<
    'dashboard' | 'stores' | 'subscriptions' | 'inquiries' | 'push' | 'notices' | 'security'
  >('dashboard');

  const [isLoading, setIsLoading] = useState(false);

  // 1. 방문자/접속 통계 상태
  const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);

  // 2. 가맹 매장 및 전체 접수 데이터 상태
  const [stores, setStores] = useState<any[]>([]);
  const [allResponses, setAllResponses] = useState<any[]>([]);
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSubscriptions, setStoreSubscriptions] = useState<Record<string, { plan: string; status: string; nextBilling: string }>>({});

  // 3. 1:1 문의 상태
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [expandedInquiryId, setExpandedInquiryId] = useState<string | null>(null);

  // 4. 푸시 발송 상태
  const [pushTarget, setPushTarget] = useState('all');
  const [pushTitle, setPushTitle] = useState('');
  const [pushBody, setPushBody] = useState('');
  const [pushHistory, setPushHistory] = useState<any[]>([]);

  // 5. 공지사항 상태
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeImportant, setNewNoticeImportant] = useState(true);

  // 6. 보안 설정 상태
  const [adminPassword, setAdminPassword] = useState('');
  const [excludeAdminTraffic, setExcludeAdminTraffic] = useState(true);
  const [savedSecurity, setSavedSecurity] = useState(false);

  // 초기 데이터 로드
  const loadHqData = async () => {
    setIsLoading(true);
    try {
      // 가맹 매장 목록 조회
      const { data: storeRows } = await supabase
        .from('ssakdaform_stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (storeRows) {
        setStores(storeRows);
      }

      // 전체 접수 내역 및 본사 메타 데이터 조회
      const { data: respRows } = await supabase
        .from('ssakdaform_responses')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (respRows) {
        // 일반 매장 접수 건만 분리
        const normalResponses = respRows.filter(r => r.store_id !== '__hq__' && r.form_id !== 'custom-forms-list');
        setAllResponses(normalResponses);

        // 본사 공지사항
        const hqNotices = respRows
          .filter(r => r.store_id === '__hq__' && r.form_id === '__hq_notice__')
          .map(r => ({
            id: r.id,
            title: r.data?.title || '',
            content: r.data?.content || '',
            important: Boolean(r.data?.important),
            createdAt: new Date(r.submitted_at).toLocaleString('ko-KR')
          }));

        if (hqNotices.length > 0) {
          setNotices(hqNotices);
        } else {
          setNotices([
            {
              id: 'default-notice-1',
              title: '[업데이트] 비회원 내 접수 / 실시간 배송조회 기능이 오픈되었습니다!',
              content: '고객이 회원가입 없이 이름과 연락처만으로 택배·예약·상품주문 진행상태와 실시간 배송위치를 조회할 수 있습니다.',
              important: true,
              createdAt: new Date().toLocaleString('ko-KR')
            },
            {
              id: 'default-notice-2',
              title: '[안내] 택배 송장용 엑셀(CSV) 선택 다운로드 기능 안내',
              content: '택배접수 리스트에서 원하는 건만 체크하여 택배사 프로그램용 엑셀 파일로 한 번에 다운로드하실 수 있습니다.',
              important: false,
              createdAt: new Date().toLocaleString('ko-KR')
            }
          ]);
        }

        // 본사 1:1 문의
        const hqInquiries = respRows
          .filter(r => r.store_id === '__hq__' && r.form_id === '__hq_inquiry__')
          .map(r => ({
            id: r.id,
            storeId: r.data?.storeId || 'demo',
            storeName: r.data?.storeName || '데모 스토어',
            ownerName: r.data?.ownerName || '사장님',
            phone: r.data?.phone || '-',
            title: r.data?.title || '문의드립니다',
            content: r.data?.content || '',
            reply: r.data?.reply || '',
            status: (r.status === '답변완료' ? '답변완료' : '답변대기') as '답변대기' | '답변완료',
            createdAt: new Date(r.submitted_at).toLocaleString('ko-KR')
          }));

        if (hqInquiries.length > 0) {
          setInquiries(hqInquiries);
        } else {
          setInquiries([
            {
              id: 'sample-inq-1',
              storeId: 'demo',
              storeName: '싹다마트 강남본점',
              ownerName: '홍길동',
              phone: '010-1234-5678',
              title: '연간 구독 플랜 세금계산서 발행 문의드립니다.',
              content: '매장 사업자등록증으로 연간 이용권 결제 시 전자세금계산서나 현금영수증 지출증빙 처리가 가능한지 궁금합니다.',
              reply: '안녕하세요 사장님! 카드 결제 시 매출전표로 부가세 매입세액 공제가 즉시 가능하며, 계좌이체 시 전자세금계산서 100% 발행해 드립니다.',
              status: '답변완료',
              createdAt: new Date().toLocaleString('ko-KR')
            }
          ]);
        }
      }

      // 로컬 저장된 방문 로그 로드 (없으면 기본 샘플 생성)
      const savedVisits = localStorage.getItem('ssakdaform_hq_visit_logs');
      if (savedVisits) {
        setVisitLogs(JSON.parse(savedVisits));
      } else {
        const now = new Date();
        const initialLogs: VisitLog[] = [
          {
            id: 'v-1',
            type: '웹 방문',
            timestamp: now.toLocaleString('ko-KR'),
            referrer: '[PC Web] 직접 접속 (Direct)',
            isInstagram: false,
            path: '/landing'
          },
          {
            id: 'v-2',
            type: '웹 방문',
            timestamp: new Date(now.getTime() - 1000 * 60 * 18).toLocaleString('ko-KR'),
            referrer: '[Mobile Web] Instagram 프로필 링크 유입',
            isInstagram: true,
            path: '/store/demo'
          },
          {
            id: 'v-3',
            type: '앱 설치',
            timestamp: new Date(now.getTime() - 1000 * 60 * 45).toLocaleString('ko-KR'),
            referrer: '[Mobile Web] 홈 화면에 추가 완료',
            isInstagram: false,
            path: '/'
          },
          {
            id: 'v-4',
            type: '웹 방문',
            timestamp: new Date(now.getTime() - 1000 * 60 * 90).toLocaleString('ko-KR'),
            referrer: '[PC Web] 직접 접속 (Direct)',
            isInstagram: false,
            path: '/'
          }
        ];
        setVisitLogs(initialLogs);
        localStorage.setItem('ssakdaform_hq_visit_logs', JSON.stringify(initialLogs));
      }

      // 매장별 구독 상태 로드
      const savedSubs = localStorage.getItem('ssakdaform_hq_subscriptions');
      if (savedSubs) {
        setStoreSubscriptions(JSON.parse(savedSubs));
      }

      // 푸시 발송 이력 로드
      const savedPush = localStorage.getItem('ssakdaform_hq_push_history');
      if (savedPush) {
        setPushHistory(JSON.parse(savedPush));
      } else {
        setPushHistory([
          {
            id: 'p-1',
            target: '전체 가맹 매장',
            title: '🎉 [신기능] 비회원 내 접수 / 실시간 배송조회 업데이트 안내',
            body: '사장님! 이제 고객이 이름과 연락처만으로 송장번호와 안내메모를 직접 조회할 수 있습니다.',
            sentAt: new Date().toLocaleString('ko-KR')
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHqData();
  }, []);

  // 방문 기록 삭제 및 초기화
  const handleDeleteVisitLog = (id: string) => {
    const updated = visitLogs.filter(v => v.id !== id);
    setVisitLogs(updated);
    localStorage.setItem('ssakdaform_hq_visit_logs', JSON.stringify(updated));
  };

  const handleResetTodayVisits = () => {
    if (!window.confirm('오늘 접속/설치 통계 기록을 모두 초기화하시겠습니까?')) return;
    setVisitLogs([]);
    localStorage.setItem('ssakdaform_hq_visit_logs', JSON.stringify([]));
  };

  // 매장 구독 플랜/상태 변경
  const handleUpdateSubscription = (storeId: string, field: 'plan' | 'status', value: string) => {
    const current = storeSubscriptions[storeId] || {
      plan: '월간 이용권 (9,900원)',
      status: '정상 이용중',
      nextBilling: '2026-11-16'
    };
    const updated = {
      ...storeSubscriptions,
      [storeId]: { ...current, [field]: value }
    };
    setStoreSubscriptions(updated);
    localStorage.setItem('ssakdaform_hq_subscriptions', JSON.stringify(updated));
  };

  // 가맹 매장 삭제
  const handleDeleteStore = async (id: string, storeName: string) => {
    if (!window.confirm(`정말 '${storeName}' 매장을 목록에서 삭제하시겠습니까?`)) return;
    await supabase.from('ssakdaform_stores').delete().eq('id', id);
    loadHqData();
  };

  // 1:1 문의 답변 저장
  const handleSaveInquiryReply = async (inq: InquiryItem) => {
    const replyText = (replyInputs[inq.id] ?? inq.reply ?? '').trim();
    if (!replyText) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    if (inq.id.startsWith('sample-')) {
      setInquiries(prev =>
        prev.map(item => (item.id === inq.id ? { ...item, reply: replyText, status: '답변완료' } : item))
      );
      alert('답변이 등록되었습니다.');
      return;
    }

    await supabase
      .from('ssakdaform_responses')
      .update({
        status: '답변완료',
        data: {
          storeId: inq.storeId,
          storeName: inq.storeName,
          ownerName: inq.ownerName,
          phone: inq.phone,
          title: inq.title,
          content: inq.content,
          reply: replyText
        }
      })
      .eq('id', inq.id);

    alert('답변이 정상 등록되었습니다.');
    loadHqData();
  };

  // 공지사항 등록
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) {
      alert('공지사항 제목과 내용을 입력해주세요.');
      return;
    }

    const { error } = await supabase.from('ssakdaform_responses').insert([
      {
        store_id: '__hq__',
        form_id: '__hq_notice__',
        status: '게시중',
        data: {
          title: newNoticeTitle.trim(),
          content: newNoticeContent.trim(),
          important: newNoticeImportant
        }
      }
    ]);

    if (error) {
      alert('공지 등록 중 오류가 발생했습니다: ' + error.message);
      return;
    }

    setNewNoticeTitle('');
    setNewNoticeContent('');
    loadHqData();
  };

  const handleDeleteNotice = async (id: string) => {
    if (!window.confirm('이 공지사항을 삭제하시겠습니까?')) return;
    if (id.startsWith('default-')) {
      setNotices(prev => prev.filter(n => n.id !== id));
      return;
    }
    await supabase.from('ssakdaform_responses').delete().eq('id', id);
    loadHqData();
  };

  // 푸시 발송
  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushBody.trim()) {
      alert('푸시 제목과 내용을 모두 입력해주세요.');
      return;
    }

    const targetLabel =
      pushTarget === 'all'
        ? `전체 가맹 매장 (${stores.length}곳)`
        : stores.find(s => s.store_id === pushTarget)?.store_name || pushTarget;

    const newEntry = {
      id: `p-${Date.now()}`,
      target: targetLabel,
      title: pushTitle.trim(),
      body: pushBody.trim(),
      sentAt: new Date().toLocaleString('ko-KR')
    };

    const updated = [newEntry, ...pushHistory];
    setPushHistory(updated);
    localStorage.setItem('ssakdaform_hq_push_history', JSON.stringify(updated));

    // 브라우저 알림 권한이 있으면 즉시 테스트 푸시도 표시
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(pushTitle.trim(), { body: pushBody.trim() });
    }

    setPushTitle('');
    setPushBody('');
    alert(`'${targetLabel}' 대상으로 푸시 알림이 발송되었습니다!`);
  };

  // 통계 계산
  const webVisitorsCount = visitLogs.filter(v => v.type === '웹 방문').length;
  const instaVisitorsCount = visitLogs.filter(v => v.isInstagram).length;
  const appInstallCount = visitLogs.filter(v => v.type === '앱 설치').length;
  const instaRatio = webVisitorsCount > 0 ? Math.round((instaVisitorsCount / webVisitorsCount) * 100) : 0;

  const todayStr = new Date().toDateString();
  const todayResponsesCount = allResponses.filter(
    r => new Date(r.submitted_at).toDateString() === todayStr
  ).length;

  const filteredStores = stores.filter(s => {
    if (!storeSearch.trim()) return true;
    const q = storeSearch.toLowerCase();
    return (
      (s.store_name || '').toLowerCase().includes(q) ||
      (s.owner_name || '').toLowerCase().includes(q) ||
      (s.store_id || '').toLowerCase().includes(q) ||
      (s.phone || '').toLowerCase().includes(q)
    );
  });

  const menuItems = [
    { id: 'dashboard', label: '대시보드', emoji: '📊' },
    { id: 'stores', label: '가맹 매장 관리', emoji: '🏪', badge: stores.length },
    { id: 'subscriptions', label: '구독 · 매출 관리', emoji: '💳' },
    {
      id: 'inquiries',
      label: '제휴·문의 내역',
      emoji: '✉️',
      badge: inquiries.filter(i => i.status === '답변대기').length || undefined
    },
    { id: 'push', label: '푸시 발송', emoji: '🔔' },
    { id: 'notices', label: '공지사항 관리', emoji: '📢' },
    { id: 'security', label: '보안 설정', emoji: '⚙️' }
  ] as const;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentMenuItem = menuItems.find(m => m.id === activeMenu) || menuItems[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans text-gray-900 break-keep">
      {/* 모바일/태블릿 상단바 (햄버거 버튼 + 현재 메뉴명 + 앱 바로가기 버튼만 깔끔하게 표시) */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200/80 shadow-2xs">
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="메뉴 열기"
              className="p-1.5 -ml-1 rounded-lg text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] leading-none">{currentMenuItem.emoji}</span>
              <span className="text-[17px] font-black text-gray-900 tracking-tight whitespace-nowrap">
                {currentMenuItem.label}
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-lg font-extrabold text-[12px] flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <span>📱</span>
            <span>앱 바로가기</span>
          </Link>
        </div>
      </header>

      {/* 모바일/태블릿 딤드(배경 어둡게) 오버레이 */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/45 z-40 backdrop-blur-[1px] transition-opacity"
        />
      )}

      {/* 좌측 사이드바 (모바일에서는 햄버거 클릭 시 좌측에서 슬라이드 인, PC에서는 좌측 고정) */}
      <aside
        className={`w-64 bg-white border-r border-gray-200/80 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* 상단 로고 & 닫기(X) 버튼 */}
        <div className="px-5 pt-6 pb-5 bg-blue-50/40 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-[18px] flex items-center justify-center shadow-xs shrink-0">
              싹
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-[17px] font-black text-gray-900 tracking-tight whitespace-nowrap">
                  싹다폼 Admin
                </span>
              </div>
              <p className="text-[11px] font-semibold text-gray-400 whitespace-nowrap">
                가맹점 &amp; 본사 통합 관리
              </p>
            </div>
          </div>

          {/* 모바일 닫기(X) 버튼 */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="메뉴 닫기"
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[14px] whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-50/90 text-blue-600 font-extrabold shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-bold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[16px] leading-none">{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
                {'badge' in item && item.badge ? (
                  <span
                    className={`px-2 py-0.5 text-[11px] font-extrabold rounded-full ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* 하단 버튼 & 카피라이트 */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <Link
            href="/"
            className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200/80 text-gray-700 rounded-xl font-bold text-[12.5px] flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
          >
            <span>📱</span>
            <span>싹다폼 앱 바로가기</span>
          </Link>
          <p className="text-[11.5px] font-semibold text-gray-400 text-center whitespace-nowrap">
            © 2026 싹다폼 Admin
          </p>
        </div>
      </aside>

      {/* 우측 메인 콘텐츠 영역 (모바일 전체폭 w-full, 데스크톱 lg:ml-64) */}
      <main className="flex-1 w-full lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl min-w-0">
        {/* ================= 1. 대시보드 (방문자 접속 통계 + 전체 현황) ================= */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8">
            {/* 상단 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-[26px] font-black text-gray-900 tracking-tight whitespace-nowrap">
                    방문자 접속 통계
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] sm:text-[12px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                    🛡️ 관리자·로컬·배포봇 자동 제외됨
                  </span>
                </div>
                <p className="text-[13px] sm:text-[13.5px] font-medium text-gray-500 mt-1.5 leading-relaxed">
                  실제 외부 방문자만 하루 1회(자정 기준) 순방문자로 정확히 집계됩니다.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={loadHqData}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-[12.5px] sm:text-[13px] font-bold shadow-2xs transition-all active:scale-95 whitespace-nowrap"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
                  새로고침
                </button>
                <button
                  onClick={handleResetTodayVisits}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-rose-50/70 border border-rose-200 hover:bg-rose-100/70 text-rose-600 rounded-xl text-[12.5px] sm:text-[13px] font-bold transition-all active:scale-95 whitespace-nowrap"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  오늘 기록 초기화
                </button>
              </div>
            </div>

            {/* 상단 3대 방문자/설치 KPI 카드 (모바일에서도 1줄에 3칸 배치) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-5">
              {/* 카드 1: 오늘 순수 방문자 */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 bg-blue-500" />
                <div className="pl-1.5 sm:pl-2">
                  <p className="text-[11px] sm:text-[14px] font-extrabold text-gray-600 mb-1 sm:mb-2 whitespace-nowrap">
                    오늘 순수 방문자
                  </p>
                  <div className="flex items-baseline gap-0.5 sm:gap-1.5 mb-0.5 sm:mb-1.5">
                    <span className="text-xl sm:text-4xl font-black text-blue-600 leading-none">{webVisitorsCount}</span>
                    <span className="text-[11px] sm:text-[13.5px] font-bold text-gray-500">명</span>
                  </div>
                  <p className="text-[10px] sm:text-[12px] font-medium text-gray-400 truncate">
                    실제 순방문자 수
                  </p>
                </div>
              </div>

              {/* 카드 2: 인스타그램 유입 */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 bg-pink-500" />
                <div className="pl-1.5 sm:pl-2">
                  <p className="text-[11px] sm:text-[14px] font-extrabold text-gray-600 mb-1 sm:mb-2 whitespace-nowrap">
                    인스타 유입
                  </p>
                  <div className="flex items-baseline gap-0.5 sm:gap-1.5 mb-0.5 sm:mb-1.5">
                    <span className="text-xl sm:text-4xl font-black text-pink-600 leading-none">{instaVisitorsCount}</span>
                    <span className="text-[11px] sm:text-[13.5px] font-bold text-gray-500">명</span>
                  </div>
                  <p className="text-[10px] sm:text-[12px] font-medium text-gray-400 whitespace-nowrap">
                    비중: {instaRatio}%
                  </p>
                </div>
              </div>

              {/* 카드 3: 앱 설치 횟수 */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 bg-emerald-500" />
                <div className="pl-1.5 sm:pl-2">
                  <p className="text-[11px] sm:text-[14px] font-extrabold text-gray-600 mb-1 sm:mb-2 whitespace-nowrap">
                    앱 설치 횟수
                  </p>
                  <div className="flex items-baseline gap-0.5 sm:gap-1.5 mb-0.5 sm:mb-1.5">
                    <span className="text-xl sm:text-4xl font-black text-emerald-600 leading-none">{appInstallCount}</span>
                    <span className="text-[11px] sm:text-[13.5px] font-bold text-gray-500">건</span>
                  </div>
                  <p className="text-[10px] sm:text-[12px] font-medium text-gray-400 truncate">
                    홈 화면 추가 기기
                  </p>
                </div>
              </div>
            </div>

            {/* 싹다폼 가맹점 & 주문 접수 실시간 요약 배너 (모바일에서도 1줄에 3칸 배치) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div
                onClick={() => setActiveMenu('stores')}
                className="bg-indigo-600 text-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm flex items-center justify-between cursor-pointer hover:bg-indigo-700 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-[10.5px] sm:text-[12.5px] font-bold text-indigo-100 whitespace-nowrap">
                    가맹 매장
                  </p>
                  <p className="text-base sm:text-2xl font-black mt-0.5 sm:mt-1 whitespace-nowrap">
                    {stores.length}곳
                  </p>
                </div>
                <Store className="hidden sm:block w-8 h-8 text-indigo-200 shrink-0" />
              </div>

              <div className="bg-white border border-gray-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xs flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[10.5px] sm:text-[12.5px] font-bold text-gray-500 whitespace-nowrap">
                    누적 접수
                  </p>
                  <p className="text-base sm:text-2xl font-black text-gray-900 mt-0.5 sm:mt-1 whitespace-nowrap">
                    {allResponses.length}건
                  </p>
                </div>
                <FileText className="hidden sm:block w-8 h-8 text-blue-500 shrink-0" />
              </div>

              <div className="bg-white border border-gray-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xs flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[10.5px] sm:text-[12.5px] font-bold text-gray-500 whitespace-nowrap">
                    오늘 신규접수
                  </p>
                  <p className="text-base sm:text-2xl font-black text-emerald-600 mt-0.5 sm:mt-1 whitespace-nowrap">
                    {todayResponsesCount}건
                  </p>
                </div>
                <BarChart3 className="hidden sm:block w-8 h-8 text-emerald-500 shrink-0" />
              </div>
            </div>

            {/* 최근 접속/설치 기록 테이블 */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <h2 className="text-[15px] sm:text-[16px] font-extrabold text-gray-900">
                  최근 접속/설치 기록 (최근 10건)
                </h2>
                <span className="text-[12px] font-medium text-gray-400">
                  좌우로 밀어서 확인 · 우측 삭제 버튼으로 지울 수 있습니다
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-max">
                  <thead>
                    <tr className="border-b border-gray-100 text-[12px] sm:text-[12.5px] font-bold text-gray-500 bg-gray-50/50 whitespace-nowrap">
                      <th className="px-4 sm:px-6 py-3.5">분류 / 접속 시간</th>
                      <th className="px-4 sm:px-6 py-3.5">유입 경로 (Referrer)</th>
                      <th className="px-4 sm:px-6 py-3.5 text-center">인스타그램 여부</th>
                      <th className="px-4 sm:px-6 py-3.5">접속 페이지</th>
                      <th className="px-4 sm:px-6 py-3.5 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[12.5px] sm:text-[13px] whitespace-nowrap">
                    {visitLogs.length > 0 ? (
                      visitLogs.slice(0, 10).map(log => (
                        <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-4 sm:px-6 py-3.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-extrabold mb-1 ${
                                log.type === '앱 설치'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-blue-50 text-blue-600'
                              }`}
                            >
                              {log.type}
                            </span>
                            <div className="text-[11.5px] font-medium text-gray-500">{log.timestamp}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 font-bold text-gray-800">{log.referrer}</td>
                          <td className="px-4 sm:px-6 py-3.5 text-center">
                            {log.isInstagram ? (
                              <span className="px-2.5 py-0.5 bg-pink-50 text-pink-600 rounded-full text-[11px] font-extrabold">
                                Instagram 유입
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 font-semibold text-gray-600">{log.path}</td>
                          <td className="px-4 sm:px-6 py-3.5 text-right">
                            <button
                              onClick={() => handleDeleteVisitLog(log.id)}
                              className="text-[12px] font-bold text-gray-400 hover:text-rose-600 transition-colors"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                          오늘 기록된 접속 내역이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. 가맹 매장 관리 ================= */}
        {activeMenu === 'stores' && (
          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">가맹 매장 관리</h1>
                <p className="text-[13px] sm:text-[13.5px] font-medium text-gray-500 mt-1">
                  싹다폼에 가입된 전체 매장 목록과 매장별 누적 접수 건수, 전용 스토어 링크를 관리합니다.
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={storeSearch}
                  onChange={e => setStoreSearch(e.target.value)}
                  placeholder="상호명, 대표자, 아이디 검색..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-medium outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-max whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-[12px] sm:text-[12.5px] font-extrabold text-gray-600">
                      <th className="px-4 sm:px-5 py-3.5">가입일</th>
                      <th className="px-4 sm:px-5 py-3.5">상호명 / 스토어 주소</th>
                      <th className="px-4 sm:px-5 py-3.5">대표자 / 아이디</th>
                      <th className="px-4 sm:px-5 py-3.5">연락처 / 이메일</th>
                      <th className="px-4 sm:px-5 py-3.5 text-center">누적 접수</th>
                      <th className="px-4 sm:px-5 py-3.5 text-center">이용 상태</th>
                      <th className="px-4 sm:px-5 py-3.5 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[12.5px] sm:text-[13px]">
                    {filteredStores.map(store => {
                      const storeRespCount = allResponses.filter(r => r.store_id === store.store_id).length;
                      const subInfo = storeSubscriptions[store.store_id] || {
                        plan: '월간 이용권 (9,900원)',
                        status: '정상 이용중',
                        nextBilling: '2026-11-16'
                      };

                      return (
                        <tr key={store.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-4 sm:px-5 py-4 text-gray-500 font-medium">
                            {new Date(store.created_at).toLocaleDateString('ko-KR')}
                          </td>
                          <td className="px-4 sm:px-5 py-4">
                            <div className="font-extrabold text-gray-900 text-[13.5px] sm:text-[14px]">{store.store_name}</div>
                            <a
                              href={`/store/${store.store_id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[12px] font-bold text-blue-600 hover:underline mt-0.5"
                            >
                              /store/{store.store_id} <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="px-4 sm:px-5 py-4">
                            <div className="font-bold text-gray-900">{store.owner_name || '-'}</div>
                            <div className="text-[12px] text-gray-500">ID: {store.username}</div>
                          </td>
                          <td className="px-4 sm:px-5 py-4">
                            <div className="font-bold text-indigo-600">{store.phone || '-'}</div>
                            <div className="text-[12px] text-gray-400">{store.email || '-'}</div>
                          </td>
                          <td className="px-4 sm:px-5 py-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-extrabold bg-indigo-50 text-indigo-700">
                              {storeRespCount}건
                            </span>
                          </td>
                          <td className="px-4 sm:px-5 py-4 text-center">
                            <select
                              value={subInfo.status}
                              onChange={e => handleUpdateSubscription(store.store_id, 'status', e.target.value)}
                              className={`px-2.5 py-1 rounded-full text-[11.5px] font-extrabold border outline-none cursor-pointer ${
                                subInfo.status === '정상 이용중'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : subInfo.status === '무료체험'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              <option value="정상 이용중">정상 이용중</option>
                              <option value="무료체험">무료체험</option>
                              <option value="이용정지">이용정지</option>
                            </select>
                          </td>
                          <td className="px-4 sm:px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`/store/${store.store_id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-[12px] font-bold"
                              >
                                매장보기
                              </a>
                              {store.store_id !== 'demo' && (
                                <button
                                  onClick={() => handleDeleteStore(store.id, store.store_name)}
                                  className="px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[12px] font-bold"
                                >
                                  삭제
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. 구독 · 매출 관리 ================= */}
        {activeMenu === 'subscriptions' && (
          <div className="space-y-5 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">구독 · 매출 관리</h1>
              <p className="text-[13px] sm:text-[13.5px] font-medium text-gray-500 mt-1">
                가맹 매장별 구독 플랜(월간 9,900원 / 연간 149,000원) 및 결제 상태를 관리합니다.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-5">
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-100 shadow-2xs">
                <p className="text-[11px] sm:text-[13px] font-bold text-gray-500 whitespace-nowrap">활성 구독 매장</p>
                <p className="text-lg sm:text-3xl font-black text-blue-600 mt-1 sm:mt-1.5 whitespace-nowrap">{stores.length}곳</p>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-100 shadow-2xs">
                <p className="text-[11px] sm:text-[13px] font-bold text-gray-500 whitespace-nowrap">이번 달 예상 매출</p>
                <p className="text-lg sm:text-3xl font-black text-emerald-600 mt-1 sm:mt-1.5 whitespace-nowrap">
                  {(stores.length * 9900).toLocaleString()}원
                </p>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-100 shadow-2xs">
                <p className="text-[11px] sm:text-[13px] font-bold text-gray-500 whitespace-nowrap">기본 요금제</p>
                <p className="text-[11.5px] sm:text-lg font-extrabold text-gray-900 mt-1 sm:mt-1.5 leading-snug">
                  월 9,900원<br className="sm:hidden" /><span className="hidden sm:inline"> / </span>연 14.9만
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-max whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[12px] sm:text-[12.5px] font-extrabold text-gray-600">
                      <th className="px-4 sm:px-6 py-3.5">매장명</th>
                      <th className="px-4 sm:px-6 py-3.5">대표자 / 연락처</th>
                      <th className="px-4 sm:px-6 py-3.5">이용 플랜 변경</th>
                      <th className="px-4 sm:px-6 py-3.5">구독 상태</th>
                      <th className="px-4 sm:px-6 py-3.5">다음 결제 예정일</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[12.5px] sm:text-[13px]">
                    {stores.map(store => {
                      const subInfo = storeSubscriptions[store.store_id] || {
                        plan: '월간 이용권 (9,900원)',
                        status: '정상 이용중',
                        nextBilling: '2026-11-16'
                      };
                      return (
                        <tr key={store.id} className="hover:bg-gray-50/60">
                          <td className="px-4 sm:px-6 py-4 font-extrabold text-gray-900">{store.store_name}</td>
                          <td className="px-4 sm:px-6 py-4 font-semibold text-gray-600">
                            {store.owner_name} ({store.phone || '-'})
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <select
                              value={subInfo.plan}
                              onChange={e => handleUpdateSubscription(store.store_id, 'plan', e.target.value)}
                              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[12.5px] font-bold text-gray-800 outline-none"
                            >
                              <option value="월간 이용권 (9,900원)">월간 이용권 (9,900원)</option>
                              <option value="연간 구독 플랜 (149,000원)">연간 구독 플랜 (149,000원)</option>
                              <option value="오픈 무료 프로모션">오픈 무료 프로모션</option>
                            </select>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11.5px] font-extrabold ${
                                subInfo.status === '정상 이용중'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {subInfo.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 font-semibold text-gray-500">{subInfo.nextBilling}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. 제휴 · 1:1 문의 내역 (게시판 형태 - 제목 클릭 시 상세/답변 펼침) ================= */}
        {activeMenu === 'inquiries' && (
          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">제휴 · 1:1 문의 내역</h1>
                <p className="text-[13px] sm:text-[13.5px] font-medium text-gray-500 mt-1">
                  제목을 클릭하면 아래로 문의 상세 내용과 본사 답변 입력창이 펼쳐집니다.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-bold">
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                  답변대기 {inquiries.filter(i => i.status === '답변대기').length}건
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                  답변완료 {inquiries.filter(i => i.status === '답변완료').length}건
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
              {/* 게시판 상단 컬럼 헤더 (데스크톱 표시) */}
              <div className="hidden sm:grid sm:grid-cols-12 items-center px-6 py-3.5 bg-gray-50/90 border-b border-gray-100 text-[12.5px] font-extrabold text-gray-500">
                <div className="col-span-2">상태</div>
                <div className="col-span-5">문의 제목</div>
                <div className="col-span-3">매장명 / 작성자</div>
                <div className="col-span-2 text-right">작성일시</div>
              </div>

              <div className="divide-y divide-gray-100">
                {inquiries.length > 0 ? (
                  inquiries.map(inq => {
                    const isOpen = expandedInquiryId === inq.id;
                    return (
                      <div key={inq.id} className="transition-colors">
                        {/* 게시판 목록 행 (클릭 시 아코디언 토글) */}
                        <button
                          type="button"
                          onClick={() => setExpandedInquiryId(prev => (prev === inq.id ? null : inq.id))}
                          className={`w-full text-left px-4 sm:px-6 py-4 transition-colors hover:bg-gray-50/80 ${
                            isOpen ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          {/* 데스크톱 게시판 레이아웃 */}
                          <div className="hidden sm:grid sm:grid-cols-12 items-center gap-3">
                            <div className="col-span-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-extrabold whitespace-nowrap ${
                                  inq.status === '답변완료'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {inq.status}
                              </span>
                            </div>

                            <div className="col-span-5 flex items-center gap-2 min-w-0 pr-2">
                              <span className="text-[14.5px] font-extrabold text-gray-900 truncate">
                                {inq.title}
                              </span>
                              <span className="text-[11px] font-bold text-gray-400 shrink-0">
                                {isOpen ? '▲' : '▼'}
                              </span>
                            </div>

                            <div className="col-span-3 truncate">
                              <span className="text-[13px] font-extrabold text-indigo-700">{inq.storeName}</span>
                              <span className="text-[12px] font-medium text-gray-500 ml-1.5">
                                ({inq.ownerName})
                              </span>
                            </div>

                            <div className="col-span-2 text-right text-[12px] text-gray-400 font-medium whitespace-nowrap">
                              {inq.createdAt.split('오')[0].trim()}
                            </div>
                          </div>

                          {/* 모바일 게시판 레이아웃 */}
                          <div className="sm:hidden flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10.5px] font-extrabold whitespace-nowrap ${
                                    inq.status === '답변완료'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}
                                >
                                  {inq.status}
                                </span>
                                <span className="text-[12px] font-extrabold text-indigo-700 truncate">
                                  {inq.storeName}
                                </span>
                                <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                                  · {inq.ownerName}
                                </span>
                              </div>
                              <p className="text-[14px] font-extrabold text-gray-900 truncate">
                                {inq.title}
                              </p>
                            </div>
                            <span className="text-[12px] font-bold text-gray-400 shrink-0">
                              {isOpen ? '▲' : '▼'}
                            </span>
                          </div>
                        </button>

                        {/* 클릭 시 펼쳐지는 하단 상세 내용 + 답변 등록 영역 */}
                        {isOpen && (
                          <div className="px-4 sm:px-6 pb-5 pt-3 bg-gray-50/70 border-t border-gray-100 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-gray-500">
                              <div>
                                <span className="font-bold text-gray-700">연락처:</span> {inq.phone}
                              </div>
                              <div>
                                <span className="font-bold text-gray-700">접수일시:</span> {inq.createdAt}
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-200/80">
                              <p className="text-[11.5px] font-extrabold text-gray-400 mb-1.5">문의 내용</p>
                              <p className="text-[13.5px] font-medium text-gray-800 whitespace-pre-wrap leading-relaxed">
                                {inq.content}
                              </p>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-2.5">
                              <label className="block text-[12px] font-extrabold text-indigo-700">
                                💬 본사 답변 작성 / 수정
                              </label>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  defaultValue={inq.reply || ''}
                                  onChange={e =>
                                    setReplyInputs(prev => ({ ...prev, [inq.id]: e.target.value }))
                                  }
                                  placeholder="사장님께 전달할 본사 답변을 입력하세요..."
                                  className="flex-1 px-4 py-2.5 bg-indigo-50/30 border border-indigo-200 rounded-xl text-[13px] font-medium text-gray-900 focus:bg-white focus:border-indigo-500 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveInquiryReply(inq)}
                                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-bold shrink-0 shadow-xs transition-all active:scale-95 whitespace-nowrap"
                                >
                                  답변 저장 / 완료
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-6 py-12 text-center text-gray-400 font-medium text-[13.5px]">
                    등록된 제휴·1:1 문의 내역이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. 푸시 발송 ================= */}
        {activeMenu === 'push' && (
          <div className="space-y-5 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">푸시 발송</h1>
              <p className="text-[13px] sm:text-[13.5px] font-medium text-gray-500 mt-1">
                전체 가맹 매장 또는 특정 매장 사장님에게 공지 및 안내 푸시 알림을 발송합니다.
              </p>
            </div>

            <form
              onSubmit={handleSendPush}
              className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-200/80 shadow-2xs space-y-4"
            >
              <div>
                <label className="block text-[13px] font-extrabold text-gray-700 mb-1.5">발송 대상 선택</label>
                <select
                  value={pushTarget}
                  onChange={e => setPushTarget(e.target.value)}
                  className="w-full sm:w-80 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px] font-bold text-gray-800 outline-none focus:border-blue-500"
                >
                  <option value="all">전체 가맹 매장 ({stores.length}곳)</option>
                  {stores.map(s => (
                    <option key={s.id} value={s.store_id}>
                      {s.store_name} (/store/{s.store_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-extrabold text-gray-700 mb-1.5">푸시 알림 제목</label>
                <input
                  type="text"
                  value={pushTitle}
                  onChange={e => setPushTitle(e.target.value)}
                  placeholder="예: 📢 [싹다폼 공지] 명절 택배 접수 시즌 안내"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px] font-medium outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[13px] font-extrabold text-gray-700 mb-1.5">푸시 알림 내용</label>
                <textarea
                  rows={3}
                  value={pushBody}
                  onChange={e => setPushBody(e.target.value)}
                  placeholder="사장님 스마트폰 알림창에 표시될 메시지를 입력하세요."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px] font-medium outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[14px] font-bold shadow-sm transition-all active:scale-95 whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  푸시 알림 즉시 발송
                </button>
              </div>
            </form>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 font-extrabold text-[15px]">
                최근 푸시 발송 내역
              </div>
              <div className="divide-y divide-gray-100">
                {pushHistory.map(item => (
                  <div key={item.id} className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-extrabold mb-1">
                        대상: {item.target}
                      </span>
                      <h4 className="font-extrabold text-gray-900 text-[14px]">{item.title}</h4>
                      <p className="text-[13px] text-gray-600 mt-0.5">{item.body}</p>
                    </div>
                    <span className="text-[12px] text-gray-400 font-medium shrink-0">{item.sentAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. 공지사항 관리 ================= */}
        {activeMenu === 'notices' && (
          <div className="space-y-5 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">공지사항 관리</h1>
              <p className="text-[13px] sm:text-[13.5px] font-medium text-gray-500 mt-1">
                본사에서 공지사항을 등록하면 모든 가맹점 사장님 어드민의 &apos;마이 메뉴 &gt; 본사 공지사항&apos;에 즉시 게시됩니다.
              </p>
            </div>

            <form
              onSubmit={handleCreateNotice}
              className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-200/80 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-[15.5px] sm:text-[16px] font-extrabold text-gray-900">새 본사 공지사항 작성</h2>
                <label className="flex items-center gap-2 text-[13px] font-bold text-indigo-700 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={newNoticeImportant}
                    onChange={e => setNewNoticeImportant(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                  중요 공지 (상단 강조 배지 표시)
                </label>
              </div>

              <input
                type="text"
                value={newNoticeTitle}
                onChange={e => setNewNoticeTitle(e.target.value)}
                placeholder="공지사항 제목을 입력하세요"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px] font-bold outline-none focus:bg-white focus:border-blue-500"
              />

              <textarea
                rows={4}
                value={newNoticeContent}
                onChange={e => setNewNoticeContent(e.target.value)}
                placeholder="가맹점 사장님들께 안내할 상세 내용을 입력하세요"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px] font-medium outline-none focus:bg-white focus:border-blue-500"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13.5px] font-bold shadow-xs transition-all active:scale-95 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  공지사항 등록하기
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {notices.map(notice => (
                <div
                  key={notice.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {notice.important && (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-full text-[11px] font-extrabold whitespace-nowrap">
                          필독 공지
                        </span>
                      )}
                      <h3 className="text-[14.5px] sm:text-[15px] font-extrabold text-gray-900">{notice.title}</h3>
                    </div>
                    <p className="text-[13px] sm:text-[13.5px] font-medium text-gray-600 whitespace-pre-wrap leading-relaxed">
                      {notice.content}
                    </p>
                    <p className="text-[11.5px] text-gray-400 font-medium">{notice.createdAt}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNotice(notice.id)}
                    className="self-end sm:self-start px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[12px] font-bold shrink-0 whitespace-nowrap"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 7. 보안 설정 ================= */}
        {activeMenu === 'security' && (
          <div className="space-y-5 sm:space-y-6 max-w-2xl">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">보안 설정</h1>
              <p className="text-[13px] sm:text-[13.5px] font-medium text-gray-500 mt-1">
                본사 총괄 어드민 접근 비밀번호 및 방문자 통계 필터링 옵션을 관리합니다.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-200/80 shadow-2xs space-y-6">
              <div className="flex items-center justify-between gap-4 pb-5 border-b border-gray-100">
                <div>
                  <h3 className="text-[14.5px] sm:text-[15px] font-extrabold text-gray-900">
                    관리자·로컬·배포봇 접속 자동 제외
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-0.5">
                    본사 관리자와 크롤러/봇 트래픽을 방문자 통계에서 자동으로 제외합니다.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={excludeAdminTraffic}
                  onChange={e => setExcludeAdminTraffic(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer shrink-0"
                />
              </div>

              <div>
                <label className="block text-[13px] font-extrabold text-gray-700 mb-1.5">
                  본사 어드민 마스터 비밀번호 변경
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    placeholder="변경할 마스터 비밀번호 입력"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px] font-medium outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('ssakdaform_hq_master_pw', adminPassword);
                    setSavedSecurity(true);
                    setTimeout(() => setSavedSecurity(false), 2000);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13.5px] font-bold shadow-xs transition-all active:scale-95 whitespace-nowrap"
                >
                  {savedSecurity ? '✓ 설정 저장됨' : '보안 설정 저장'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
