import AssignmentsRecoveryExpiredPage from '@/features/assignments/recovery-expired'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/assignments/recovery-expired/',
)({
  component: AssignmentsRecoveryExpiredPage,
})
