import { Skeleton } from '@/components/ui/skeleton'

export function StatusCardSkeleton() {
  return (
    <div className="group relative flex-1 min-w-0 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/60 p-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="w-2 h-2 rounded-full" />
      </div>
    </div>
  )
}

