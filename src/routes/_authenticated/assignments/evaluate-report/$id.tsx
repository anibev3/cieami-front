import { createFileRoute } from '@tanstack/react-router'
import EvaluateReportPage from '@/features/assignments/evaluate-report'

export const Route = createFileRoute(
  '/_authenticated/assignments/evaluate-report/$id',
)({
  component: EvaluateReportPage,
})

