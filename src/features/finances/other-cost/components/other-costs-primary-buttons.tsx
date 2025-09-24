import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface OtherCostsPrimaryButtonsProps {
  onCreate: () => void
}

export function OtherCostsPrimaryButtons({ onCreate }: OtherCostsPrimaryButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nouveau coût
      </Button>
    </div>
  )
}
