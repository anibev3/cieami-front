import InvoicesPage from '@/features/comptabilite/invoices'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/comptabilite/invoices/')({
  component: InvoicesPage,
})


