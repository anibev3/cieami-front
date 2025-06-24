import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/gestion/photos')({
  component: () => (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Photos</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
          <CardDescription>
            Gestion des photos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Page en cours de développement...</p>
        </CardContent>
      </Card>
    </div>
  ),
}) 