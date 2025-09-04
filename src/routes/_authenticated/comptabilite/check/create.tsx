import { createFileRoute } from '@tanstack/react-router'
import { CreateCheckPage } from '@/features/comptabilite/checks/form'
export const Route = createFileRoute('/_authenticated/comptabilite/check/create')({
  component: CreateCheckPage
}) 