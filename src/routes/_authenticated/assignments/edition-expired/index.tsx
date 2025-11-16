import { createFileRoute } from '@tanstack/react-router'

import AssignmentsEditionExpiredPage from '@/features/assignments/edition-expired'

export const Route = createFileRoute(
  '/_authenticated/assignments/edition-expired/',
)({
  component: AssignmentsEditionExpiredPage,
})
