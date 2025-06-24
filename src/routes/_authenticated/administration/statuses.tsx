import { createFileRoute } from '@tanstack/react-router'
import StatusesPage from '@/features/administration/statuses'

export const Route = createFileRoute('/_authenticated/administration/statuses')({
  component: StatusesPage,
}) 