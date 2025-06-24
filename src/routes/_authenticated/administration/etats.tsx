import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/administration/etats')({
  component: () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">États généraux</h2>
        <p className="text-muted-foreground">Page en cours de développement</p>
      </div>
    </div>
  ),
}) 