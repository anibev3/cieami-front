import EditReportPage from '@/features/assignments/redaction'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/assignments/edit-report/$id',
)({
  component: EditReportPage,
})

