import ExpertiseTypesPage from '@/features/expertise/types'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_authenticated/expertise/types')({
  component: ExpertiseTypesPage,
}) 