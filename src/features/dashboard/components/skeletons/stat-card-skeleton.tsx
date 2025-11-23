import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function StatCardSkeleton() {
  return (
    <Card className='group hover:shadow-lg transition-all duration-300 shadow-none'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-8 w-8 rounded-lg' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-8 w-16 mb-2' />
        <div className='flex items-center mt-2'>
          <div className='flex-1 bg-muted rounded-full h-2 mr-2'>
            <Skeleton className='h-2 w-1/2 rounded-full' />
          </div>
          <Skeleton className='h-4 w-16' />
        </div>
      </CardContent>
    </Card>
  )
}

