"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 고객용 페이지 (form, preview) 인지 확인
  const isCustomerPage = pathname?.startsWith('/form/') || pathname?.startsWith('/preview');

  // 고객용 페이지인 경우 사이드바와 마진을 렌더링하지 않음
  if (isCustomerPage) {
    return <main className="w-full min-h-screen bg-[#F9F9F8] text-gray-900">{children}</main>;
  }

  // 어드민 페이지인 경우 기존 레이아웃 유지
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <main className="flex-1 w-full md:ml-64 p-4 pt-24 md:p-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}
