'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import {MobileMenu} from '@/components/MobileMenu';
import MobileNavigation from '@/components/MobileNavigation';

export default function LayoutClient({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('کاربر مهمان');
  const [userLevel, setUserLevel] = useState('کاربر عادی');

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onMenuClick={() => setIsMobileMenuOpen(true)}
        showNotifications={true}
        userName={userName}
      />
      
      {/* <main className="flex-1 max-w-md mx-auto bg-slate-100 min-h-screen flex flex-col pt-24 pb-24"> */}
      <main className="flex-1" >
      {children}
      </main>
      
      {/* </main> */}

      <MobileNavigation />

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        userName={userName}
        userLevel={userLevel}
      />
    </div>
  );
}