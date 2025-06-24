import { createFileRoute } from '@tanstack/react-router'
import ElementsPeinturePage from '@/features/reparation/elements-peinture'

export const Route = createFileRoute('/_authenticated/reparation/elements-peinture')({
  component: ElementsPeinturePage,
}) 