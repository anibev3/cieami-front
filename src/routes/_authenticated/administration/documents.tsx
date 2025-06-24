import { createFileRoute } from '@tanstack/react-router'
import DocumentsTransmittedPage from '@/features/administration/documents'

export const Route = createFileRoute('/_authenticated/administration/documents')({
  component: DocumentsTransmittedPage,
}) 