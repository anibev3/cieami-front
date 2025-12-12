import Cookies from 'js-cookie'
import { Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import { StrictProtectedRoute } from '@/components/auth'
import { useAuth } from '@/stores/authStore'
import { useUserRefresh } from '@/hooks/useUserRefresh'
import { USER_REFRESH_CONFIG } from '@/config/userRefresh'

interface Props {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: Props) {
  const { isAuthenticated } = useAuth()
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'

  // Rafraîchir périodiquement les informations utilisateur (permissions, rôles, etc.)
  // Cela permet de mettre à jour automatiquement les permissions quand elles sont modifiées
  // sans nécessiter une reconnexion de l'utilisateur
  useUserRefresh({
    interval: USER_REFRESH_CONFIG.DEFAULT_INTERVAL,
    onlyWhenVisible: USER_REFRESH_CONFIG.ONLY_WHEN_VISIBLE,
    enabled: isAuthenticated, // Activer uniquement si l'utilisateur est authentifié
  })

  return (
    <StrictProtectedRoute>
      <SearchProvider>
        <SidebarProvider defaultOpen={defaultOpen}
          style={{
            '--sidebar-width': '25rem', // 400px pour la sidebar à deux panneaux (80px gauche + 320px droite)
            '--sidebar-width-mobile': '20rem',
          } as React.CSSProperties}
          className="h-svh overflow-hidden"
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
              'flex h-svh flex-col overflow-y-auto',
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
