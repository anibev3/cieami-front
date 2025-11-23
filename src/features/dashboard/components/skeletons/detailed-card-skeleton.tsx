import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface DetailedCardSkeletonProps {
  showTotal?: boolean
  itemCount?: number
}

export function DetailedCardSkeleton({ showTotal = false, itemCount = 5 }: DetailedCardSkeletonProps) {
  return (
    <Card className='group hover:shadow-lg transition-all duration-300 shadow-none'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-8 w-8 rounded-lg' />
      </CardHeader>
      <CardContent className='space-y-3'>
        {Array.from({ length: itemCount }).map((_, index) => (
          <div key={index} className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-4 w-4 rounded' />
              <Skeleton className='h-4 w-24' />
            </div>
            <Skeleton className='h-5 w-12 rounded-full' />
          </div>
        ))}
        {showTotal && (
          <div className='pt-2 border-t'>
            <Skeleton className='h-8 w-16 mb-2' />
            <Skeleton className='h-4 w-24' />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

