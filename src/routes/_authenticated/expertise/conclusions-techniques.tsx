import ConclusionTechniquePage from '@/features/expertise/conclusion-technique'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/expertise/conclusions-techniques')({
  component: ConclusionTechniquePage,
}) 