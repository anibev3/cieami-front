import { createFileRoute } from '@tanstack/react-router'
import ReparateurDetailPage from '@/features/gestion/reparateurs/detail-page'

export const Route = createFileRoute('/_authenticated/gestion/reparateurs_$id')({
  component: ReparateurDetailPage,
}) 