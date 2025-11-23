import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
//  import { Progress } from '@/components/ui/progress'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useDashboardStore } from '@/stores/dashboard'
import { DashboardSkeleton } from './components/skeletons/dashboard-skeleton'
import { 
  Car, 
  Users, 
  FileText, 
  CheckCircle, 
  UserCheck, 
  Wrench, 
  // TrendingUp,
  AlertTriangle,
  Shield,
  RefreshCw,
  Activity,
  Clock,
  Edit,
  Archive,
  FileX,
  FileCheck
} from 'lucide-react'

export default function Dashboard() {
  const { stats, loading, error, fetchStats } = useDashboardStore()

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleRefresh = () => {
    fetchStats()
  }

  if (loading && !stats) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>

        <Main>
          <DashboardSkeleton />
        </Main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>

        <Main>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
              <h2 className="text-xl font-semibold">Erreur de chargement</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {/* Header Section */}
        <div className='mb-4 flex flex-col space-y-2'>
          <div className='flex flex-col items-start'>
            <h1 className='text-2xl font-bold tracking-tight'>
              Tableau de bord
            </h1>
            <p className='text-sm text-muted-foreground'>
              Vue d'ensemble de votre système d'expertise automobile
            </p>
          </div>
          <div className='flex items-center justify-between'>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm"
              disabled={loading}
              className='flex items-center space-x-1'
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </Button>
            <Badge variant="outline" className='flex items-center space-x-1'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
              <span>Système opérationnel</span>
            </Badge>
          </div>
        </div>

        {/* Main Statistics Grid - Responsive */}
        <div className='grid gap-3 mb-6 grid-cols-2 lg:grid-cols-4'>
          {/* Dossiers */}
          <Card className='group hover:shadow-lg transition-all duration-300 shadow-none'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Dossiers
              </CardTitle>
              <div className='p-2 bg-muted rounded-lg'>
                <FileText className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stats?.assignments.total_assignments.value || 0}
              </div>
              <div className='flex items-center mt-2'>
                <div className='flex-1 bg-muted rounded-full h-2 mr-2'>
                  <div 
                    className='bg-primary h-2 rounded-full' 
                    style={{ 
                      width: `${stats?.assignments.total_assignments.value ? 
                        (stats.assignments.open_assignments.value / stats.assignments.total_assignments.value * 100) : 0}%` 
                    }}
                  ></div>
                </div>
                <p className='text-sm text-muted-foreground'>
                  {stats?.assignments.open_assignments.value || 0} ouverts
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Utilisateurs */}
          <Card className='group hover:shadow-lg transition-all duration-300 shadow-none'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Utilisateurs
              </CardTitle>
              <div className='p-2 bg-muted rounded-lg'>
                <Users className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stats?.users.total_users.value || 0}
              </div>
              <div className='flex items-center mt-2'>
                <UserCheck className='h-4 w-4 text-muted-foreground mr-1' />
                <p className='text-sm text-muted-foreground'>
                  {stats?.users.active_users.value || 0} actifs
                </p>
                <p className='text-muted-foreground text-xs ml-1'>
                  ({stats?.users.inactive_users.value || 0} inactifs)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Véhicules */}
          <Card className='group hover:shadow-lg transition-all duration-300 shadow-none'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Véhicules
              </CardTitle>
              <div className='p-2 bg-muted rounded-lg'>
                <Car className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stats?.vehicles.total_vehicles.value || 0}
              </div>
              <div className='flex items-center mt-2'>
                <div className='flex-1 bg-muted rounded-full h-2 mr-2'>
                  <div 
                    className='bg-primary h-2 rounded-full' 
                    style={{ 
                      width: `${stats?.vehicles.total_vehicles.value ? 
                        (stats.vehicles.active_vehicles.value / stats.vehicles.total_vehicles.value * 100) : 0}%` 
                    }}
                  ></div>
                </div>
                <p className='text-sm text-muted-foreground'>
                  {stats?.vehicles.active_vehicles.value || 0} actifs
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assureurs */}
          <Card className='group hover:shadow-lg transition-all duration-300 shadow-none'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Assureurs
              </CardTitle>
              <div className='p-2 bg-muted rounded-lg'>
                <Shield className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stats?.insurers.total_insurers.value || 0}
              </div>
              <div className='flex items-center mt-2'>
                <CheckCircle className='h-4 w-4 text-muted-foreground mr-1' />
                <p className='text-sm text-muted-foreground'>
                  {stats?.insurers.active_insurers.value || 0} actifs
                </p>
                <p className='text-muted-foreground text-xs ml-1'>
                  ({stats?.insurers.inactive_insurers.value || 0} inactifs)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Statistics Grid - Responsive */}
        <div className='grid gap-3 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {/* Dossiers détaillés */}
          <Card className='group hover:shadow-lg transition-all duration-300 shadow-none'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                État des dossiers
              </CardTitle>
              <div className='p-2 bg-muted rounded-lg'>
                <Activity className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <FileText className='h-4 w-4' />
                  <span className='text-sm'>Ouverts</span>
                </div>
                <Badge variant="secondary">
                  {stats?.assignments.open_assignments.value || 0}
                </Badge>
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <FileCheck className='h-4 w-4' />
                  <span className='text-sm'>Réalisés</span>
                </div>
                <Badge variant="secondary">
                  {stats?.assignments.realized_assignments.value || 0}
                </Badge>
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <Edit className='h-4 w-4' />
                  <span className='text-sm'>Modifiés</span>
                </div>
                <Badge variant="secondary">
                  {stats?.assignments.edited_assignments.value || 0}
                </Badge>
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4' />
                  <span className='text-sm'>Validés</span>
                </div>
                <Badge variant="secondary">
                  {stats?.assignments.validated_assignments.value || 0}
                </Badge>
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <Archive className='h-4 w-4' />
                  <span className='text-sm'>Fermés</span>
                </div>
                <Badge variant="secondary">
                  {stats?.assignments.closed_assignments.value || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Réparateurs */}
          <Card className='group hover:shadow-lg transition-all duration-300 shadow-none'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Réparateurs
              </CardTitle>
              <div className='p-2 bg-muted rounded-lg'>
                <Wrench className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <Wrench className='h-4 w-4' />
                  <span className='text-sm'>Actifs</span>
                </div>
                <Badge variant="secondary">
                  {stats?.repairers.active_repairers.value || 0}
                </Badge>
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <AlertTriangle className='h-4 w-4' />
                  <span className='text-sm'>Inactifs</span>
                </div>
                <Badge variant="secondary">
                  {stats?.repairers.inactive_repairers.value || 0}
                </Badge>
              </div>
              <div className='pt-2 border-t'>
                <div className='text-2xl font-bold'>
                  {stats?.repairers.total_repairers.value || 0}
                </div>
                <p className='text-sm text-muted-foreground'>Total réparateurs</p>
              </div>
            </CardContent>
          </Card>

          {/* Dossiers expirés */}
          <Card className='group hover:shadow-lg transition-all duration-300 shadow-none'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Dossiers expirés
              </CardTitle>
              <div className='p-2 bg-muted rounded-lg'>
                <AlertTriangle className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4' />
                  <span className='text-sm'>Édition expirée</span>
                </div>
                <Badge variant="destructive">
                  {stats?.assignments.assignments_edition_time_expired || 0}
                </Badge>
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <FileX className='h-4 w-4' />
                  <span className='text-sm'>Récupération expirée</span>
                </div>
                <Badge variant="destructive">
                  {stats?.assignments.assignments_recovery_time_expired || 0}
                </Badge>
              </div>
              <div className='pt-2 border-t'>
                <div className='text-2xl font-bold'>
                  {(stats?.assignments.assignments_edition_time_expired || 0) + 
                   (stats?.assignments.assignments_recovery_time_expired || 0)}
                </div>
                <p className='text-sm text-muted-foreground'>Total expirés</p>
              </div>
            </CardContent>
          </Card>
        </div>


      </Main>
    </>
  )
}
