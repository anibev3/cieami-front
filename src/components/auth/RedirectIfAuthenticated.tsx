import { ReactNode } from 'react'
import { useRedirectIfAuthenticated } from '@/hooks/useAuth'

interface RedirectIfAuthenticatedProps {
  children: ReactNode
}

export function RedirectIfAuthenticated({ children }: RedirectIfAuthenticatedProps) {
  const { isAuthenticated } = useRedirectIfAuthenticated()

  // Si l'utilisateur est authentifié, ne rien afficher (la redirection est gérée par useRedirectIfAuthenticated)
  if (isAuthenticated) {
    return null
  }

  // Afficher le contenu même pendant le chargement initial
  // Le loading sera géré au niveau du bouton de connexion
  return <>{children}</>
} 