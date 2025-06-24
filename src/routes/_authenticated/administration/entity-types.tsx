import { createFileRoute } from '@tanstack/react-router'
import EntityTypesPage from '@/features/administration/entity-types'

export const Route = createFileRoute('/_authenticated/administration/entity-types')({
  component: EntityTypesPage,
}) 