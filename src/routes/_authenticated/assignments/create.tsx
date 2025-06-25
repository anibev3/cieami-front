import CreateAssignmentPage from '@/features/assignments/create'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/assignments/create')({
  component: CreateAssignmentPage,
}) 