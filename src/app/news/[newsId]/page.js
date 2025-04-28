'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import LayoutClient from '@/components/LayoutClient';

export default function SingleNewsPage() {
  const { newsId } = useParams();
  const router = useRouter();
  const [news, setNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${newsId}`);
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  const starMenuItems = [
    { label: 'سبد خرید', icon: '🛒', href: '#' },
    { label: 'پرداخت', icon: '💳', href: '#' },
    { label: 'سفارشات', icon: '📦', href: '#' }
  ];

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-slate-100 min-h-screen pb-24 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!news) return null;

  return (
    <LayoutClient>
    <div className="max-w-md mx-auto bg-slate-100 min-h-screen pt-24 pb-24">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <img 
            src={news.image} 
            alt={news.title} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span>{news.category}</span>
            <span>•</span>
            <span>{new Date(news.date).toLocaleDateString('fa-IR')}</span>
          </div>

          <h1 className="text-lg font-bold text-gray-800 mb-4">
            {news.title}
          </h1>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 text-sm leading-relaxed">
                {news.description}
              </p>
            </div>
            
            <div className="mt-6 flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                <span>{news.author}</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    </LayoutClient>
  );
}