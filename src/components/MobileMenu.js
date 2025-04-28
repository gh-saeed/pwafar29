// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { Home, User, Bell, Scroll, LogOut } from 'lucide-react';

// const MobileMenu = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const menuItems = [
//     {
//       title: 'داشبورد',
//       icon: <Home className="w-5 h-5" />,
//       href: '/',
//     },
//     {
//       title: 'خرید اشتراک',
//       icon: <User className="w-5 h-5" />,
//       href: '/subscription',
//     },
//     {
//       title: 'اطلاعیه‌ها',
//       icon: <Bell className="w-5 h-5" />,
//       href: '/notifications',
//     },
//     {
//       title: 'پشتیبانی',
//       icon: <Scroll className="w-5 h-5" />,
//       href: '/support',
//     },
//     {
//       title: 'خروج از سامانه',
//       icon: <LogOut className="w-5 h-5" />,
//       href: '/logout',
//       className: 'hover:bg-red-600',
//     },
//   ];

//   return (
//     < >
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-12 h-12 bg-white rounded-lg flex items-center justify-center"
//       >
//         <div className="w-6 h-6 flex flex-col justify-between">
//           <span className={`block w-full h-0.5 bg-teal-600 transition-transform ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
//           <span className={`block w-full h-0.5 bg-teal-600 transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
//           <span className={`block w-full h-0.5 bg-teal-600 transition-transform ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
//         </div>
//       </button>

//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
//           <div className="fixed inset-0" onClick={() => setIsOpen(false)}></div>
//           <aside className="fixed right-0 top-0 w-72 bg-teal-800 h-screen rounded-l-xl p-4 flex flex-col gap-4">
//             {/* پروفایل کاربر */}
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-full border border-white bg-gray-200 flex items-center justify-center">
//                 <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
//               </div>
//               <div>
//                 <div className="text-lg font-bold">سعید قاسم خانی</div>
//                 <div className="text-sm text-gray-300">سطح رایگان</div>
//               </div>
//             </div>

//             {/* امتیاز */}
//             <div className="bg-teal-700 rounded-lg p-3 text-center text-sm mt-2">
//               امتیاز باشگاه مشتریان
//             </div>

//             {/* آیتم‌های منو */}
//             <nav className="flex flex-col gap-2 text-sm mt-4">
//               {menuItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`flex items-center justify-between bg-teal-700 p-3 rounded-md hover:bg-teal-600 ${item.className || ''}`}
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <span>{item.title}</span>
//                   {item.icon}
//                 </Link>
//               ))}
//             </nav>

//             {/* دکوراتورها */}
//             <div className="mt-auto flex justify-center gap-2 opacity-50">
//               <div className="w-4 h-4 rounded-full bg-pink-400"></div>
//               <div className="w-3 h-3 rounded-full bg-orange-400"></div>
//               <div className="w-2 h-2 rounded-full bg-blue-400"></div>
//               <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
//             </div>
//           </aside>
//         </div>
//       )}
//     </>
//   );
// };

// export default MobileMenu; 




'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { Home, User, Bell, Scroll, LogOut } from 'lucide-react';

// const MobileMenu = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const menuItems = [
//     {
//       title: 'داشبورد',
//       icon: <Home className="w-5 h-5" />,
//       href: '/',
//     },
//     {
//       title: 'خرید اشتراک',
//       icon: <User className="w-5 h-5" />,
//       href: '/subscription',
//     },
//     {
//       title: 'اطلاعیه‌ها',
//       icon: <Bell className="w-5 h-5" />,
//       href: '/notifications',
//     },
//     {
//       title: 'پشتیبانی',
//       icon: <Scroll className="w-5 h-5" />,
//       href: '/support',
//     },
//     {
//       title: 'خروج از سامانه',
//       icon: <LogOut className="w-5 h-5" />,
//       href: '/logout',
//       className: 'hover:bg-red-600',
//     },
//   ];

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-12 h-12 bg-white rounded-lg flex items-center justify-center"
//       >
//         <div className="w-6 h-6 flex flex-col justify-between">
//           <span className={`block w-full h-0.5 bg-teal-600 transition-transform ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
//           <span className={`block w-full h-0.5 bg-teal-600 transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
//           <span className={`block w-full h-0.5 bg-teal-600 transition-transform ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
//         </div>
//       </button>

//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
//           <div className="fixed inset-0" onClick={() => setIsOpen(false)}></div>
//           <aside className="fixed w-72 bg-white h-screen rounded-r-xl p-4 flex flex-col gap-4 shadow-lg">
//             {/* پروفایل کاربر */}
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-full border border-teal-600 bg-white flex items-center justify-center">
//                 <div className="w-10 h-10 bg-teal-100 rounded-full"></div>
//               </div>
//               <div>
//                 <div className="text-lg font-bold text-gray-800">سعید قاسم خانی</div>
//                 <div className="text-sm text-gray-500">سطح رایگان</div>
//               </div>
//             </div>

//             {/* امتیاز */}
//             <div className="bg-teal-50 rounded-lg p-3 text-center text-sm mt-2 text-teal-600 border border-teal-100">
//               امتیاز باشگاه مشتریان
//             </div>

//             {/* آیتم‌های منو */}
//             <nav className="flex flex-col gap-2 text-sm mt-4">
//               {menuItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`flex items-center justify-between p-3 rounded-md hover:bg-teal-50 text-gray-700 hover:text-teal-600 ${item.className || ''}`}
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <span>{item.title}</span>
//                   {item.icon}
//                 </Link>
//               ))}
//             </nav>

//             {/* دکوراتورها */}
//             <div className="mt-auto flex justify-center gap-2 opacity-50">
//               <div className="w-4 h-4 rounded-full bg-teal-100"></div>
//               <div className="w-3 h-3 rounded-full bg-teal-200"></div>
//               <div className="w-2 h-2 rounded-full bg-teal-300"></div>
//               <div className="w-2 h-2 rounded-full bg-teal-400"></div>
//             </div>
//           </aside>
//         </div>
//       )}
//     </>
//   );
// };

// export default MobileMenu; 



// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";

// const menuItems = [
//   { title: "داشبورد", href: "/dashboard", icon: <span>🏠</span> },
//   { title: "پروفایل", href: "/profile", icon: <span>👤</span> },
//   { title: "تنظیمات", href: "/settings", icon: <span>⚙️</span> },
// ];

// export const MobileMenu = ({ isOpen, onClose, animated = true }) => {
//   const menuContent = (
//     <div className="fixed inset-0 z-50 flex">
//       <div className="flex-1 bg-black bg-opacity-50" onClick={onClose}></div>
//       <aside className="fixed top-0 right-0 w-72 bg-white h-full rounded-r-xl p-4 flex flex-col gap-4 shadow-lg">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-full border border-teal-600 bg-white flex items-center justify-center">
//             <div className="w-10 h-10 bg-teal-100 rounded-full"></div>
//           </div>
//           <div>
//             <div className="text-lg font-bold text-gray-800">سعید قاسم خانی</div>
//             <div className="text-sm text-gray-500">سطح رایگان</div>
//           </div>
//         </div>

//         <div className="bg-teal-50 rounded-lg p-3 text-center text-sm mt-2 text-teal-600 border border-teal-100">
//           امتیاز باشگاه مشتریان
//         </div>

//         <nav className="flex flex-col gap-2 text-sm mt-4">
//           {menuItems.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               className="flex items-center justify-between p-3 rounded-md hover:bg-teal-50 text-gray-700 hover:text-teal-600"
//               onClick={onClose}
//             >
//               <span>{item.title}</span>
//               {item.icon}
//             </Link>
//           ))}
//         </nav>

//         <div className="mt-auto flex justify-center gap-2 opacity-50">
//           <div className="w-4 h-4 rounded-full bg-teal-100"></div>
//           <div className="w-3 h-3 rounded-full bg-teal-200"></div>
//           <div className="w-2 h-2 rounded-full bg-teal-300"></div>
//           <div className="w-2 h-2 rounded-full bg-teal-400"></div>
//         </div>
//       </aside>
//     </div>
//   );

//   return (
//     <AnimatePresence>
//       {isOpen && animated ? (
//         <motion.div
//           key="sidebar"
//           initial={{ x: 300, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           exit={{ x: 300, opacity: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           {menuContent}
//         </motion.div>
//       ) : isOpen ? (
//         menuContent
//       ) : null}
//     </AnimatePresence>
//   );
// };



import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Home, User, Bell, Scroll, LogOut } from 'lucide-react';

const menuItems = [
  {
          title: 'داشبورد',
          icon: <Home className="w-5 h-5" />,
          href: '/',
        },
        {
          title: 'خرید اشتراک',
          icon: <User className="w-5 h-5" />,
          href: '/subscription',
        },
        {
          title: 'اطلاعیه‌ها',
          icon: <Bell className="w-5 h-5" />,
          href: '/notifications',
        },
        {
          title: 'پشتیبانی',
          icon: <Scroll className="w-5 h-5" />,
          href: '/support',
        },
        {
          title: 'خروج از سامانه',
          icon: <LogOut className="w-5 h-5" />,
          href: '/logout',
          className: 'hover:bg-red-600',
        },
];

export const MobileMenu = ({ isOpen, onClose, animated = true }) => {
  const menuContent = (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black bg-opacity-50" onClick={onClose}></div>
      <aside className="fixed top-0 right-0 w-72 bg-white h-full rounded-r-xl p-4 flex flex-col gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-teal-600 bg-white flex items-center justify-center">
            <div className="w-10 h-10 bg-teal-100 rounded-full"></div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-800">سعید قاسم خانی</div>
            <div className="text-sm text-gray-500">سطح رایگان</div>
          </div>
        </div>

        <div className="bg-teal-50 rounded-lg p-3 text-center text-sm mt-2 text-teal-600 border border-teal-100">
          امتیاز باشگاه مشتریان
        </div>

        <nav className="flex flex-col gap-2 text-sm mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between p-3 rounded-md hover:bg-teal-50 text-gray-700 hover:text-teal-600"
              onClick={onClose}
            >
              <span>{item.title}</span>
              {item.icon}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex justify-center gap-2 opacity-50">
          <div className="w-4 h-4 rounded-full bg-teal-100"></div>
          <div className="w-3 h-3 rounded-full bg-teal-200"></div>
          <div className="w-2 h-2 rounded-full bg-teal-300"></div>
          <div className="w-2 h-2 rounded-full bg-teal-400"></div>
        </div>
      </aside>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && animated ? (
        <motion.div
        key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
        >
          {menuContent}
        </motion.div>
      ) : isOpen ? (
        menuContent
      ) : null}
    </AnimatePresence>

//     <AnimatePresence>
//   {isOpen && (
//     <>
//       <motion.div
//         key="overlay"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.2 }}
//         className="fixed inset-0 bg-black/50 z-50"
//         onClick={onClose}
//       />
//       <motion.aside
//         key="sidebar"
//         initial={{ x: "100%", opacity: 0.5 }}
//         animate={{ 
//           x: 0,
//           opacity: 1,
//           transition: {
//             type: "spring",
//             stiffness: 300,
//             damping: 30
//           }
//         }}
//         exit={{ 
//           x: "100%",
//           opacity: 0,
//           transition: { 
//             type: "spring",
//             stiffness: 400,
//             damping: 40
//           }
//         }}
//         className="fixed top-0 right-0 w-72 bg-white h-full rounded-l-xl p-4 flex flex-col gap-4 shadow-lg z-50"
//       >
//         {menuContent}
//       </motion.aside>
//     </>
//   )}
// </AnimatePresence>
  );
};
