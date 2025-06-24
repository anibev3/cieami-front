import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

interface DocumentsPrimaryButtonsProps {
  onCreate: () => void
}

export function DocumentsPrimaryButtons({ onCreate }: DocumentsPrimaryButtonsProps) {
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={onCreate}>
        <span>Nouveau document</span> <IconPlus size={18} />
      </Button>
    </div>
  )
} 