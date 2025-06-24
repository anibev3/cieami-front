import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShockPointMutateDialog } from './shock-point-mutate-dialog'

export function DataTableToolbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="default">
        Ajouter un point de choc
      </Button>
      <ShockPointMutateDialog open={open} onOpenChange={setOpen} />
    </>
  )
} 