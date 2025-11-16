import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

export const Route = createFileRoute('/_authenticated/administration/etats')({
  component: () => (
    <ProtectedRoute requiredPermission={Permission.VIEW_GENERAL_STATE}>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">États généraux</h2>
          <p className="text-muted-foreground">Page en cours de développement</p>
        </div>
      </div>
    </ProtectedRoute>
  ),
}) 