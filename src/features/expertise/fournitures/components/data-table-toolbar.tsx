import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SupplyMutateDialog } from './supply-mutate-dialog'

export function DataTableToolbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="default">
        Créer une fourniture  
      </Button>
      <SupplyMutateDialog open={open} onOpenChange={setOpen} />
    </>
  )
} 