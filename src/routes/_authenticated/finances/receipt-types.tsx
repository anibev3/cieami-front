import { createFileRoute } from '@tanstack/react-router'
import ReceiptTypesPage from '@/features/finances/receipt-types'

export const Route = createFileRoute('/_authenticated/finances/receipt-types')({
  component: ReceiptTypesPage,
}) 