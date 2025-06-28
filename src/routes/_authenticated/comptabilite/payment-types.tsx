import PaymentTypesPage from '@/features/comptabilite/payment-types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/comptabilite/payment-types')({
  component: PaymentTypesPage,
})