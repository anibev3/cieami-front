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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PaintProductPrice, PaintProductPriceCreate, PaintProductPriceUpdate } from '@/types/paint-product-prices'
import { usePaintProductPricesStore } from '@/stores/paint-product-prices'

const paintProductPriceSchema = z.object({
  value: z.number().min(0, 'La valeur doit être positive'),
  paint_type_id: z.string().min(1, 'Le type de peinture est requis'),
  number_paint_element_id: z.string().min(1, 'Le nombre d\'éléments est requis'),
})

type PaintProductPriceFormData = z.infer<typeof paintProductPriceSchema>

interface PaintProductPriceMutateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paintProductPrice?: PaintProductPrice | null
  mode: 'create' | 'edit'
}

export function PaintProductPriceMutateDialog({
  open,
  onOpenChange,
  paintProductPrice,
  mode,
}: PaintProductPriceMutateDialogProps) {
  const { createPaintProductPrice, updatePaintProductPrice, loading } = usePaintProductPricesStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PaintProductPriceFormData>({
    resolver: zodResolver(paintProductPriceSchema),
    defaultValues: {
      value: 0,
      paint_type_id: '',
      number_paint_element_id: '',
    },
  })

  useEffect(() => {
    if (paintProductPrice && mode === 'edit') {
      form.reset({
        value: 0, // Pas de valeur dans l'API, on met 0 par défaut
        paint_type_id: paintProductPrice.paint_type.id.toString(),
        number_paint_element_id: paintProductPrice.number_paint_element.id.toString(),
      })
    } else {
      form.reset({
        value: 0,
        paint_type_id: '',
        number_paint_element_id: '',
      })
    }
  }, [paintProductPrice, mode, form])

  const onSubmit = async (data: PaintProductPriceFormData) => {
    setIsSubmitting(true)
    
    try {
      let success = false
      
      if (mode === 'create') {
        const createData: PaintProductPriceCreate = {
          value: data.value,
          paint_type_id: data.paint_type_id,
          number_paint_element_id: data.number_paint_element_id,
        }
        success = await createPaintProductPrice(createData)
      } else if (paintProductPrice) {
        const updateData: PaintProductPriceUpdate = {
          value: data.value,
          paint_type_id: data.paint_type_id,
          number_paint_element_id: data.number_paint_element_id,
        }
        success = await updatePaintProductPrice(paintProductPrice.id, updateData)
      }

      if (success) {
        onOpenChange(false)
        form.reset()
      }
    } catch (error) {
      console.error('Error submitting form:', error)
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
            {mode === 'create' ? 'Créer un tarif' : 'Modifier le tarif'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Remplissez les informations pour créer un nouveau tarif produit peinture.'
              : 'Modifiez les informations du tarif produit peinture.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="paint_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de peinture</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type de peinture" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Ordinaire</SelectItem>
                      <SelectItem value="2">Acrylique (BD)</SelectItem>
                      <SelectItem value="3">Vernissée</SelectItem>
                      <SelectItem value="4">Nacrée</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number_paint_element_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre d'éléments</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le nombre d'éléments" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Peinture complète</SelectItem>
                      <SelectItem value="2">1</SelectItem>
                      <SelectItem value="3">2</SelectItem>
                      <SelectItem value="4">3</SelectItem>
                    </SelectContent>
                  </Select>
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