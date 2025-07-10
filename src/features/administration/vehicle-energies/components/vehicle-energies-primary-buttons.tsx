import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface VehicleEnergiesPrimaryButtonsProps {
  onCreate: () => void
}

export function VehicleEnergiesPrimaryButtons({ onCreate }: VehicleEnergiesPrimaryButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nouvelle énergie
      </Button>
    </div>
  )
} 