import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface GeneralStatesPrimaryButtonsProps {
  onCreate: () => void
}

export function GeneralStatesPrimaryButtons({ onCreate }: GeneralStatesPrimaryButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nouvel état général
      </Button>
    </div>
  )
} 