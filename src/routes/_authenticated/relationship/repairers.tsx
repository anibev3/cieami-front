import { createFileRoute } from '@tanstack/react-router'
import RepairerRelationshipsPage from '@/features/relationship/repairers'

export const Route = createFileRoute('/_authenticated/relationship/repairers')({
  component: RepairerRelationshipsPage,
})


