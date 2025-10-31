import QuotePreparationPage from '@/features/assignments/quote-preparation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/assignments/quote-preparation/$id',
)({
  component: QuotePreparationPage,
})


