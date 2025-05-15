export default function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="mt-8 space-y-4">
        <div className="h-24 bg-gray-700 rounded"></div>
        <div className="h-24 bg-gray-700 rounded"></div>
        <div className="h-24 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
} 