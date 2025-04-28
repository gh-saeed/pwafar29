'use client';

import { useState } from 'react';
import { Home, MessageSquareText, BookText, Users, Star, X, ShoppingCart, CreditCard, Package } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const NavItem = ({ icon, label, href }) => {
  return (
    <a href={href} className="flex flex-col items-center justify-center">
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </a>
  );
};

const StarMenu = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center absolute -top-4 z-10"
      >
        {isOpen ? (
          <X className="w-8 h-8 text-white" />
        ) : (
          <Star className="w-8 h-8 text-white" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="absolute -top-20 transform -translate-x-1/2 flex justify-center items-center gap-11 px-10 py-3 bg-teal-700 rounded-2xl text-white shadow-x"
          >
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = item.href;
                }}
                className="flex flex-col items-center text-sm cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="text-2xl">{item.icon}</div>
                <span className="mt-1">{item.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BottomNavigation = () => {

  const starMenuItems = [
    {
      label: 'سبد خرید',
      icon: <ShoppingCart className="w-5 h-5" />,
      href: '/cart'
    },
    {
      label: 'پرداخت',
      icon: <CreditCard className="w-5 h-5" />,
      href: '/payment'
    },
    {
      label: 'سفارشات',
      icon: <Package className="w-5 h-5" />,
      href: '/orders'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-40">
      <div className="mx-auto w-full max-w-md">
        <div className="grid grid-cols-5 bg-white py-4 rounded-t-xl shadow-lg">
          <NavItem icon={<Home className="w-6 h-6" />} label="خانه" href="/" />
          <NavItem icon={<MessageSquareText className="w-6 h-6" />} label="اخبار" href="/news" />
          <StarMenu items={starMenuItems} />
          <NavItem icon={<BookText className="w-6 h-6" />} label="آموزش" href="/education" />
          <NavItem icon={<Users className="w-6 h-6" />} label="حساب کاربری" href="/profile" />
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;