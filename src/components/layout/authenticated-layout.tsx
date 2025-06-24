import Cookies from 'js-cookie'
import { Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import { StrictProtectedRoute } from '@/components/auth'
import { useAuth } from '@/stores/authStore'
import { Loader2 } from 'lucide-react'

interface Props {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth()
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'

  // Affichage d'un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  // Si l'utilisateur n'est pas authentifié, on ne rend rien
  // La redirection sera gérée par le composant StrictProtectedRoute
  if (!isAuthenticated) {
    return null
  }

  return (
    <StrictProtectedRoute>
      <SearchProvider>
        <SidebarProvider defaultOpen={defaultOpen}
          style={{
            '--sidebar-width': '18rem',
            '--sidebar-width-mobile': '20rem',
          } as React.CSSProperties}
        >
          <SkipToMain />
          <AppSidebar />
          <div
            id='content'
            className={cn(
              'ml-auto w-full max-w-full',
              'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
              'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
              'sm:transition-[width] sm:duration-200 sm:ease-linear',
              'flex h-svh flex-col',
              'group-data-[scroll-locked=1]/body:h-full',
              'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
            )}
          >
            {children ? children : <Outlet />}
          </div>
        </SidebarProvider>
      </SearchProvider>
    </StrictProtectedRoute>
  )
}
