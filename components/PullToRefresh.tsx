"use client";

interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  shouldTrigger: boolean;
}

export default function PullToRefreshIndicator({
  isPulling,
  isRefreshing,
  pullDistance,
  shouldTrigger,
}: PullToRefreshIndicatorProps) {
  if (!isPulling && !isRefreshing) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-40"
      style={{
        height: `${pullDistance}px`,
        opacity: Math.min(pullDistance / 80, 1),
      }}
    >
      <div className="flex flex-col items-center gap-2 text-gray-600">
        {isRefreshing ? (
          <>
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">刷新中...</span>
          </>
        ) : (
          <>
            <svg
              className={`w-6 h-6 transition-transform ${
                shouldTrigger ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <span className="text-sm">
              {shouldTrigger ? '松开刷新' : '下拉刷新'}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
