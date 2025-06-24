import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface VehiclesPrimaryButtonsProps {
  onCreate: () => void
}

export function VehiclesPrimaryButtons({ onCreate }: VehiclesPrimaryButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nouveau véhicule
      </Button>
    </div>
  )
} 