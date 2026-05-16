import { cn } from '../../utils/helpers';

const Skeleton = ({ className }) => (
  <div className={cn('shimmer rounded-lg', className)} />
);

export const SkeletonCard = () => (
  <div className="card-base p-5 space-y-3">
    <Skeleton className="h-3 w-1/3" />
    <Skeleton className="h-6 w-2/3" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-7 w-16 rounded-full" />
      <Skeleton className="h-7 w-20 rounded-full" />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-ink-200/70">
    <Skeleton className="w-10 h-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-7 w-20 rounded-full" />
  </div>
);

export default Skeleton;
