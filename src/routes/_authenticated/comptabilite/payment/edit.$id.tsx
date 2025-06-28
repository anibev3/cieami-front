import { createFileRoute } from '@tanstack/react-router'
import EditPaymentPage from '@/features/comptabilite/payments/edit.$id'

export const Route = createFileRoute('/_authenticated/comptabilite/payment/edit/$id')({
  component: EditPaymentPage,
}) 