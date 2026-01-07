import React from 'react';

const Skeleton = ({ type = 'text', className = '' }) => {
  const baseClasses = "animate-pulse bg-slate-200 rounded";
  
  const types = {
    text: "h-4 w-3/4",
    title: "h-8 w-1/2",
    avatar: "h-12 w-12 rounded-full",
    card: "h-64 w-full rounded-2xl",
    button: "h-10 w-32",
    thumbnail: "h-40 w-full rounded-xl"
  };

  const selectedType = types[type] || types.text;

  return (
    <div className={`${baseClasses} ${selectedType} ${className}`}></div>
  );
};

export const CardSkeleton = () => (
  <div className="card bg-white border border-slate-100 shadow-sm p-4 space-y-4">
    <Skeleton type="thumbnail" />
    <div className="space-y-2">
      <Skeleton type="title" className="w-2/3" />
      <Skeleton type="text" />
      <Skeleton type="text" className="w-1/2" />
    </div>
    <div className="flex justify-between items-center pt-2">
       <Skeleton type="text" className="w-1/4" />
       <Skeleton type="button" className="w-24 h-8" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full space-y-4">
      <div className="flex justify-between mb-4">
          <Skeleton type="title" className="w-1/4" />
          <Skeleton type="button" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex items-center p-4 border-b border-slate-50 last:border-none gap-4">
                <Skeleton type="avatar" className="h-10 w-10" />
                <div className="flex-1 space-y-2">
                    <Skeleton type="text" className="w-1/3" />
                </div>
                 <Skeleton type="text" className="w-20" />
                 <Skeleton type="text" className="w-12" />
            </div>
        ))}
      </div>
  </div>
);

export default Skeleton;
