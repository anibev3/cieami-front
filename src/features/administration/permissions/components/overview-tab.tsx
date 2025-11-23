import { useMemo } from 'react'
import { usePermissionsStore } from '@/stores/permissionsStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Shield,
  Key,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'
import { calculatePermissionsStats, formatResourceName } from '@/utils/permissions'
import { cn } from '@/lib/utils'
import { OverviewStatsSkeleton } from './skeletons/overview-stats-skeleton'

export function OverviewTab() {
  const { permissions, roles, loading } = usePermissionsStore()

  const stats = useMemo(() => {
    return calculatePermissionsStats(permissions, roles)
  }, [permissions, roles])

  const resourceEntries = Object.entries(stats.permissionsByResource).sort(
    (a, b) => b[1] - a[1]
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <OverviewStatsSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 hover:border-primary/50 transition-colors shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions totales</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPermissions}</div>
            <p className="text-xs text-muted-foreground">
              Permissions disponibles
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rôles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoles}</div>
            <p className="text-xs text-muted-foreground">
              Rôles configurés
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ressources</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resourceEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              Types de ressources
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRoles > 0
                ? Math.round(
                    roles.reduce((sum, r) => sum + r.permissions.length, 0) /
                      stats.totalRoles
                  )
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Permissions par rôle
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Permissions par ressource */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Permissions par ressource</CardTitle>
            <CardDescription>
              Répartition des permissions par type de ressource
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {resourceEntries.map(([resource, count]) => (
                  <div
                    key={resource}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="font-medium">
                        {formatResourceName(resource)}
                      </span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Top 5 rôles avec le plus de permissions */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Top 5 rôles</CardTitle>
            <CardDescription>
              Rôles avec le plus de permissions assignées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {stats.rolesWithMostPermissions.map((item, index) => (
                  <div
                    key={item.role.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm',
                          index === 0 && 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
                          index === 1 && 'bg-gray-400/20 text-gray-600 dark:text-gray-400',
                          index === 2 && 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
                          index > 2 && 'bg-muted text-muted-foreground'
                        )}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{item.role.label}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.role.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {item.count} perm.
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

