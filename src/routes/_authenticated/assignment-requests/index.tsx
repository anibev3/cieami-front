import { createFileRoute } from '@tanstack/react-router'
import AssignmentRequestsPage from '@/features/assignment-requests'

export const Route = createFileRoute('/_authenticated/assignment-requests/')({
  component: AssignmentRequestsPage,
})

