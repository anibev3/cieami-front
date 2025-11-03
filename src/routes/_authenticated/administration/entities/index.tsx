import { createFileRoute } from '@tanstack/react-router'
import EntitiesPage from '@/features/administration/entities'

export const Route = createFileRoute('/_authenticated/administration/entities/')({
  component: EntitiesPage,
}) 