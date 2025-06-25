import { createFileRoute } from '@tanstack/react-router'
import AssignmentDetailPage from '@/features/assignments/detail'
 
export const Route = createFileRoute('/_authenticated/assignments/$id')({
  component: AssignmentDetailPage,
}) 