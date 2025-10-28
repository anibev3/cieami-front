import { createFileRoute } from '@tanstack/react-router'
import TarificationHonorairePage from '@/features/reparation/tarification-honoraire'

export const Route = createFileRoute('/_authenticated/reparation/tarification-honoraire')({
  component: TarificationHonorairePage,
})