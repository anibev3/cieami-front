import VehicleEnergiePage from '@/features/administration/vehicle/energie'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/administration/vehicule/energie',
)({
  component: VehicleEnergiePage,
})

