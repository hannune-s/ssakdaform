"use client";

import { useState, useEffect } from 'react';
import { Store, Copy, ExternalLink, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function StoreLinkBox() {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // 향후 DB 연동 시 로그인한 사용자의 상점 슬러그를 가져옵니다.
  const storeSlug = 'demo'; 
  const storeLink = `${origin}/store/${storeSlug}`;

  const handleCopy = () => {
    if (!origin) return;
    navigator.clipboard.writeText(storeLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 sm:p-7 shadow-md mb-8 text-white flex flex-col lg:flex-row items-center justify-between gap-5 relative overflow-hidden">
      {/* 배경 장식용 원 */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      
      <div className="flex items-center gap-4 w-full lg:w-auto relative z-10">
        <div className="bg-white/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm shadow-inner">
          <Store className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1 tracking-tight">우리 매장 통합 접속 링크</h2>
          <p className="text-emerald-100 text-sm sm:text-base">이 링크 하나만 명함이나 카톡에 남겨두시면 모든 접수가 끝납니다.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 w-full lg:w-auto bg-black/15 p-2 pl-4 rounded-xl backdrop-blur-sm border border-white/20 relative z-10">
        <span className="text-emerald-50 font-mono text-sm sm:text-base truncate max-w-[200px] sm:max-w-[300px]">
          {origin ? `/store/${storeSlug}` : '로딩중...'}
        </span>
        <div className="flex gap-2 shrink-0 ml-auto">
          <button 
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
              copied 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-white text-emerald-700 hover:bg-emerald-50 active:scale-95'
            }`}
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? '복사됨' : '링크 복사'}
          </button>
          <Link 
            href={`/store/${storeSlug}`}
            target="_blank"
            className="flex items-center justify-center px-3 py-2.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors active:scale-95"
            title="새 창으로 띄워보기"
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
