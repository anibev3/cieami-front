import { createFileRoute } from '@tanstack/react-router'
import PhotosPage from '@/features/gestion/photos'

export const Route = createFileRoute('/_authenticated/gestion/photos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PhotosPage />
} 