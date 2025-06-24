import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface EntitiesPrimaryButtonsProps {
  onCreate: () => void
}

export function EntitiesPrimaryButtons({ onCreate }: EntitiesPrimaryButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nouvelle entité
      </Button>
    </div>
  )
} 