import Comptabilite from '@/features/comptabilite'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/comptabilite/')({
  component: Comptabilite,
})

