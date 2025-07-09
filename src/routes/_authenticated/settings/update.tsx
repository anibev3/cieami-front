import { createFileRoute } from '@tanstack/react-router'
import UpdateFeature from '../../../features/settings/update'

export const Route = createFileRoute('/_authenticated/settings/update')({
  component: UpdateFeature,
})
