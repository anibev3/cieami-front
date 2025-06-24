import { createFileRoute } from '@tanstack/react-router'
import WorkforceTypesPage from '@/features/expertise/type-main-oeuvre'

export const Route = createFileRoute('/_authenticated/expertise/type-main-oeuvre')({
  component: WorkforceTypesPage,
}) 