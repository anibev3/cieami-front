import { createFileRoute } from '@tanstack/react-router'
import BodyworksPage from '@/features/reparation/carrosseries'

export const Route = createFileRoute('/_authenticated/reparation/carrosseries')({
  component: BodyworksPage,
}) 