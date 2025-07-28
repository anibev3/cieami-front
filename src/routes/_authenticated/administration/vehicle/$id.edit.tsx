import EditVehiclePage from '@/features/administration/vehicles/edit'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/administration/vehicle/$id/edit')({
  component: EditVehiclePage,
})