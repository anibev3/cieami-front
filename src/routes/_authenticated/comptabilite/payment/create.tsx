import { createFileRoute } from '@tanstack/react-router'
import CreatePaymentPage from '@/features/comptabilite/payments/create'

export const Route = createFileRoute('/_authenticated/comptabilite/payment/create')({
  component: CreatePaymentPage,
}) 