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
import { Bodywork, BodyworkCreate, BodyworkUpdate } from '@/types/bodyworks'
import { useBodyworksStore } from '@/stores/bodyworks'

const bodyworkSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  label: z.string().min(1, 'Le libellé est requis'),
  description: z.string().min(1, 'La description est requise'),
})

type BodyworkFormData = z.infer<typeof bodyworkSchema>

interface BodyworkMutateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bodywork?: Bodywork | null
  mode: 'create' | 'edit'
}

export function BodyworkMutateDialog({
  open,
  onOpenChange,
  bodywork,
  mode,
}: BodyworkMutateDialogProps) {
  const { createBodywork, updateBodywork, loading } = useBodyworksStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BodyworkFormData>({
    resolver: zodResolver(bodyworkSchema),
    defaultValues: {
      code: '',
      label: '',
      description: '',
    },
  })

  useEffect(() => {
    if (bodywork && mode === 'edit') {
      form.reset({
        code: bodywork.code,
        label: bodywork.label,
        description: bodywork.description,
      })
    } else {
      form.reset({
        code: '',
        label: '',
        description: '',
      })
    }
  }, [bodywork, mode, form])

  const onSubmit = async (data: BodyworkFormData) => {
    setIsSubmitting(true)
    
    try {
      let success = false
      
      if (mode === 'create') {
        const createData: BodyworkCreate = {
          code: data.code,
          label: data.label,
          description: data.description,
        }
        success = await createBodywork(createData)
      } else if (bodywork) {
        const updateData: BodyworkUpdate = {
          code: data.code,
          label: data.label,
          description: data.description,
        }
        success = await updateBodywork(bodywork.id, updateData)
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
            {mode === 'create' ? 'Créer une carrosserie' : 'Modifier la carrosserie'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Remplissez les informations pour créer une nouvelle carrosserie.'
              : 'Modifiez les informations de la carrosserie.'}
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