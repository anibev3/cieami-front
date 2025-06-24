import AssignmentTypesPage from '@/features/administration/assignment-types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/administration/assignment-types')({
  component: AssignmentTypesPage,
})