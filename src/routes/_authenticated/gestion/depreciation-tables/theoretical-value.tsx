import TheoreticalValuePage from '@/features/gestion/depreciation-tables/theoretical-value'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/gestion/depreciation-tables/theoretical-value',
)({
  component: TheoreticalValuePage,
})
