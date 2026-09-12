"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Package, Calendar, UserPlus, FileText, Settings, LayoutDashboard, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return isActive
      ? "flex items-center gap-3 px-4 py-3 text-green-700 bg-green-50 rounded-lg font-medium transition-colors"
      : "flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors";
  };

  return (
    <>
      {/* 모바일 상단 바 (햄버거 메뉴) */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4 fixed top-0 w-full z-40 shadow-sm">
        <h1 className="text-xl font-bold text-green-600 flex items-center gap-2">
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
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-600 flex items-center gap-2">
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
        
        <nav className="flex-1 px-4 space-y-2 mt-2 overflow-y-auto">
          <Link href="/" onClick={() => setIsOpen(false)} className={getLinkClass("/")}>
            <LayoutDashboard className="w-5 h-5" />
            대시보드
          </Link>
          <Link href="/delivery-list" onClick={() => setIsOpen(false)} className={getLinkClass("/delivery-list")}>
            <FileText className="w-5 h-5" />
            택배 신청 현황
          </Link>
          <Link href="/form-builder" onClick={() => setIsOpen(false)} className={getLinkClass("/form-builder")}>
            <Package className="w-5 h-5" />
            맞춤형 폼 만들기
          </Link>
          <Link href="/form-delivery" onClick={() => setIsOpen(false)} className={getLinkClass("/form-delivery")}>
            <Package className="w-5 h-5" />
            간편한 택배 접수
          </Link>
          <Link href="/form-reservation" onClick={() => setIsOpen(false)} className={getLinkClass("/form-reservation")}>
            <Calendar className="w-5 h-5" />
            예약 신청서
          </Link>
          <Link href="/form-signup" onClick={() => setIsOpen(false)} className={getLinkClass("/form-signup")}>
            <UserPlus className="w-5 h-5" />
            회원가입 신청서
          </Link>
          <Link href="/form-basic" onClick={() => setIsOpen(false)} className={getLinkClass("/form-basic")}>
            <FileText className="w-5 h-5" />
            기본 신청서 폼
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
