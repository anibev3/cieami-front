import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PaintType, PaintTypeCreate, PaintTypeUpdate } from '@/types/paint-types'
import { usePaintTypesStore } from '@/stores/paint-types'

const paintTypeSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  label: z.string().min(1, 'Le libellé est requis'),
  description: z.string().min(1, 'La description est requise'),
})

type PaintTypeFormData = z.infer<typeof paintTypeSchema>

interface PaintTypeMutateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paintType?: PaintType | null
  mode: 'create' | 'edit'
}

export function PaintTypeMutateDialog({
  open,
  onOpenChange,
  paintType,
  mode,
}: PaintTypeMutateDialogProps) {
  const { createPaintType, updatePaintType, loading } = usePaintTypesStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PaintTypeFormData>({
    resolver: zodResolver(paintTypeSchema),
    defaultValues: {
      code: '',
      label: '',
      description: '',
    },
  })

  useEffect(() => {
    if (paintType && mode === 'edit') {
      form.reset({
        code: paintType.code,
        label: paintType.label,
        description: paintType.description,
      })
    } else {
      form.reset({
        code: '',
        label: '',
        description: '',
      })
    }
  }, [paintType, mode, form])

  const onSubmit = async (data: PaintTypeFormData) => {
    setIsSubmitting(true)
    
    try {
      let success = false
      
      if (mode === 'create') {
        const createData: PaintTypeCreate = {
          code: data.code,
          label: data.label,
          description: data.description,
        }
        success = await createPaintType(createData)
      } else if (paintType) {
        const updateData: PaintTypeUpdate = {
          code: data.code,
          label: data.label,
          description: data.description,
        }
        success = await updatePaintType(paintType.id, updateData)
      }

      if (success) {
        onOpenChange(false)
        form.reset()
      }
    } catch (_error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Créer un type' : 'Modifier le type'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Remplissez les informations pour créer un nouveau type de peinture.'
              : 'Modifiez les informations du type de peinture.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libellé</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le libellé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Entrez la description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Modifier'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 