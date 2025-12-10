import { createFileRoute } from '@tanstack/react-router'
import GeneralStatusDeadlinesPage from '@/features/administration/general-status-deadlines'

export const Route = createFileRoute('/_authenticated/administration/general-status-deadlines')({
  component: GeneralStatusDeadlinesPage,
})
