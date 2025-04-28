// 'use client';

// import React, { useEffect, useState } from 'react';
// import WelcomeSection from '../components/WelcomeSection';
// import ServiceCard from '../components/ServiceCard';
// import { ShoppingCart, CreditCard, Package } from 'lucide-react';
// import BannerSection from '@/components/BannerSection';
// import LayoutClient from '@/components/LayoutClient';

// export default function HomePage() {

//     const [sections, setSections] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//       fetchSections();
//     }, []);

//     const fetchSections = async () => {
//       try {
//         const response = await fetch('/api/homedesign');
//         const data = await response.json();
//         setSections(data);
//       } catch (error) {
//         console.error('Error fetching sections:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (loading) {
//       return (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
//         </div>
//       );
//     }


//   const mainServices = [
//     {
//       title: 'مظنه طلا',
//       icon: (
//         <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center">
//           <div className="w-10 h-10 bg-teal-200"></div>
//         </div>
//       ),
//       href: '/مظنه-طلا'
//     },
//     {
//       title: 'سیگنال طلا',
//       icon: (
//         <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center">
//           <div className="w-10 h-10 bg-teal-200"></div>
//         </div>
//       ),
//       href: '/سیگنال-طلا'
//     },
//     {
//       title: 'سیگنال فارکس',
//       icon: (
//         <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center">
//           <div className="w-10 h-10 bg-teal-200"></div>
//         </div>
//       ),
//       href: '/سیگنال-فارکس'
//     },
//   ];

  

//   return (
//     <LayoutClient>
//     <div className="max-w-md mx-auto bg-slate-100 min-h-screen flex flex-col pt-24 pb-24">
      
//         {/* <StatusBar /> */}
//         <WelcomeSection />

//         {/* Main Services */}
//         <div className="px-4 py-2">
//           <h2 className="text-xl font-bold text-right mb-4">سرویس های اصلی</h2>
//           <div className="grid grid-cols-3 gap-4">
//             {mainServices.map((service, index) => (
//               <ServiceCard 
//                 key={index} 
//                 title={service.title} 
//                 icon={service.icon} 
//                 href={service.href}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Banner Section */}
//         <div className="w-full">
//           <BannerSection className="mb-8" />
//         </div>

//         {/* Recommended Services */}
//         {sections.map((section) => (
//           <div key={section._id} className="px-4 py-2">
//             <h2 className="text-xl font-bold text-right mb-4">{section.title}</h2>
//             <div className="grid grid-cols-3 gap-4">
//               {section.services.map((service, index) => (
//                 <ServiceCard
//                   key={index}
//                   title={service.title}
//                   icon={service.icon}
//                   href={service.href}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//         {/* <div className="px-4 py-2">
//           <h2 className="text-xl font-bold text-right mb-4">سرویس های اصلی</h2>
//           <div className="grid grid-cols-3 gap-4">
//             {mainServices.map((service, index) => (
//               <ServiceCard 
//                 key={index} 
//                 title={service.title} 
//                 icon={service.icon} 
//                 href={service.href}
//               />
//             ))}
//           </div>
//         </div> */}
//       </div>
//       </LayoutClient>
    
//   );
// }






// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import StatusBar from '../components/StatusBar';
// import Header from '../components/Header';
// import WelcomeSection from '../components/WelcomeSection';
// import ServiceCard from '@/components/ServiceCard';
// import { ShoppingCart, CreditCard, Package } from 'lucide-react';
// import BannerSection from '@/components/BannerSection';
// import BottomNavigation from '@/components/MobileNavigation';
// import LayoutClient from '@/components/LayoutClient';

// export default function HomePage() {
//   const [isDragging, setIsDragging] = useState(false);
//   const dragStartX = useRef(0);
//   const scrollStartX = useRef(0);
//   const containerRef = useRef(null);

//   const mainServices = [
//     {
//       title: 'مظنه طلا',
//       icon: (
//         <div className="w-10 h-10 bg-teal-200 rounded-lg"></div>
//       ),
//       href: '/مظنه-طلا'
//     },
//     {
//       title: 'سیگنال طلا',
//       icon: (
//         <div className="w-10 h-10 bg-teal-200 rounded-lg"></div>
//       ),
//       href: '/سیگنال-طلا'
//     },
//     {
//       title: 'سیگنال فارکس',
//       icon: (
//         <div className="w-10 h-10 bg-teal-200 rounded-lg"></div>
//       ),
//       href: '/سیگنال-فارکس'
//     },
//   ];

//   const handleDragStart = (e) => {
//     setIsDragging(true);
//     dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
//     scrollStartX.current = containerRef.current.scrollLeft;
//   };

//   const handleDragMove = (e) => {
//     if (!isDragging) return;
    
//     const x = e.touches ? e.touches[0].clientX : e.clientX;
//     const walk = (dragStartX.current - x) * 2;
//     containerRef.current.scrollLeft = scrollStartX.current + walk;
//   };

//   const handleDragEnd = () => {
//     setIsDragging(false);
//   };

//   return (
//     <LayoutClient>
//     <div className="max-w-md mx-auto bg-slate-100 min-h-screen flex flex-col pt-24 pb-24">
      
//         {/* <StatusBar /> */}
//         <WelcomeSection />

//         {/* Main Services */}
//         <div className="px-4 py-2">
//           <h2 className="text-xl font-bold text-right mb-4">سرویس های اصلی</h2>
//           <div 
//             ref={containerRef}
//             className="overflow-x-auto scrollbar-hide"
//             onMouseDown={handleDragStart}
//             onMouseMove={handleDragMove}
//             onMouseUp={handleDragEnd}
//             onMouseLeave={handleDragEnd}
//             onTouchStart={handleDragStart}
//             onTouchMove={handleDragMove}
//             onTouchEnd={handleDragEnd}
//           >
//             <div className="inline-flex gap-4 p-2 pb-4">
//               {mainServices.map((service, index) => (
//                 <ServiceCard 
//                   key={index} 
//                   title={service.title} 
//                   icon={service.icon} 
//                   href={service.href}
//                   isDraggable={true}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Banner Section */}
//         <div className="w-full">
//           <BannerSection className="mb-8" />
//         </div>

//         {/* Recommended Services */}
//         <div className="px-4 py-2">
//           <h2 className="text-xl font-bold text-right mb-4">سرویس های اصلی</h2>
//           <div className="grid grid-cols-3 gap-4">
//             {mainServices.map((service, index) => (
//               <ServiceCard 
//                 key={index} 
//                 title={service.title} 
//                 icon={service.icon} 
//                 href={service.href}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//       </LayoutClient>
    
//   );
// }



// 'use client';

// import React, { useState, useEffect } from 'react';
// import StatusBar from '../components/StatusBar';
// import Header from '../components/Header';
// import WelcomeSection from '../components/WelcomeSection';
// import ServiceCard from '../components/ServiceCard';
// import { ShoppingCart, CreditCard, Package } from 'lucide-react';
// import BannerSection from '@/components/BannerSection';
// import BottomNavigation from '@/components/MobileNavigation';
// import LayoutClient from '@/components/LayoutClient';

// export default function HomePage() {
//   const [sections, setSections] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchSections();
//   }, []);

//   const fetchSections = async () => {
//     try {
//       const response = await fetch('/api/homedesign');
//       const data = await response.json();
//       setSections(data);
//     } catch (error) {
//       console.error('Error fetching sections:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
//       </div>
//     );
//   }

//   return (
//     <LayoutClient>
//       <div className="max-w-md mx-auto bg-slate-100 min-h-screen flex flex-col pt-24 pb-24">
//         <StatusBar />
//         <WelcomeSection />

//         {sections.map((section) => (
//           <div key={section._id} className="px-4 py-2">
//             <h2 className="text-xl font-bold text-right mb-4">{section.title}</h2>
//             <div className="grid grid-cols-3 gap-4">
//               {section.services.map((service, index) => (
//                 <ServiceCard
//                   key={index}
//                   title={service.title}
//                   icon={service.icon}
//                   href={service.href}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}

//         <BannerSection className="mb-8" />
//       </div>
//     </LayoutClient>
//   );
// }







'use client';

import React from 'react';
import WelcomeSection from '../components/WelcomeSection';
import { ServiceCard, ServiceSection } from '../components/ServiceCard';
import BannerSection from '@/components/BannerSection';
import LayoutClient from '@/components/LayoutClient';

export default function HomePage() {
  const mainServices = [
    {
      title: 'مظنه طلا',
      icon: (
        <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center">
          <div className="w-10 h-10 bg-teal-200"></div>
        </div>
      ),
      href: '/مظنه-طلا'
    },
    {
      title: 'سیگنال طلا',
      icon: (
        <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center">
          <div className="w-10 h-10 bg-teal-200"></div>
        </div>
      ),
      href: '/سیگنال-طلا'
    },
    {
      title: 'سیگنال فارکس',
      icon: (
        <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center">
          <div className="w-10 h-10 bg-teal-200"></div>
        </div>
      ),
      href: '/سیگنال-فارکس'
    },
  ];

  return (
    <LayoutClient>
      <div className="max-w-md mx-auto bg-slate-100 min-h-screen flex flex-col pt-24 pb-24">
        <WelcomeSection />

        {/* Main Services */}
        <div className="px-4 py-2">
          <h2 className="text-xl font-bold text-right mb-4">سرویس های اصلی</h2>
          <div className="grid grid-cols-3 gap-4">
            {mainServices.map((service, index) => (
              <ServiceCard 
                key={index} 
                title={service.title} 
                icon={service.icon} 
                href={service.href}
              />
            ))}
          </div>
        </div>

        {/* Banner Section */}
        <div className="w-full">
          <BannerSection className="mb-8" />
        </div>

        {/* Dynamic Sections */}
        <ServiceSection />
      </div>
    </LayoutClient>
  );
}
