import AssignmentsEditionExpiredPage from '@/features/assignments/edition-expired'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/assignments/edition-expired/',
)({
  component: AssignmentsEditionExpiredPage,
})
