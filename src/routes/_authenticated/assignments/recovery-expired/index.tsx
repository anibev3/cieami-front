import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { 
  Clock, 
  AlertTriangle, 
  ArrowLeft, 
  Construction,
  Zap,
  TrendingUp,
  Calendar,
  CheckCircle
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/assignments/recovery-expired/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="flex items-center justify-center bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <Construction className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="destructive" className="animate-pulse">
                      <Zap className="h-3 w-3 mr-1" />
                      Nouveau
                    </Badge>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Dossiers en Recouvrement Expiré
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Cette fonctionnalité est actuellement en cours de développement pour vous offrir une meilleure gestion des dossiers en recouvrement expiré.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate({ to: '/assignments' })}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux Dossiers
              </Button>
              
              <Button 
                variant="outline"
                className="border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 px-8 py-3 rounded-lg transition-all duration-300"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Signaler un Problème
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center mt-12">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cette fonctionnalité sera disponible prochainement. Restez connecté pour les mises à jour !
              </p>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}
