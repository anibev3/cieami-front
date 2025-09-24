import { createFileRoute } from '@tanstack/react-router'
import OtherCostsPage from '@/features/finances/other-cost'

export const Route = createFileRoute('/_authenticated/finances/other-costs')({
  component: OtherCostsPage,
}) 