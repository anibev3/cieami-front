import PaymentsPage from '@/features/comptabilite/payments'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/comptabilite/payments')({
  component: PaymentsPage,
})