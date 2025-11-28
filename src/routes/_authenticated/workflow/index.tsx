import { createFileRoute } from '@tanstack/react-router'
import WorkflowPage from '@/features/workflow'

export const Route = createFileRoute('/_authenticated/workflow/')({
  component: WorkflowPage,
})


