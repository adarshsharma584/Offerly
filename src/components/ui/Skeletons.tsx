import { Skeleton } from "./skeleton";

export function OfferCardSkeleton() {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden flex items-stretch min-h-[120px] md:min-h-[140px] mb-4">
      <Skeleton className="w-28 md:w-36 lg:w-44 flex-shrink-0" />
      <div className="flex-1 p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between items-end pt-2">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function MerchantCardSkeleton() {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-4 space-y-4">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <Skeleton className="h-3 w-1/2 mx-auto" />
      </div>
    </div>
  );
}
