import { StatCardSkeleton } from './stat-card-skeleton'
import { DetailedCardSkeleton } from './detailed-card-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <>
      {/* Header Section Skeleton */}
      <div className='mb-4 flex flex-col space-y-2'>
        <div className='flex flex-col items-start'>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className='flex items-center justify-between'>
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-6 w-40 rounded-full" />
        </div>
      </div>

      {/* Main Statistics Grid */}
      <div className='grid gap-3 mb-6 grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      {/* Detailed Statistics Grid */}
      <div className='grid gap-3 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        <DetailedCardSkeleton itemCount={5} />
        <DetailedCardSkeleton itemCount={2} showTotal />
        <DetailedCardSkeleton itemCount={2} showTotal />
      </div>
    </>
  )
}

