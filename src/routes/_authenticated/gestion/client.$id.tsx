import { createFileRoute } from '@tanstack/react-router'
import ClientDetailsPage from '@/features/gestion/clients/detail-page'

export const Route = createFileRoute('/_authenticated/gestion/client/$id')({
  component: ClientDetailsPage,
}) 