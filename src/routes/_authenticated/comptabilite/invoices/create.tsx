import CreateInvoicePage from '@/features/comptabilite/invoices/create' 

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/comptabilite/invoices/create')({
  component: CreateInvoicePage,
})


