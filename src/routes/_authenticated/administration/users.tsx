import { createFileRoute } from '@tanstack/react-router'
import UsersPage from '@/features/administration/users'

export const Route = createFileRoute('/_authenticated/administration/users')({
  component: UsersPage,
}) 