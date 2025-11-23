import { Skeleton } from '@/components/ui/skeleton'
import { StatusCardSkeleton } from './status-card-skeleton'
import { AssignmentsTableSkeleton } from './assignments-table-skeleton'

export function AssignmentsPageSkeleton() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Search and Filters */}
          <div className="flex-1 max-w-2xl">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
              <div className="relative flex-1">
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
              <Skeleton className="h-11 w-11 rounded-md" />
              <Skeleton className="h-11 w-24 rounded-md" />
            </div>
          </div>

          {/* Status Overview Cards */}
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <StatusCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border-gray-200 dark:border-gray-700">
        <div className="overflow-hidden">
          <AssignmentsTableSkeleton />
        </div>

        {/* Pagination Skeleton */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

