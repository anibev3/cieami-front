import { createFileRoute } from '@tanstack/react-router'
import VehicleModelsPage from '@/features/administration/vehicle-models'

export const Route = createFileRoute('/_authenticated/administration/vehicle-models')({
  component: VehicleModelsPage,
}) 