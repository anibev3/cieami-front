import { createFileRoute } from '@tanstack/react-router'
import { EditCheckPage } from '@/features/comptabilite/checks/form'

export const Route = createFileRoute('/_authenticated/comptabilite/checks/edit/$id')({
  component: EditCheckPage,
})