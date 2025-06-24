import { createFileRoute } from '@tanstack/react-router'
import PaintingPricesPage from '@/features/reparation/prix-peinture'

export const Route = createFileRoute('/_authenticated/reparation/prix-peinture')({
  component: PaintingPricesPage,
}) 