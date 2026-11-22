"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 고객용 페이지 (form, preview, store hub, hanook 미니블로그) 인지 확인
  const isCustomerPage =
    pathname?.startsWith('/form/') ||
    pathname?.startsWith('/f/') ||
    pathname?.startsWith('/preview') ||
    pathname?.startsWith('/store/') ||
    pathname?.startsWith('/hanook');

  useEffect(() => {
    if (typeof document === 'undefined' || !pathname) return;

    // 어드민 홈('/') 등 고객 페이지가 아닐 때만 어드민 manifest를 주입하고,
    // /store/[slug] 나 /hanook 페이지에서는 해당 페이지 고유의 manifest만 유지하도록 정리
    const allManifests = Array.from(document.querySelectorAll('link[rel="manifest"]'));

    if (pathname.startsWith('/store/')) {
      const slug = pathname.split('/')[2] || 'demo';
      try {
        localStorage.setItem('ssakdaform_last_customer_store', slug);
      } catch {}
      const targetHref = `/api/manifest/store/${encodeURIComponent(slug)}`;
      allManifests.forEach((el) => {
        const href = el.getAttribute('href') || '';
        if (!href.includes('/api/manifest/store/')) {
          el.remove();
        }
      });
      if (!document.querySelector(`link[rel="manifest"][href^="/api/manifest/store/"]`)) {
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = targetHref;
        document.head.appendChild(link);
      }
    } else if (pathname.startsWith('/f/')) {
      const storeId = pathname.split('/')[2] || 'demo';
      try {
        localStorage.setItem('ssakdaform_last_customer_store', storeId);
      } catch {}
      const targetHref = `/api/manifest/store/${encodeURIComponent(storeId)}`;
      allManifests.forEach((el) => el.remove());
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = targetHref;
      document.head.appendChild(link);
    } else if (!pathname.startsWith('/hanook')) {
      // 이중 안전장치: 만약 사장님으로 로그인하지 않은 고객 기기에서 홈화면 아이콘이 루트('/')로 열렸다면
      // 마지막으로 방문했던 매장 고객 화면(/store/매장ID)으로 즉시 자동 이동
      if (pathname === '/') {
        try {
          const loggedInAdmin = localStorage.getItem('ssakdaform_logged_in_store');
          const lastCustomerStore = localStorage.getItem('ssakdaform_last_customer_store');
          if (!loggedInAdmin && lastCustomerStore) {
            window.location.replace(`/store/${encodeURIComponent(lastCustomerStore)}`);
            return;
          }
        } catch {}
      }

      const hasAdminManifest = allManifests.some((el) =>
        (el.getAttribute('href') || '').includes('/manifest.json')
      );
      if (!hasAdminManifest) {
        allManifests.forEach((el) => el.remove());
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = '/manifest.json?v=6';
        document.head.appendChild(link);
      }
    }
  }, [pathname]);

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
