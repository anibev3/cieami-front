import ReportEditPage from '@/features/assignments/report-edit'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/assignments/edite-report/$id',
)({
  component: ReportEditPage,
})
