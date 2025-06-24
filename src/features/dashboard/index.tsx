import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { 
  Car, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  Wrench, 
  TrendingUp,
  AlertTriangle,
  DollarSign
} from 'lucide-react'

export default function Dashboard() {
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
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-black-600 to-black-600 bg-clip-text text-black-600'>
                Bienvenue dans votre espace de gestion
              </h1>
              <p className='text-muted-foreground mt-2'>
                Tableau de bord d'expertise automobile - Vue d'ensemble de vos activités
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <Badge variant="outline" className='bg-black-50 text-black-700 border-black-200'>
                <div className='w-2 h-2 bg-black-500 rounded-full mr-2 animate-pulse'></div>
                Système opérationnel
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Metrics Grid */}
        <div className='grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Montant Total */}
          <Card className='group hover:shadow-lg transition-all duration-300 border-l-4 border-l-black-500 shadow-none'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-black-700'>
                Montant Total
              </CardTitle>
              <div className='p-2 bg-black-100 rounded-lg group-hover:bg-black-200 transition-colors'>
                <DollarSign className='h-4 w-4 text-black-600' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-black-700'>2,847,320 FCFA</div>
              <div className='flex items-center mt-2'>
                <TrendingUp className='h-4 w-4 text-black-500 mr-1' />
                <p className='text-black-600 text-sm font-medium'>+12.5%</p>
                <p className='text-muted-foreground text-xs ml-1'>vs mois dernier</p>
              </div>
            </CardContent>
          </Card>

          {/* Véhicules */}
          <Card className='shadow-none group hover:shadow-lg transition-all duration-300 border-l-4 border-l-black-500'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-black-700'>
                Véhicules
              </CardTitle>
              <div className='p-2 bg-black-100 rounded-lg group-hover:bg-black-200 transition-colors'>
                <Car className='h-4 w-4 text-black-600' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-black-700'>1,247</div>
              <div className='flex items-center mt-2'>
                <div className='flex-1 bg-black-100 rounded-full h-2 mr-2'>
                  <div className='bg-black-500 h-2 rounded-full' style={{ width: '78%' }}></div>
                </div>
                <p className='text-black-600 text-sm font-medium'>78%</p>
              </div>
              <p className='text-muted-foreground text-xs mt-1'>En cours d'expertise</p>
            </CardContent>
          </Card>

          {/* Clients */}
          <Card className='shadow-none group hover:shadow-lg transition-all duration-300 border-l-4 border-l-black-500'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-black-700'>
                Clients
              </CardTitle>
              <div className='p-2 bg-black-100 rounded-lg group-hover:bg-black-200 transition-colors'>
                <Users className='h-4 w-4 text-black-600' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-black-700'>892</div>
              <div className='flex items-center mt-2'>
                <UserCheck className='h-4 w-4 text-black-500 mr-1' />
                <p className='text-black-600 text-sm font-medium'>+23</p>
                <p className='text-muted-foreground text-xs ml-1'>nouveaux ce mois</p>
              </div>
            </CardContent>
          </Card>

          {/* Contrats */}
          <Card className='shadow-none group hover:shadow-lg transition-all duration-300 border-l-4 border-l-black-500'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-black-700'>
                Contrats
              </CardTitle>
              <div className='p-2 bg-black-100 rounded-lg group-hover:bg-black-200 transition-colors'>
                <FileText className='h-4 w-4 text-black-600' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-black-700'>456</div>
              <div className='flex items-center mt-2'>
                <div className='flex-1 bg-black-100 rounded-full h-2 mr-2'>
                  <div className='bg-black-500 h-2 rounded-full' style={{ width: '65%' }}></div>
                </div>
                <p className='text-black-600 text-sm font-medium'>65%</p>
              </div>
              <p className='text-muted-foreground text-xs mt-1'>Actifs</p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics Grid */}
        <div className='grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Expertises complétées */}
          <Card className='shadow-none group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-black-50 to-emerald-50 border-black-200'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-black-800'>
                Expertises complétées
              </CardTitle>
              <div className='p-2 bg-black-200 rounded-lg group-hover:bg-black-300 transition-colors'>
                <CheckCircle className='h-4 w-4 text-black-700' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-black-800'>1,089</div>
              <p className='text-black-600 text-sm mt-1'>Ce mois</p>
            </CardContent>
          </Card>

          {/* Expertises en cours */}
          <Card className='shadow-none group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-black-50 to-cyan-50 border-black-200'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-black-800'>
                Expertises en cours
              </CardTitle>
              <div className='p-2 bg-black-200 rounded-lg group-hover:bg-black-300 transition-colors'>
                <Clock className='h-4 w-4 text-black-700' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-black-800'>158</div>
              <p className='text-black-600 text-sm mt-1'>En traitement</p>
            </CardContent>
          </Card>

          {/* Experts disponibles */}
          <Card className='shadow-none group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-black-50 to-violet-50 border-black-200'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-black-800'>
                Experts disponibles
              </CardTitle>
              <div className='p-2 bg-black-200 rounded-lg group-hover:bg-black-300 transition-colors'>
                <UserCheck className='h-4 w-4 text-black-700' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-black-800'>24</div>
              <p className='text-black-600 text-sm mt-1'>Sur 28 total</p>
            </CardContent>
          </Card>

          {/* Réparateurs actifs */}
          <Card className='shadow-none group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-black-50 to-amber-50 border-black-200'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-black-800'>
                Réparateurs actifs
              </CardTitle>
              <div className='p-2 bg-black-200 rounded-lg group-hover:bg-black-300 transition-colors'>
                <Wrench className='h-4 w-4 text-black-700' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-black-800'>67</div>
              <p className='text-black-600 text-sm mt-1'>Partenaire</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics Section */}
        <div className='grid gap-6 lg:grid-cols-2'>
          {/* Activity Overview */}
          <Card className='shadow-none col-span-1'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <TrendingUp className='h-5 w-5 mr-2 text-black-600' />
                Activité récente
              </CardTitle>
              <CardDescription>
                Évolution des expertises sur les 30 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Expertises complétées</span>
                  <span className='text-sm font-medium'>1,089</span>
                </div>
                <Progress value={85} className='h-2' />
                
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Expertises en cours</span>
                  <span className='text-sm font-medium'>158</span>
                </div>
                <Progress value={12} className='h-2' />
                
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>En attente</span>
                  <span className='text-sm font-medium'>23</span>
                </div>
                <Progress value={3} className='h-2' />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className='shadow-none col-span-1'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Car className='h-5 w-5 mr-2 text-black-600' />
                Actions rapides
              </CardTitle>
              <CardDescription>
                Accès direct aux fonctionnalités principales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-3'>
                <Button className='justify-start h-12' variant="outline">
                  <Car className='h-4 w-4 mr-2' />
                  Nouvelle expertise
                </Button>
                <Button className='justify-start h-12' variant="outline">
                  <Users className='h-4 w-4 mr-2' />
                  Ajouter un client
                </Button>
                <Button className='justify-start h-12' variant="outline">
                  <FileText className='h-4 w-4 mr-2' />
                  Créer un contrat
                </Button>
                <Button className='justify-start h-12' variant="outline">
                  <Wrench className='h-4 w-4 mr-2' />
                  Gérer réparateurs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className='shadow-none mt-6'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Clock className='h-5 w-5 mr-2 text-black-600' />
              Activité récente
            </CardTitle>
            <CardDescription>
              Dernières expertises et actions effectuées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {[
                {
                  id: 1,
                  action: 'Expertise complétée',
                  vehicle: 'Peugeot 208 - AB-123-CD',
                  time: 'Il y a 2 heures',
                  status: 'success',
                  expert: 'Jean Dupont'
                },
                {
                  id: 2,
                  action: 'Nouvelle expertise',
                  vehicle: 'Renault Clio - EF-456-GH',
                  time: 'Il y a 4 heures',
                  status: 'pending',
                  expert: 'Marie Martin'
                },
                {
                  id: 3,
                  action: 'Rapport validé',
                  vehicle: 'Citroën C3 - IJ-789-KL',
                  time: 'Il y a 6 heures',
                  status: 'success',
                  expert: 'Pierre Durand'
                },
                {
                  id: 4,
                  action: 'Expertise en cours',
                  vehicle: 'Volkswagen Golf - MN-012-OP',
                  time: 'Il y a 8 heures',
                  status: 'warning',
                  expert: 'Sophie Bernard'
                }
              ].map((activity) => (
                <div key={activity.id} className='flex items-center space-x-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors'>
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' ? 'bg-black-100 text-black-600' :
                    activity.status === 'warning' ? 'bg-black-100 text-black-600' :
                    'bg-black-100 text-black-600'
                  }`}>
                    {activity.status === 'success' ? <CheckCircle className='h-4 w-4' /> :
                     activity.status === 'warning' ? <AlertTriangle className='h-4 w-4' /> :
                     <Clock className='h-4 w-4' />}
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>{activity.action}</p>
                    <p className='text-sm text-muted-foreground'>{activity.vehicle}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-medium'>{activity.expert}</p>
                    <p className='text-xs text-muted-foreground'>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
