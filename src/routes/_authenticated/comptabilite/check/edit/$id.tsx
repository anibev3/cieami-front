import { createFileRoute } from '@tanstack/react-router'
import EditCheckPage from '@/features/comptabilite/checks/edit.$id'

export const Route = createFileRoute('/_authenticated/comptabilite/check/edit/$id')({
  component: EditCheckPage
}) 