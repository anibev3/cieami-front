import AscertainmentDetailPage from '@/features/administration/constat/detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/administration/constat/details/$id',
)({
  component: AscertainmentDetailPage,
})
