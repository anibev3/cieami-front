import FournituresPage from '@/features/expertise/fournitures'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_authenticated/expertise/fournitures')({
  component: FournituresPage,
}) 