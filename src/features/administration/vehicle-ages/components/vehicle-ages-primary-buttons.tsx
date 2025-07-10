import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface VehicleAgesPrimaryButtonsProps {
  onCreate: () => void
}

export function VehicleAgesPrimaryButtons({ onCreate }: VehicleAgesPrimaryButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nouvel âge
      </Button>
    </div>
  )
} 