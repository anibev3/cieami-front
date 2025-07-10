import DepreciationTablesPage from '@/features/gestion/depreciation-tables'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/gestion/depreciation-tables/',
)({
  component: DepreciationTablesPage,
})
