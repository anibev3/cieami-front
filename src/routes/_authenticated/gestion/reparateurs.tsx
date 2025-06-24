import { createFileRoute } from '@tanstack/react-router'
import ReparateursPage from '@/features/gestion/reparateurs'

export const Route = createFileRoute('/_authenticated/gestion/reparateurs')({
  component: ReparateursPage,
}) 