// import { Inter } from 'next/font/google';
// import './globals.css';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'فر',
//   description: 'پلتفرم خدمات دیجیتال فر',
//   manifest: '/manifest.json',
  
// };

// export const viewport = {
//   themeColor: '#0d9488',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="fa" dir="rtl">
//       <body className={inter.className}>{children}</body>
//     </html>
//   );
// }





// // 'use client';

// // import { Inter } from 'next/font/google'
// // import './globals.css'
// // import Header from '@/components/Header'
// // import BottomNavigation from '@/components/BottomNavigation';

// // const inter = Inter({ subsets: ['latin'] })

// // const starMenuItems = [
// //   {
// //     icon: "⭐",
// //     label: "آیتم 1",
// //     href: "/item1"
// //   },
// //   {
// //     icon: "🌟",
// //     label: "آیتم 2",
// //     href: "/item2"
// //   },
// //   {
// //     icon: "✨",
// //     label: "آیتم 3",
// //     href: "/item3"
// //   }
// // ];

// // export default function RootLayout({ children }) {
// //   return (
// //     <html lang="fa" dir="rtl">
// //       <body className={inter.className}>
// //         <div className="min-h-screen bg-slate-100 flex flex-col">
// //           <Header />
// //           <main className="flex-grow container mx-auto px-4 pb-24">
// //             {children}
// //           </main>
// //           <BottomNavigation starMenuItems={starMenuItems} />
// //         </div>
// //       </body>
// //     </html>
// //   )
// // }








import { Inter } from 'next/font/google';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'فر',
  description: 'پلتفرم خدمات دیجیتال فر',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#0d9488',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={inter.className}>
        
          {children}
        
      </body>
    </html>
  );
}
