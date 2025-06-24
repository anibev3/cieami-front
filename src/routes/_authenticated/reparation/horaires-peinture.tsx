import { createFileRoute } from '@tanstack/react-router'
import HorairesPeinturePage from '@/features/reparation/horaires-peinture'

export const Route = createFileRoute('/_authenticated/reparation/horaires-peinture')({
  component: HorairesPeinturePage,
}) 