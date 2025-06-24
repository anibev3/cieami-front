import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useAssureurs } from '../context/assureurs-context'

export function AssureursPrimaryButtons() {
  const { setOpen } = useAssureurs()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Nouvel assureur</span> <IconPlus size={18} />
      </Button>
    </div>
  )
} 