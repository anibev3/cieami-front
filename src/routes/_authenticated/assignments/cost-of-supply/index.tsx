import CostOfSupplyPage from '@/features/assignments/cost-of-supply'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/assignments/cost-of-supply/',
)({
  component: CostOfSupplyPage,
})
