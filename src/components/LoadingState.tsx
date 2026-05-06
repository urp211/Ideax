import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 flex flex-col h-[450px] overflow-hidden">
          <div className="p-6 flex-1 flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-4 w-8 rounded" />
            </div>
            <Skeleton className="h-7 w-3/4 rounded" />
            <Skeleton className="h-16 w-full rounded" />
            
            <div className="space-y-2 pt-4">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-4/5 rounded" />
            </div>

            <div className="mt-auto space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 border-t border-slate-100">
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
