import ExpertiseSheetPage from '@/features/assignments/fiche-expertise'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/assignments/expertise-sheet/$id',
)({
  component: ExpertiseSheetPage,
})


