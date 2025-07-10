import VehicleAgePage from '@/features/administration/vehicle/age'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/administration/vehicule/age',
)({
  component: VehicleAgePage,
})
