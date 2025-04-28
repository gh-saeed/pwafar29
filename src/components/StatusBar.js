import React from 'react';

const StatusBar = () => {
  return (
    <div className="bg-black text-white p-2 flex justify-between items-center text-sm">
      <div className="flex items-center gap-1">
        <span>17:40</span>
        <div className="w-5 h-5 bg-white rounded-full text-black flex items-center justify-center text-xs">1</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <div className="h-3 w-1 bg-white rounded-sm mx-[1px]"></div>
          <div className="h-4 w-1 bg-white rounded-sm mx-[1px]"></div>
          <div className="h-5 w-1 bg-white rounded-sm mx-[1px]"></div>
        </div>
        <span>100%</span>
        <div className="w-5 h-3 border border-white rounded-sm relative">
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-white"></div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar; 