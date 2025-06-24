import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface AssignmentTypesPrimaryButtonsProps {
  onCreate: () => void
}

export function AssignmentTypesPrimaryButtons({ onCreate }: AssignmentTypesPrimaryButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nouveau type d'affectation
      </Button>
    </div>
  )
} 