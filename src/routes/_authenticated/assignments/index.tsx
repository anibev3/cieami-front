import { createFileRoute } from '@tanstack/react-router'
import AssignmentsPage from '@/features/assignments/page'

export const Route = createFileRoute('/_authenticated/assignments/')({
  component: AssignmentsPage,
}) 