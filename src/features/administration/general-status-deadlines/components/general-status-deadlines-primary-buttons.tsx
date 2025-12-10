import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface GeneralStatusDeadlinesPrimaryButtonsProps {
  onCreate: () => void
}

export function GeneralStatusDeadlinesPrimaryButtons({ onCreate }: GeneralStatusDeadlinesPrimaryButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nouveau délai
      </Button>
    </div>
  )
}
