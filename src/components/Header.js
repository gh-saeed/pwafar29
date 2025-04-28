// import React from 'react';
// import { Bell } from 'lucide-react';
// import MobileMenu from './MobileMenu';

// const Header = () => {
//   return (
//     <div className="flex justify-between items-center p-4">
//       <MobileMenu />

//       <div className="flex items-center">
//         <div className="w-10 h-10 ml-2">
//           <div className="w-full h-full rounded-full bg-teal-600 flex items-center justify-center">
//             <div className="w-7 h-7 bg-white rounded-full"></div>
//           </div>
//         </div>
//         <span className="text-2xl font-bold text-gray-800">فیرامو</span>
//       </div>

      

//       <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center relative">
//         <Bell className="w-6 h-6 text-teal-600" />
//         <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
//       </div>
//     </div>
//   );
// };

// export default Header; 


// import { useState, useEffect } from "react";
// import { Bell } from "lucide-react";
// import { MobileMenu } from "./MobileMenu";

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     document.body.classList.toggle("overflow-hidden", isOpen);
//   }, [isOpen]);

//   return (
//     <>
//       <div className="flex justify-between items-center p-4">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="w-12 h-12 bg-white rounded-lg flex items-center justify-center"
//         >
//           <div className="w-6 h-6 flex flex-col justify-between">
//             <span className={`block w-full h-0.5 bg-teal-600 transition-transform ${isOpen ? "rotate-45 translate-y-2.5" : ""}`}></span>
//             <span className={`block w-full h-0.5 bg-teal-600 transition-opacity ${isOpen ? "opacity-0" : ""}`}></span>
//             <span className={`block w-full h-0.5 bg-teal-600 transition-transform ${isOpen ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
//           </div>
//         </button>

//         <div className="flex items-center">
//           <div className="w-10 h-10 ml-2">
//             <div className="w-full h-full rounded-full bg-teal-600 flex items-center justify-center">
//               <div className="w-7 h-7 bg-white rounded-full"></div>
//             </div>
//           </div>
//           <span className="text-2xl font-bold text-gray-800">فیرامو</span>
//         </div>

//         <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center relative">
//           <Bell className="w-6 h-6 text-teal-600" />
//           <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
//         </div>
//       </div>

//       <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} animated={true} />
//     </>
//   );
// };

// export default Header;


'use client';

import { useState, useEffect } from "react";
import { Bell, ArrowRight, ArrowLeft } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoData, setLogoData] = useState({});
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
  }, [isOpen]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchLogoSettings();
  }, []);

  const fetchLogoSettings = async () => {
    try {
      const response = await fetch('/api/settings/logo');
      if (response.ok) {
        const data = await response.json();
        setLogoData(data);
      }
    } catch (error) {
      console.error('Error fetching logo settings:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
    <div className="fixed top-0 left-0 right-0 z-50">
      <div 
        className={`mx-auto w-full max-w-md px-4 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-slate-100"
        }`}
      >
        
        <div className="flex justify-between items-center py-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 bg-white rounded-lg flex items-center justify-center"
          >
            <div className="w-6 h-6 flex flex-col justify-between">
              <span className={`block w-full h-0.5 bg-teal-600 transition-transform ${isOpen ? "rotate-45 translate-y-2.5" : ""}`}></span>
              <span className={`block w-full h-0.5 bg-teal-600 transition-opacity ${isOpen ? "opacity-0" : ""}`}></span>
              <span className={`block w-full h-0.5 bg-teal-600 transition-transform ${isOpen ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
            </div>
          </button>

          <div className="flex items-center">
            {logoData.useImage && logoData.imageUrl ? (
              <div className="w-10 h-10 ml-2">
                <img 
                  src={logoData.imageUrl} 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            ) : null}
            {logoData.useText && (
              <span className="text-2xl font-bold text-gray-800">{logoData.text}</span>
            )}
          </div>

          <div className="relative">
            {isHomePage ? (
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-12 h-12 bg-white rounded-lg flex items-center justify-center relative"
              >
                <Bell className="w-6 h-6 text-teal-600" />
                {unreadCount > 0 && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            ) : (
              <button
                onClick={() => router.back()}
                className="w-12 h-12 bg-white rounded-lg flex items-center justify-center"
              >
                <ArrowLeft className="w-6 h-6 text-teal-600" />
              </button>
            )}

            {/* {isHomePage && showNotifications && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                <div className="p-4 border-b">
                  <h3 className="font-bold text-gray-800">اعلانات</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      هیچ اعلانی وجود ندارد
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 border-b ${
                          !notification.isRead ? 'bg-gray-50' : ''
                        }`}
                      >
                        <h4 className="font-medium text-gray-800">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.createdAt).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )} */}

{isHomePage && (
  <AnimatePresence>
    {showNotifications && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
      >
        <div className="p-4 border-b">
          <h3 className="font-bold text-gray-800">اعلانات</h3>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-h-96 overflow-y-auto"
        >
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              هیچ اعلانی وجود ندارد
            </div>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-gray-50' : ''
                }`}
              >
                <h4 className="font-medium text-gray-800">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notification.createdAt).toLocaleDateString('fa-IR')}
                </p>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)}

          </div>
        
        </div>
        </div>
      </div>
      

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} animated={true} />
    </>
  );
};

export default Header;





// 'use client';

// import { useState, useEffect } from "react";
// import { Bell, ArrowLeft } from "lucide-react";
// import { AnimatePresence, motion } from 'framer-motion';
// import { usePathname, useRouter } from "next/navigation";
// import Image from 'next/image';

// const Header = ({ 
//   showNotifications = true, 
//   showBackButton = false,
//   onBackClick,
//   onMenuClick,
//   title,
//   userName = 'کاربر مهمان',
// }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [showNotificationPanel, setShowNotificationPanel] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [logoData, setLogoData] = useState({});
//   const router = useRouter();

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     if (showNotifications) fetchNotifications();
//   }, [showNotifications]);

//   const fetchNotifications = async () => {
//     try {
//       const response = await fetch('/api/notifications');
//       if (response.ok) {
//         const data = await response.json();
//         setNotifications(data);
//       }
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     }
//   };

//   const unreadCount = notifications.filter(n => !n.isRead).length;

//   return (
//     <>
//       <div className="fixed top-0 left-0 right-0 z-40">
//         <div className={`mx-auto w-full max-w-md px-4 transition-all duration-300 ${
//           isScrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-slate-100"
//         }`}>
//           <div className="flex justify-between items-center py-3">
//             <button
//               onClick={onMenuClick}
//               className="w-12 h-12 bg-white rounded-lg flex items-center justify-center"
//             >
//               <div className="w-6 h-6 flex flex-col justify-between">
//                 <span className="block w-full h-0.5 bg-teal-600"></span>
//                 <span className="block w-full h-0.5 bg-teal-600"></span>
//                 <span className="block w-full h-0.5 bg-teal-600"></span>
//               </div>
//             </button>

//             <div className="flex items-center">
//               {logoData.useImage && logoData.imageUrl && (
//                 <div className="relative w-10 h-10 ml-2">
//                   <Image 
//                     src={logoData.imageUrl}
//                     alt="Logo"
//                     fill
//                     className="object-contain"
//                     sizes="40px"
//                   />
//                 </div>
//               )}
//               <span className="text-2xl font-bold text-gray-800">
//                 {title || logoData.text || "فر"}
//               </span>
//             </div>

//             <div className="relative">
//               {showBackButton ? (
//                 <button
//                   onClick={() => onBackClick ? onBackClick() : router.back()}
//                   className="w-12 h-12 bg-white rounded-lg flex items-center justify-center"
//                 >
//                   <ArrowLeft className="w-6 h-6 text-teal-600" />
//                 </button>
//               ) : showNotifications && (
//                 <button
//                   onClick={() => setShowNotificationPanel(!showNotificationPanel)}
//                   className="w-12 h-12 bg-white rounded-lg flex items-center justify-center relative"
//                 >
//                   <Bell className="w-6 h-6 text-teal-600" />
//                   {unreadCount > 0 && (
//                     <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
//                   )}
//                 </button>
//               )}

//               <AnimatePresence>
//                 {showNotificationPanel && notifications.length > 0 && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
//                     className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50"
//                   >
//                     <div className="p-4 border-b">
//                       <h3 className="font-bold text-gray-800">اعلانات</h3>
//                     </div>
//                     <div className="max-h-96 overflow-y-auto">
//                       {notifications.map((notification) => (
//                         <div
//                           key={notification._id}
//                           className={`p-4 border-b hover:bg-gray-50 ${
//                             !notification.isRead ? 'bg-gray-50' : ''
//                           }`}
//                         >
//                           <h4 className="font-medium text-gray-800">
//                             {notification.title}
//                           </h4>
//                           <p className="text-sm text-gray-600 mt-1">
//                             {notification.message}
//                           </p>
//                           <p className="text-xs text-gray-400 mt-2">
//                             {new Date(notification.createdAt).toLocaleDateString('fa-IR')}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="h-20"></div>
//     </>
//   );
// };

// export default Header;