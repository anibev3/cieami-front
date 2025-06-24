import { createFileRoute } from '@tanstack/react-router'
import ClientDetailPage from '@/features/gestion/clients/detail-page'

export const Route = createFileRoute('/_authenticated/gestion/clients_$id')({
  component: ClientDetailPage,
}) 