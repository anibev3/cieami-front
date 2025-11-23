import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DetailPageSkeleton() {
  return (
    <div className="w-full space-y-4 lg:space-y-6 pb-28 lg:pb-0">
      {/* En-tête */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Layout avec sidebar et contenu */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Card className="shadow-none">
            <CardHeader className="pb-3 px-3 sm:px-6">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent className="p-0 px-3 sm:px-6">
              <nav className="space-y-0.5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-2">
                    <Skeleton className="h-4 w-4" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2 w-32" />
                    </div>
                  </div>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="w-full">
          {/* Suivi & Statuts */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/60 shadow-none py-2">
            <CardContent className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 items-center px-3 sm:px-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton className="h-5 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contenu de la section */}
          <div className="shadow-none mt-4">
            <div className="h-[500px] sm:h-[600px] mb-30">
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="shadow-none">
                    <CardHeader>
                      <Skeleton className="h-5 w-32" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-full" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

