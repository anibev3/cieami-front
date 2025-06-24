import { createFileRoute } from '@tanstack/react-router'
import DocumentTransmisDetailPage from '@/features/gestion/documents/detail-page'

export const Route = createFileRoute('/_authenticated/gestion/documents_$id')({
  component: DocumentTransmisDetailPage,
}) 