import { createFileRoute } from '@tanstack/react-router'
import ReceiptsPage from '@/features/finances/receipts'

export const Route = createFileRoute('/_authenticated/finances/receipts')({
  component: ReceiptsPage,
})
