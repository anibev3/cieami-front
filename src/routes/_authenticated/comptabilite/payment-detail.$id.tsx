import PaymentDetail from '@/features/comptabilite/payments/PaymentDetail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/comptabilite/payment-detail/$id')({
  component: PaymentDetail,
})
