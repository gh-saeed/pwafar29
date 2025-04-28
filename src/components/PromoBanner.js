import React from 'react';
import Image from 'next/image';

const PromoBanner = () => {
  return (
    <div className="mx-4 my-6 bg-teal-600 rounded-lg p-4 flex items-center justify-between">
      <div className="w-1/3">
        <Image
          src="/placeholder.svg?height=120&width=120"
          width={120}
          height={120}
          alt="Promo"
          className="object-contain"
        />
      </div>
      <div className="w-2/3 text-right text-white">
        <h3 className="text-2xl font-bold mb-2">تخفیف ویژه</h3>
        <p className="text-sm mb-4">تخفیف استثنایی خرید اشتراک و فعال سازی کلیه ابزارهای فیرامو به مدت محدود</p>
        <button className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold rounded-md px-6 py-2 ml-auto block">
          خرید اشتراک
        </button>
      </div>
    </div>
  );
};

export default PromoBanner; 