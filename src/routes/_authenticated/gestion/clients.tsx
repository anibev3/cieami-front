import { createFileRoute } from '@tanstack/react-router'
import ClientsPage from '@/features/gestion/clients'

export const Route = createFileRoute('/_authenticated/gestion/clients')({
  component: ClientsPage,
}) 