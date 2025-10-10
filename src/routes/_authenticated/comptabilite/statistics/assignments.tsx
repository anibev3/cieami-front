import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/comptabilite/statistics/assignments'
)({
  component: () => {
    return <div>Assignments Statistics</div>
  }
})
