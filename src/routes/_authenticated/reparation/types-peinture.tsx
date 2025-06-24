import { createFileRoute } from '@tanstack/react-router'
import PaintTypesPage from '@/features/reparation/types-peinture'

export const Route = createFileRoute('/_authenticated/reparation/types-peinture')({
  component: PaintTypesPage,
}) 