 import OtherCostTypesPage from '@/features/finances/other-cost-types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/finances/cost-types')({
    component: OtherCostTypesPage,
}) 