import BanksPage from '@/features/comptabilite/banks'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/comptabilite/banks')({
  component: BanksPage,
})