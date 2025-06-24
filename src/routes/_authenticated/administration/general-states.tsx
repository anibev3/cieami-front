import { createFileRoute } from '@tanstack/react-router'
import GeneralStatesPage from '@/features/administration/general-states'

export const Route = createFileRoute('/_authenticated/administration/general-states')({
  component: GeneralStatesPage,
}) 