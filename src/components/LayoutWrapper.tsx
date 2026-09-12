"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 고객용 페이지 (form, preview, store hub) 인지 확인
  const isCustomerPage = pathname?.startsWith('/form/') || pathname?.startsWith('/preview') || pathname?.startsWith('/store/');

  // 고객용 페이지인 경우 사이드바와 마진을 렌더링하지 않음
  if (isCustomerPage) {
    return <main className="w-full min-h-screen bg-[#F9F9F8] text-gray-900">{children}</main>;
  }

  // 어드민 페이지도 사이드바 없이 전체 화면으로 렌더링
  return (
    <main className="w-full min-h-screen bg-gray-50 text-gray-900">
      {children}
    </main>
  );
}
