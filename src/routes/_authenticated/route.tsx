import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { authService } from '@/services/authService'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async () => {
    // Vérification supplémentaire au niveau de la route
    // Si l'utilisateur n'est pas authentifié, redirection immédiate
    if (!authService.isAuthenticated()) {
      throw redirect({
        to: '/sign-in-2',
        search: {
          redirect: window.location.pathname,
        },
      })
    }
  },
})
