import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/finances/quittance')({
  component: () => (
    <div>
      <h1>Quittance</h1>
    </div>
  ),
}) 
