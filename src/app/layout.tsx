import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "싹다폼 Admin",
  description: "싹다폼 관리자 대시보드",
  icons: {
    icon: "/icon-192.png?v=7",
    apple: "/apple-touch-icon.png?v=7",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      
        <script dangerouslySetInnerHTML={{
          __html: `
            
            window.deferredPrompt = null;
            window.addEventListener('beforeinstallprompt', function(e) {
              e.preventDefault();
              window.deferredPrompt = e;
            });
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js?v=4').then(function(registration) {
                  registration.update();
                  console.log('SW v4 registered');
                }, function(err) {
                  console.log('SW registration failed: ', err);
                });
              });
            }
          `
        }} />
</body>
    </html>
  );
}
