import { createFileRoute } from '@tanstack/react-router'
import AssureursPage from '@/features/gestion/assureurs'

export const Route = createFileRoute('/_authenticated/gestion/assureurs')({
  component: AssureursPage,
}) 