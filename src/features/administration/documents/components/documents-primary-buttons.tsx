import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface DocumentsPrimaryButtonsProps {
  onCreate: () => void
}

export function DocumentsPrimaryButtons({ onCreate }: DocumentsPrimaryButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nouveau document
      </Button>
    </div>
  )
} 