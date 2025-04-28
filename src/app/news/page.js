'use client';

import NewsSection from '@/components/NewsSection';
import { Home, MessageSquareText, BookText, Users } from 'lucide-react';
import MobileNavigation from '@/components/MobileNavigation';
import { usePathname } from 'next/navigation';
import LayoutClient from '@/components/LayoutClient';

export default function NewsPage() {
  const pathname = usePathname();
  
  

  return (
    <LayoutClient>
    <div className="max-w-md mx-auto bg-slate-100 min-h-screen pt-24 pb-24">
      <NewsSection />
      
      {/* Bottom Navigation */}
      <MobileNavigation />
    </div>
    </LayoutClient>
  );
}