import { createFileRoute } from '@tanstack/react-router'
import AssignmentStatisticsPage from '@/features/assignments/statistics'
// import { useACLStore, UserRole } from '@/stores/aclStore'

export const Route = createFileRoute('/_authenticated/assignments/statistics')({
  beforeLoad: async () => {
    // const { hasAnyRole, isInitialized } = useACLStore.getState()
    // const allowedRoles = [
    //   UserRole.SYSTEM_ADMIN,
    //   UserRole.CEO,
    //   UserRole.ACCOUNTANT_MANAGER,
    //   UserRole.ADMIN,
    //   UserRole.EXPERT_MANAGER,
    // ]

    // // Rediriger uniquement si l'ACL est initialisée et que l'utilisateur n'est pas autorisé
    // if (isInitialized && !hasAnyRole(allowedRoles)) {
    //   throw redirect({ to: '/403' })
    // }
  },
  component: AssignmentStatisticsPage,
})