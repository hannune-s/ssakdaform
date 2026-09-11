import Link from 'next/link';
import { Package, Calendar, UserPlus, FileText, Settings, LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-green-600 flex items-center gap-2">
          <Package className="w-6 h-6" />
          싹다폼 Admin
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg font-medium transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          대시보드
        </Link>
        <Link href="/form-delivery" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
          <Package className="w-5 h-5" />
          간편한 택배 접수
        </Link>
        <Link href="/form-reservation" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
          <Calendar className="w-5 h-5" />
          예약 신청서
        </Link>
        <Link href="/form-signup" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
          <UserPlus className="w-5 h-5" />
          회원가입 신청서
        </Link>
        <Link href="/form-basic" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
          <FileText className="w-5 h-5" />
          기본 신청서 폼
        </Link>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          환경 설정
        </Link>
      </div>
    </aside>
  );
}
