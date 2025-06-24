import { createFileRoute } from '@tanstack/react-router'
import VehicleStatesPage from '@/features/administration/vehicle-states'

export const Route = createFileRoute('/_authenticated/administration/vehicle-states')({
  component: VehicleStatesPage,
}) 