import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/comptabilite/reports/treasury')({
  component: () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">État de Trésorerie</h1>
        <p className="text-muted-foreground">
          État détaillé de la trésorerie
        </p>
      </div>
      <div className="text-center py-12">
        <p className="text-muted-foreground">Fonctionnalité en cours de développement</p>
      </div>
    </div>
  )
}) 