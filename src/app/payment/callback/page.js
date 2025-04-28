// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/navigation';

// export default function PaymentCallback() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [status, setStatus] = useState('loading');
//   const [message, setMessage] = useState('در حال بررسی وضعیت پرداخت...');

//   useEffect(() => {
//     const verifyPayment = async () => {
//       const authority = searchParams.get('Authority');
//       const amount = searchParams.get('Amount');
//       const status = searchParams.get('Status');

//       if (status !== 'OK') {
//         setStatus('error');
//         setMessage('پرداخت ناموفق بود. لطفا دوباره تلاش کنید.');
//         return;
//       }

//       try {
//         const response = await fetch('/api/payments/verify', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             authority,
//             amount: amount / 10, // Convert back to Toman
//           }),
//         });

//         const data = await response.json();

//         if (data.success) {
//           setStatus('success');
//           setMessage(data.message);
//         } else {
//           setStatus('error');
//           setMessage(data.error || 'خطا در تایید پرداخت');
//         }
//       } catch (error) {
//         setStatus('error');
//         setMessage('خطا در ارتباط با سرور');
//       }
//     };

//     verifyPayment();
//   }, [searchParams]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
//         <div className="text-center">
//           {status === 'loading' && (
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           )}
//           {status === 'success' && (
//             <div className="text-green-500 text-4xl mb-4">✓</div>
//           )}
//           {status === 'error' && (
//             <div className="text-red-500 text-4xl mb-4">✕</div>
//           )}
//           <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//             {status === 'success' ? 'پرداخت موفق' : status === 'error' ? 'خطا در پرداخت' : 'در حال بررسی'}
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">{message}</p>
//         </div>
//         <div className="mt-8">
//           <button
//             onClick={() => router.push('/')}
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           >
//             بازگشت به صفحه اصلی
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// } 


'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('در حال بررسی وضعیت پرداخت...');

  useEffect(() => {
    const verifyPayment = async () => {
      const authority = searchParams.get('Authority');
      const amount = searchParams.get('Amount');
      const status = searchParams.get('Status');

      if (status !== 'OK') {
        setStatus('error');
        setMessage('پرداخت ناموفق بود. لطفا دوباره تلاش کنید.');
        return;
      }

      try {
        const response = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authority,
            amount: amount / 10, // Convert back to Toman
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error || 'خطا در تایید پرداخت');
        }
      } catch (error) {
        setStatus('error');
        setMessage('خطا در ارتباط با سرور');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          )}
          {status === 'success' && (
            <div className="text-green-500 text-4xl mb-4">✓</div>
          )}
          {status === 'error' && (
            <div className="text-red-500 text-4xl mb-4">✕</div>
          )}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {status === 'success' ? 'پرداخت موفق' : status === 'error' ? 'خطا در پرداخت' : 'در حال بررسی'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>
        <div className="mt-8">
          <button
            onClick={() => router.push('/')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>}>
      <PaymentCallbackContent />
    </Suspense>
  );
}
