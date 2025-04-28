'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Banner({ banner, className = '' }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle image loading errors
  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  // Handle image loading success
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (!banner) return null;

  const { title, description, imageUrl, linkUrl } = banner;

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {imageUrl ? (
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {error ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">تصویر در دسترس نیست</span>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={title || 'بنر تبلیغاتی'}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center w-full h-full transition-transform duration-300"
              onError={handleImageError}
              onLoad={handleImageLoad}
              priority
              draggable={false}
            />
          )}
        </div>
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400">تصویر در دسترس نیست</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-4 md:p-6">
        <div className="text-white max-w-md">
          {title && <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>}
          {description && <p className="text-sm md:text-base mb-4">{description}</p>}
          {linkUrl && (
            <Link 
              href={linkUrl}
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              مشاهده بیشتر
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 