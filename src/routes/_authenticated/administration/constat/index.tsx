import ConstatPage from '@/features/administration/constat'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/administration/constat/')(
  {
    component: ConstatPage,
  },
)
