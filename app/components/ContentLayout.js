'use client';

import { Suspense } from 'react';
import SkeletonLoader from './SkeletonLoader';

export default function ContentLayout({ children, title }) {
  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <Suspense fallback={<SkeletonLoader />}>
        <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>
        {children}
      </Suspense>
    </div>
  );
} 