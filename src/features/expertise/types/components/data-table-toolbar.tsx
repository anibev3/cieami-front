import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ExpertiseTypeMutateDialog } from './expertise-type-mutate-dialog'

export function DataTableToolbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="default">
        Ajouter un type d'expertise
      </Button>
      <ExpertiseTypeMutateDialog open={open} onOpenChange={setOpen} />
    </>
  )
} 