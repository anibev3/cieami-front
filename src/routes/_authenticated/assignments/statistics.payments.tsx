import { createFileRoute } from '@tanstack/react-router'
import PaymentsStatisticsPage from '@/features/assignments/statistics/payments-statistics'

export const Route = createFileRoute('/_authenticated/assignments/statistics/payments')({
  component: PaymentsStatisticsPage,
})


