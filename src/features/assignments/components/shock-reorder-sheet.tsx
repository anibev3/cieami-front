/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { Loader2, List, GripVertical } from 'lucide-react'

import { DndContext, closestCenter, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export interface ShockItem {
  id: number
  label: string
  amount?: string | number | null
}

interface ShockReorderSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shocks: ShockItem[]
  onConfirm: (orderedIds: number[]) => Promise<void> | void
  focusShockId?: number | null
  title?: string
}

export function ShockReorderSheet({ open, onOpenChange, shocks, onConfirm, focusShockId, title = 'Réorganiser les chocs' }: ShockReorderSheetProps) {
  const isMobile = useIsMobile()
  const [localList, setLocalList] = useState<ShockItem[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setLocalList(shocks.map(s => ({ ...s })))
      // Scroll to focused shock inside the sheet after it opens
      setTimeout(() => {
        if (focusShockId) {
          const el = document.querySelector(`[data-reorder-shock-id="${focusShockId}"]`)
          if (el && 'scrollIntoView' in el) {
            (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }, 200)
    }
  }, [open, shocks, focusShockId])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const sortableIds = useMemo(() => localList.map(i => i.id), [localList])

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setLocalList((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return items
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  const handleConfirm = async () => {
    try {
      setSubmitting(true)
      await onConfirm(localList.map(i => i.id))
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className={isMobile ? 'h-[80vh]' : 'w-[420px]'}>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <List className="h-5 w-5" /> {title}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-3 px-4 h-[85%] overflow-y-auto">
          {localList.length === 0 ? (
            <div className="text-sm text-gray-500">Aucun choc à réorganiser</div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {localList.map((item, index) => (
                    <SortableRow
                      key={item.id}
                      id={item.id}
                      index={index}
                      label={item.label}
                      focused={focusShockId === item.id}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 px-4 pb-5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button className="w-2/3" onClick={handleConfirm} disabled={submitting || localList.length === 0}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer l'ordre"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function SortableRow({ id, index, label, focused }: { id: number; index: number; label: string; focused?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-reorder-shock-id={id}
      className={cn(
        'flex items-center gap-3 p-2 rounded-md border bg-white',
        focused && 'ring-2 ring-blue-400',
        isDragging && 'opacity-70 shadow-sm'
      )}
    >
      <button
        className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        aria-label="Saisir pour déplacer"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">Choc {index + 1} — {label}</div>
        <div className="text-xs text-gray-500">ID: {id}</div>
      </div>
    </div>
  )
}

