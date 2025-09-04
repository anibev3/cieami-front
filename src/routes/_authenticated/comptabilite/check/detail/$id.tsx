import CheckDetailPage from '@/features/comptabilite/checks/detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/comptabilite/check/detail/$id')({
  component: CheckDetailPage,
})
