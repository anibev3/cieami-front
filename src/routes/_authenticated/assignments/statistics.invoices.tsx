import { createFileRoute } from '@tanstack/react-router'
import InvoicesStatisticsPage from '@/features/assignments/statistics/invoices-statistics'

export const Route = createFileRoute('/_authenticated/assignments/statistics/invoices')({
  component: InvoicesStatisticsPage,
})


