import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/comptabilite/reports/checks')({
  component: () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rapport des Chèques</h1>
        <p className="text-muted-foreground">
          Rapport détaillé des chèques
        </p>
      </div>
      <div className="text-center py-12">
        <p className="text-muted-foreground">Fonctionnalité en cours de développement</p>
      </div>
    </div>
  )
}) 