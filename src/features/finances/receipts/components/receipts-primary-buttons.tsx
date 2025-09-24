import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface ReceiptsPrimaryButtonsProps {
  onCreate: () => void
}

export function ReceiptsPrimaryButtons({ onCreate }: ReceiptsPrimaryButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nouvelle quittance
      </Button>
    </div>
  )
}
