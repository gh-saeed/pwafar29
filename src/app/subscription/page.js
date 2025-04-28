'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Home, MessageSquareText, BookText, Users, ShoppingCart, CreditCard, Package } from 'lucide-react';
import Header from '@/components/Header';
import {MobileMenu} from '@/components/MobileMenu';
import LayoutClient from '@/components/LayoutClient';

export default function SubscriptionPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error('خطا در دریافت اطلاعات سرویس‌ها');
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const starMenuItems = [
    {
      label: 'سبد خرید',
      icon: <ShoppingCart className="w-5 h-5" />,
      href: '#'
    },
    {
      label: 'پرداخت',
      icon: <CreditCard className="w-5 h-5" />,
      href: '#'
    },
    {
      label: 'سفارشات',
      icon: <Package className="w-5 h-5" />,
      href: '#'
    }
  ];

  const handlePayment = async (service) => {
    try {
      const response = await fetch('/api/payments/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: service.price,
          description: 'خرید اشتراک',
          mobile: '09175558899'
        }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = data.paymentUrl;
      } else {
        console.error('خطا در پرداخت:', data.error);
        // می‌توانید اینجا یک نوتیفیکیشن نمایش دهید
      }
    } catch (error) {
      console.error('خطا در ارسال درخواست:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return (
      <LayoutClient>
      <div className="max-w-md mx-auto bg-slate-100 min-h-screen flex flex-col pt-24 pb-24">
        
        <Header onMenuClick={toggleMobileMenu} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری سرویس‌ها...</p>
          </div>
        </div>
        <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />
      </div>
      </LayoutClient>
    );
  }

  if (error) {
    return (
      <LayoutClient>
      <div className="max-w-md mx-auto bg-slate-100 min-h-screen flex flex-col pt-24 pb-24">
        
        <Header onMenuClick={toggleMobileMenu} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
        <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />
      </div>
      </LayoutClient>
    );
  }

  return (
    <LayoutClient>
    <div className="max-w-md mx-auto bg-slate-100 min-h-screen flex flex-col pt-24 pb-24">
      
      <Header onMenuClick={toggleMobileMenu} />
      
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">پلن‌های اشتراک</h1>
          <p className="text-sm text-gray-600">
            با انتخاب یکی از پلن‌های زیر، از خدمات ویژه ما بهره‌مند شوید.
          </p>
        </div>

        {/* کارت‌های پلن */}
        <div className="space-y-4">
          {services.length > 0 ? (
            services.map((service) => (
              <div key={service._id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-lg font-bold text-gray-700">{service.name}</div>
                  <div className="text-base font-semibold text-teal-600">
                    {service.price.toLocaleString()} تومان
                  </div>
                </div>
                
                {service.duration && (
                  <div className="text-xs text-gray-500 mb-3">
                    مدت زمان: {service.duration} روز
                  </div>
                )}
                
                {service.features && service.features.length > 0 ? (
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-teal-500 mt-0.5 ml-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500 mb-4">
                    {service.description ? (
                      <div dangerouslySetInnerHTML={{ __html: service.description }} />
                    ) : (
                      <p>توضیحات این سرویس در دسترس نیست.</p>
                    )}
                  </div>
                )}
                
                <button
                  onClick={() => handlePayment(service)} 
                  className="block w-full bg-teal-600 text-white text-center py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  خرید اشتراک
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-lg">
              <p className="text-gray-600">هیچ سرویسی در حال حاضر موجود نیست.</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-2">نیاز به مشاوره دارید؟</h2>
          <p className="text-sm text-gray-600 mb-4">
            تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست.
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            تماس با ما
          </Link>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />
    </div>
    </LayoutClient>
  );
} 