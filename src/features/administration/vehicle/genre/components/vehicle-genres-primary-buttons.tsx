import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface VehicleGenresPrimaryButtonsProps {
  onCreate: () => void
}

export function VehicleGenresPrimaryButtons({ onCreate }: VehicleGenresPrimaryButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nouveau genre
      </Button>
    </div>
  )
} 