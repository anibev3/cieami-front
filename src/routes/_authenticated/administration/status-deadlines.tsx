import { createFileRoute } from '@tanstack/react-router'
import StatusDeadlinesPage from '@/features/administration/status-deadlines'

export const Route = createFileRoute('/_authenticated/administration/status-deadlines')({
  component: StatusDeadlinesPage,
})
