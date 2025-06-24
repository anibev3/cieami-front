import { createFileRoute } from '@tanstack/react-router'
import ColorsPage from '@/features/administration/colors'

export const Route = createFileRoute('/_authenticated/administration/colors')({
  component: ColorsPage,
}) 