import RemarquePage from '@/features/gestion/remarque'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/gestion/remarque/')({
  component: RemarquePage,
})
