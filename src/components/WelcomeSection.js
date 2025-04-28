import React from 'react';

const WelcomeSection = () => {
  return (
    <div className="flex flex-row-reverse items-center justify-between px-6 py-4">
      <div className="w-16 h-16 bg-white rounded-full overflow-hidden">
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="w-10 h-10 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>
      <div className="text-right">
        <h2 className="text-2xl font-bold text-teal-600">سلام سعید</h2>
        <p className="text-gray-600 text-sm">
          عصر دوشنبه شما بخیر ، امروز دوشنبه ۱ اردیبهشت ۱۴۰۴ به فر خوش آمدید
        </p>
      </div>
    </div>
  );
};

export default WelcomeSection; 