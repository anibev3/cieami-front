import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface DepreciationTablesPrimaryButtonsProps {
  onCreate: () => void
}

export function DepreciationTablesPrimaryButtons({ onCreate }: DepreciationTablesPrimaryButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nouveau tableau
      </Button>
    </div>
  )
} 