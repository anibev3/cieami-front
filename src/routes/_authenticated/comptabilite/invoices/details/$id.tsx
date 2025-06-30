import InvoiceDetailPage from '@/features/comptabilite/invoices/details'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/comptabilite/invoices/details/$id',
)({
  component: InvoiceDetailPage,
})

