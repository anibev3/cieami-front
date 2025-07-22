import ClaimNaturePage from '@/features/gestion/sinistre/nature-sinistre'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/gestion/sinistre/nature-sinistre',
)({
  component: ClaimNaturePage,
})

