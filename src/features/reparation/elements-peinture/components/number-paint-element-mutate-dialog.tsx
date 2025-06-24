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
import { NumberPaintElement, NumberPaintElementCreate, NumberPaintElementUpdate } from '@/types/number-paint-elements'
import { useNumberPaintElementsStore } from '@/stores/number-paint-elements'

const numberPaintElementSchema = z.object({
  label: z.string().min(1, 'Le libellé est requis'),
  description: z.string().min(1, 'La description est requise'),
  value: z.number().min(0, 'La valeur doit être positive'),
})

type NumberPaintElementFormData = z.infer<typeof numberPaintElementSchema>

interface NumberPaintElementMutateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  numberPaintElement?: NumberPaintElement | null
  mode: 'create' | 'edit'
}

export function NumberPaintElementMutateDialog({
  open,
  onOpenChange,
  numberPaintElement,
  mode,
}: NumberPaintElementMutateDialogProps) {
  const { createNumberPaintElement, updateNumberPaintElement, loading } = useNumberPaintElementsStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<NumberPaintElementFormData>({
    resolver: zodResolver(numberPaintElementSchema),
    defaultValues: {
      label: '',
      description: '',
      value: 0,
    },
  })

  useEffect(() => {
    if (numberPaintElement && mode === 'edit') {
      form.reset({
        label: numberPaintElement.label,
        description: numberPaintElement.description,
        value: numberPaintElement.value,
      })
    } else {
      form.reset({
        label: '',
        description: '',
        value: 0,
      })
    }
  }, [numberPaintElement, mode, form])

  const onSubmit = async (data: NumberPaintElementFormData) => {
    setIsSubmitting(true)
    
    try {
      let success = false
      
      if (mode === 'create') {
        const createData: NumberPaintElementCreate = {
          label: data.label,
          description: data.description,
          value: data.value,
        }
        success = await createNumberPaintElement(createData)
      } else if (numberPaintElement) {
        const updateData: NumberPaintElementUpdate = {
          label: data.label,
          description: data.description,
          value: data.value,
        }
        success = await updateNumberPaintElement(numberPaintElement.id, updateData)
      }

      if (success) {
        onOpenChange(false)
        form.reset()
      }
    } catch (error) {
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
            {mode === 'create' ? 'Créer un élément' : 'Modifier l\'élément'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Remplissez les informations pour créer un nouvel élément de peinture.'
              : 'Modifiez les informations de l\'élément de peinture.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valeur</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Entrez la valeur"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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