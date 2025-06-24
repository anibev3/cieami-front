import { createFileRoute } from '@tanstack/react-router'
import BrandsPage from '@/features/administration/brands'

export const Route = createFileRoute('/_authenticated/administration/brands')({
  component: BrandsPage,
}) 