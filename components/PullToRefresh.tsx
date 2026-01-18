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
      className="fixed top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-40 bg-black"
      style={{
        height: `${Math.min(pullDistance, 60)}px`,
        opacity: Math.min(pullDistance / 60, 1),
      }}
    >
      <div className="flex items-center gap-2 text-white text-xs">
        {isRefreshing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>刷新中</span>
          </>
        ) : (
          <span>{shouldTrigger ? '↓' : '↓'}</span>
        )}
      </div>
    </div>
  );
}
