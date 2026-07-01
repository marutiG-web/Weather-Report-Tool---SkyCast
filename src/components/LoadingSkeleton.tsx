import React from 'react';

interface LoadingSkeletonProps {
  isDarkTheme: boolean;
}

export default function LoadingSkeleton({ isDarkTheme }: LoadingSkeletonProps) {
  const glassClass = isDarkTheme ? 'glass-panel text-white' : 'glass-panel-light text-slate-800';
  const cardClass = isDarkTheme ? 'glass-card' : 'glass-card-light';

  return (
    <div className="w-full flex flex-col gap-6 animate-pulse select-none">
      {/* 1. Main Current Weather Card Skeleton */}
      <div className={`w-full ${glassClass} rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[300px]`}>
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-2.5 w-1/2">
            <div className={`h-8 rounded-xl w-3/4 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-300'}`} />
            <div className={`h-4 rounded-lg w-1/2 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
            <div className="flex flex-col gap-1.5 mt-2">
              <div className={`h-3 rounded w-1/3 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
              <div className={`h-3 rounded w-1/4 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
            </div>
          </div>
          <div className="flex gap-2">
            <div className={`w-9 h-9 rounded-full ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
            <div className={`w-9 h-9 rounded-full ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
            <div className={`w-9 h-9 rounded-full ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 my-6">
          <div className="flex items-center gap-5">
            <div className={`w-[100px] h-[100px] rounded-3xl ${isDarkTheme ? 'bg-white/10' : 'bg-slate-300'}`} />
            <div className="flex flex-col gap-2">
              <div className={`h-14 rounded-2xl w-[120px] ${isDarkTheme ? 'bg-white/10' : 'bg-slate-300'}`} />
              <div className={`h-4 rounded-lg w-[80px] ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
            </div>
          </div>
          <div className={`flex flex-col gap-2.5 p-4 rounded-2xl ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'} w-full md:w-[200px] h-[90px]`} />
        </div>

        <div className="flex justify-between items-center">
          <div className={`h-3.5 rounded w-1/4 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
          <div className={`h-3.5 rounded w-1/4 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
        </div>
      </div>

      {/* 2. Hourly Scroll Skeleton */}
      <div className="flex flex-col gap-3">
        <div className={`h-6 rounded-lg w-1/5 ${isDarkTheme ? 'bg-white/15' : 'bg-slate-300'}`} />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 w-[95px] h-[160px] rounded-2xl ${cardClass} flex flex-col items-center justify-between p-4`}
            >
              <div className={`h-3 rounded w-2/3 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
              <div className={`w-10 h-10 rounded-full ${isDarkTheme ? 'bg-white/10' : 'bg-slate-300'}`} />
              <div className={`h-5 rounded w-1/2 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-300'}`} />
              <div className={`h-2 rounded w-3/4 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Columns: 7-Day Forecast & Highlights Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 7-Day Skeleton */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className={`h-6 rounded-lg w-1/3 ${isDarkTheme ? 'bg-white/15' : 'bg-slate-300'}`} />
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className={`w-full h-[64px] rounded-2xl ${cardClass} flex items-center justify-between p-4`}>
                <div className="flex flex-col gap-1.5 w-1/4">
                  <div className={`h-3.5 rounded w-3/4 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
                  <div className={`h-2.5 rounded w-1/2 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
                </div>
                <div className={`w-8 h-8 rounded-full ${isDarkTheme ? 'bg-white/10' : 'bg-slate-300'}`} />
                <div className={`h-3.5 rounded w-12 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
                <div className={`h-4 rounded w-14 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-300'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Highlights Grid Skeleton */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className={`h-6 rounded-lg w-1/3 ${isDarkTheme ? 'bg-white/15' : 'bg-slate-300'}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className={`rounded-2xl p-4.5 min-h-[130px] ${cardClass} flex flex-col justify-between`}>
                <div className="flex justify-between items-center">
                  <div className={`h-3 rounded w-1/2 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
                  <div className={`w-7 h-7 rounded-lg ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className={`h-7 rounded-lg w-1/3 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-300'}`} />
                  <div className={`h-3 rounded w-2/3 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
