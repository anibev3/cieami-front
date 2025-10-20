import { createFileRoute } from '@tanstack/react-router'
import InsurerRelationshipsPage from '@/features/relationship'

export const Route = createFileRoute('/_authenticated/relationship/')({
  component: InsurerRelationshipsPage,
})


