import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 animate-pulse flex flex-col justify-between h-56">
      <div>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-slate-800 shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-3 bg-slate-800/60 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <div className="h-3 bg-slate-800 rounded w-full"></div>
          <div className="h-3 bg-slate-800/80 rounded w-2/3"></div>
        </div>
      </div>
      <div className="h-9 bg-slate-800 rounded-xl w-full mt-4"></div>
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center px-4 justify-between">
          <div className="flex items-center space-x-3 w-1/3">
            <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0"></div>
            <div className="h-4 bg-slate-800 rounded w-2/3"></div>
          </div>
          <div className="h-4 bg-slate-800 rounded w-1/6"></div>
          <div className="h-4 bg-slate-800 rounded w-1/6"></div>
        </div>
      ))}
    </div>
  );
};
