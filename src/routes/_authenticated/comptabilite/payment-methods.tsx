import PaymentMethodsPage from '@/features/comptabilite/payment-methods'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/comptabilite/payment-methods')({
  component: PaymentMethodsPage,
})