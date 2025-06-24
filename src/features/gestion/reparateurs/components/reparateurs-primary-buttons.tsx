import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useReparateurs } from '../context/reparateurs-context'

export function ReparateursPrimaryButtons() {
  const { setOpen } = useReparateurs()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Nouveau réparateur</span> <IconPlus size={18} />
      </Button>
    </div>
  )
} 