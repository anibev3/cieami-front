import CreateAscertainmentPage from '@/features/administration/constat/create'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/administration/constat/create/',
)({
  component: CreateAscertainmentPage, 
})

