import AssignmentStatisticsPage from '@/features/assignments/statistics'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/comptabilite/statistics/assignments',
)({
  component: AssignmentStatisticsPage,
})
