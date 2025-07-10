import VehicleGenrePage from '@/features/administration/vehicle/genre'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/administration/vehicule/genre',
)({
  component: VehicleGenrePage,
})
