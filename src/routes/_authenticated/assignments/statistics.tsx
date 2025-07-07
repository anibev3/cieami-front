import { createFileRoute } from '@tanstack/react-router'
import AssignmentStatisticsPage from '@/features/assignments/statistics'

export const Route = createFileRoute('/_authenticated/assignments/statistics')({
  component: AssignmentStatisticsPage,
}) 