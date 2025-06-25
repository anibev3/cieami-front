import RealizeAssignmentPage from '@/features/assignments/realize'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/assignments/realize/$id')({
  component: RealizeAssignmentPage,
}) 