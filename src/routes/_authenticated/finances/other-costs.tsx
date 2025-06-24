import { createFileRoute } from '@tanstack/react-router'
import OtherCostTypesPage from '@/features/finances/other-cost-types'

export const Route = createFileRoute('/_authenticated/finances/other-costs')({
  component: OtherCostTypesPage,
}) 