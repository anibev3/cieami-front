import { createFileRoute } from '@tanstack/react-router'
import AssignmentRequestDetailPage from '@/features/assignment-requests/detail'

export const Route = createFileRoute('/_authenticated/assignment-requests/$id')({
  component: AssignmentRequestDetailPage,
})

