// 'use client';

// import { useState, useEffect } from 'react';
// import BannerSlider from './BannerSlider';

// export default function BannerSection({ activeOnly = true, className = '' }) {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         setLoading(true);
//         const url = activeOnly 
//           ? '/api/banners?activeOnly=true' 
//           : '/api/banners';
        
//         const response = await fetch(url);
        
//         if (!response.ok) {
//           throw new Error('خطا در دریافت اطلاعات بنرها');
//         }
        
//         const data = await response.json();
//         setBanners(data);
//       } catch (err) {
//         console.error('Error fetching banners:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBanners();
//   }, [activeOnly]);

//   if (loading) {
//     return (
//       <div className={`flex justify-center items-center h-64 md:h-80 lg:h-96 bg-gray-100 ${className}`}>
//         <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`flex justify-center items-center h-64 md:h-80 lg:h-96 bg-gray-100 ${className}`}>
//         <p className="text-gray-500">خطا در بارگذاری بنرها</p>
//       </div>
//     );
//   }

//   if (!banners.length) {
//     return null;
//   }

//   return (
//     <BannerSlider 
//       banners={banners} 
//       className={className}
//     />
//   );
// } 



'use client';

import { useState, useEffect } from 'react';
import BannerSliderUltimate from './BannerSliderUltimate';

export default function BannerSection({ activeOnly = true, className = '' }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const url = activeOnly 
          ? '/api/banners?activeOnly=true' 
          : '/api/banners';
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('خطا در دریافت اطلاعات بنرها');
        }
        
        const data = await response.json();
        setBanners(data);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [activeOnly]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 md:h-80 lg:h-96 bg-gray-100 ${className}`}>
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center h-64 md:h-80 lg:h-96 bg-gray-100 ${className}`}>
        <p className="text-gray-500">خطا در بارگذاری بنرها</p>
      </div>
    );
  }

  if (!banners.length) {
    return null;
  }

  return (
    <BannerSliderUltimate 
      banners={banners} 
      className="rounded-lg shadow-lg"
    />
  );
} 


