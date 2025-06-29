import { createFileRoute } from '@tanstack/react-router'
import PhotoTypesPage from '@/features/gestion/photos-type'

export const Route = createFileRoute('/_authenticated/gestion/photo-types')({
  component: PhotoTypesPage,
})
