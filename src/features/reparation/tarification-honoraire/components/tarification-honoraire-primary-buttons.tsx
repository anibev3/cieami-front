import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

interface Props {
  onCreate: () => void
}

export function TarificationHonorairePrimaryButtons({ onCreate }: Props) {
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={onCreate}>
        <span>Nouvelle tarification</span> <IconPlus size={18} />
      </Button>
    </div>
  )
} 