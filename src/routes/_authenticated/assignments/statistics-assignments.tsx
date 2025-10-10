import { createFileRoute } from '@tanstack/react-router'
import AssignmentsStatisticsPage from '@/features/assignments/statistics/assignments-statistics'

export const Route = createFileRoute('/_authenticated/assignments/statistics-assignments')({
  component: AssignmentsStatisticsPage,
})


