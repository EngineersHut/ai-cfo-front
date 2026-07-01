import React from 'react';

const SkeletonLoader = () => {
    return (
        <div className="w-full h-full min-h-[400px] flex flex-col gap-6 animate-pulse p-4">
            {/* Top Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/40 dark:bg-[#1a2153]/40 h-32 rounded-xl shadow-sm border border-gray-100 dark:border-white/10"></div>
                ))}
            </div>
            
            {/* Charts/Tables Area Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                <div className="bg-white/40 dark:bg-[#1a2153]/40 min-h-[300px] rounded-xl shadow-sm border border-gray-100 dark:border-white/10"></div>
                <div className="bg-white/40 dark:bg-[#1a2153]/40 min-h-[300px] rounded-xl shadow-sm border border-gray-100 dark:border-white/10"></div>
            </div>
            
            <div className="bg-white/40 dark:bg-[#1a2153]/40 min-h-[400px] rounded-xl shadow-sm border border-gray-100 dark:border-white/10 mt-2"></div>
        </div>
    );
};

export default SkeletonLoader;
