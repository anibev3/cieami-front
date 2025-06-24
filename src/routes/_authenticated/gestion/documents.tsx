import { createFileRoute } from '@tanstack/react-router'
import DocumentsTransmisPage from '@/features/gestion/documents'

export const Route = createFileRoute('/_authenticated/gestion/documents')({
  component: DocumentsTransmisPage,
}) 