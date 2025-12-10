import { createFileRoute } from '@tanstack/react-router'
import FNESettingsPage from '@/features/administration/fne-settings'

export const Route = createFileRoute('/_authenticated/administration/fne-settings')({
  component: FNESettingsPage,
})
