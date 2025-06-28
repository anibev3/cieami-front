import ChecksPage from '@/features/comptabilite/checks'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/comptabilite/checks')({
  component: ChecksPage,
})