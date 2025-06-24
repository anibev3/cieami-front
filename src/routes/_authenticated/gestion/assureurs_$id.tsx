import { createFileRoute } from '@tanstack/react-router'
import AssureurDetailPage from '@/features/gestion/assureurs/detail-page'

export const Route = createFileRoute('/_authenticated/gestion/assureurs_$id')({
  component: AssureurDetailPage,
}) 