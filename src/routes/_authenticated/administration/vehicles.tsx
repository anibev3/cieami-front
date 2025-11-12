  import VehiclesPage from '@/features/administration/vehicles'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/administration/vehicles')({
  component: VehiclesPage,
}) 