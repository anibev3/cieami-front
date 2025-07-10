import ConstatTypePage from '@/features/administration/constat/type'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/administration/constat/type',
)({
  component: ConstatTypePage,
})

