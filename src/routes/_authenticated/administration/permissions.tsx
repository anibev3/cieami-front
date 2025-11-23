import { createFileRoute } from '@tanstack/react-router'
import PermissionsPage from '@/features/administration/permissions'

export const Route = createFileRoute('/_authenticated/administration/permissions')({
  component: PermissionsPage,
})

