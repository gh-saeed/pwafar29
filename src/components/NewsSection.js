'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import Header from './Header';
import { useRouter } from 'next/navigation';

const NewsSection = () => {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/rss/news');
      if (!response.ok) {
        throw new Error('خطا در دریافت اخبار');
      }
      const data = await response.json();
      setCards(Array.isArray(data) ? data : []);
      if (data.length > 0 && !selectedCard) {
        setSelectedCard(data[0]);
      }
    } catch (error) {
      console.error('Error fetching feeds:', error);
      setError('خطا در دریافت اخبار. لطفاً دوباره تلاش کنید.');
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    scrollStartX.current = containerRef.current.scrollLeft;
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const walk = (dragStartX.current - x) * 2;
    containerRef.current.scrollLeft = scrollStartX.current + walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleCardClick = (card) => {
    if (!isDragging) {
      setSelectedCard(selectedCard?.id === card.id ? null : card);
    }
  };

  const handleNewsClick = (newsItem) => {
    if (newsItem.link && newsItem.link !== '#') {
      window.open(newsItem.link, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchFeeds}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">هیچ خبری یافت نشد</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="px-4 mb-6">
        <div 
          ref={containerRef}
          className="overflow-x-auto scrollbar-hide"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div className="inline-flex gap-4 p-2 pb-4">
            {cards.map((card) => {
              return (
                <motion.div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className={`${card.color} w-24 h-20 rounded-lg shadow-md text-white flex flex-col items-center justify-center shrink-0 cursor-pointer
                    ${selectedCard?.id === card.id ? 'ring-4 ring-offset-2 ring-teal-500' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="mb-2">
                    <Newspaper className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm">
                    {card.title}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {selectedCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6"
            >
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold text-center mb-6 text-gray-800"
              >
                {selectedCard.title}
              </motion.h2>
              <div className="relative border-r-2 border-teal-500 pr-8 space-y-6">
                {selectedCard.news?.map((item, index) => {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                      onClick={() => handleNewsClick(item)}
                    >
                      <div className="absolute right-[-13px] top-2 w-4 h-4 bg-teal-500 rounded-full"></div>
                      <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <img src={item.image} alt="خبر" className="rounded-full w-10 h-10" />
                          <h3 className="text-sm font-bold">{item.title}</h3>
                        </div>
                        <p className="text-gray-600 text-xs">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NewsSection;