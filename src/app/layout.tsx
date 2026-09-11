import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "싹다폼 Admin",
  description: "싹다폼 관리자 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 w-full md:ml-64 p-4 pt-24 md:p-8 md:pt-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
