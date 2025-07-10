import { createFileRoute } from '@tanstack/react-router'
import AssignmentsRecoveryExpiredPage from '@/features/assignments/recovery-expired'

export const Route = createFileRoute(
  '/_authenticated/assignments/recovery-expired/',
)({
  component: AssignmentsRecoveryExpiredPage,
})
