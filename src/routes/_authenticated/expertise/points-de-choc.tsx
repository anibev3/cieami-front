import ShockPointsPage from '@/features/expertise/points-de-choc'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_authenticated/expertise/points-de-choc')({
  component: ShockPointsPage,
}) 