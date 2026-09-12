"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Calendar, UserPlus, FileText, Settings, LayoutDashboard, Menu, X, Link as LinkIcon, CheckCircle2, ExternalLink, ShoppingBag } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const storeSlug = 'demo'; 
  const storeLink = `${origin}/store/${storeSlug}`;

  const handleCopyLink = () => {
    if (!origin) return;
    navigator.clipboard.writeText(storeLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return isActive
      ? "flex items-center gap-3 px-4 py-3 text-indigo-800 bg-indigo-100 rounded-lg font-bold transition-colors"
      : "flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg font-medium transition-colors";
  };

  return (
    <>
      {/* 모바일 상단 바 (햄버거 메뉴) */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4 fixed top-0 w-full z-40 shadow-sm">
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <Package className="w-5 h-5" />
          싹다폼 Admin
        </h1>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 bg-gray-50 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 모바일 메뉴 열렸을 때 뒷배경 (어둡게) */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 사이드바 본체 */}
      <aside className={`
        w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 pb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <Package className="w-6 h-6" />
            싹다폼 Admin
          </h1>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* 내 매장 링크 복사 버튼 */}
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-50 border border-indigo-100 rounded-xl p-3 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-indigo-800">내 매장 통합 접속 링크</span>
              <Link href={`/store/${storeSlug}`} target="_blank" className="text-indigo-600 hover:text-indigo-800 p-1 hover:bg-indigo-100 rounded transition-colors" title="새 창으로 열기">
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
            <button 
              onClick={handleCopyLink}
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
                copied 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 active:scale-95'
              }`}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
              {copied ? '복사 완료!' : '링크 복사하기'}
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto">
          <Link href="/" onClick={() => setIsOpen(false)} className={getLinkClass("/")}>
            <LayoutDashboard className="w-5 h-5" />
            대시보드
          </Link>
          <Link href="/delivery-list" onClick={() => setIsOpen(false)} className={getLinkClass("/delivery-list")}>
            <FileText className="w-5 h-5" />
            택배 신청 현황
          </Link>
          <Link href="/reservation-list" onClick={() => setIsOpen(false)} className={getLinkClass("/reservation-list")}>
            <Calendar className="w-5 h-5" />
            매장 예약 현황
          </Link>
          <Link href="/order-list" onClick={() => setIsOpen(false)} className={getLinkClass("/order-list")}>
            <ShoppingBag className="w-5 h-5" />
            상품 주문 현황
          </Link>
          <Link href="/form-builder" onClick={() => setIsOpen(false)} className={getLinkClass("/form-builder")}>
            <Package className="w-5 h-5" />
            맞춤형 폼 만들기
          </Link>

        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Link href="/settings" onClick={() => setIsOpen(false)} className={getLinkClass("/settings")}>
            <Settings className="w-5 h-5" />
            환경 설정
          </Link>
        </div>
      </aside>
    </>
  );
}
