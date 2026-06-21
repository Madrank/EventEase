export function CardSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="skeleton h-5 w-20" />
        <div className="skeleton h-5 w-16" />
      </div>
      <div className="skeleton h-6 w-3/4 mb-3" />
      <div className="skeleton h-4 w-full mb-2" />
      <div className="skeleton h-4 w-2/3 mb-4" />
      <div className="space-y-2">
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-1/3" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="page-container animate-pulse">
      <div className="skeleton h-8 w-64 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="page-container animate-pulse">
      <div className="skeleton h-4 w-32 mb-6" />
      <div className="card p-8 mb-8">
        <div className="skeleton h-8 w-2/3 mb-4" />
        <div className="skeleton h-4 w-1/4 mb-6" />
        <div className="skeleton h-20 w-full mb-6" />
        <div className="grid grid-cols-2 gap-4">
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}
