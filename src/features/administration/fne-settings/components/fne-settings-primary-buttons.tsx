import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface FNESettingsPrimaryButtonsProps {
  onCreate: () => void
}

export function FNESettingsPrimaryButtons({ onCreate }: FNESettingsPrimaryButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nouveau paramètre FNE
      </Button>
    </div>
  )
}
