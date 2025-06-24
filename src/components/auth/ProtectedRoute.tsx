import { ReactNode } from 'react'
import { useRequireAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useRequireAuth()

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      )
    )
  }

  if (!isAuthenticated) {
    return null // La redirection est gérée par useRequireAuth
  }

  return <>{children}</>
} 