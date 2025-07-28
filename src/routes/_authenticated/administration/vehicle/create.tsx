import CreateVehiclePage from '@/features/administration/vehicles/create'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/administration/vehicle/create')({
  component: CreateVehiclePage,
})
