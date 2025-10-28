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
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PaintingPrice, PaintingPriceCreate, PaintingPriceUpdate } from '@/types/painting-prices'
import { usePaintingPricesStore } from '@/stores/painting-prices'
import { hourlyRatesService } from '@/services/hourly-rates'
import { paintTypesService } from '@/services/paint-types'
import { numberPaintElementsService } from '@/services/number-paint-elements'
import { HourlyRate } from '@/types/hourly-rates'
import { PaintType } from '@/types/paint-types'
import { NumberPaintElement } from '@/types/number-paint-elements'

const paintingPriceSchema = z.object({
  hourly_rate_id: z.string().min(1, 'Le taux horaire est requis'),
  paint_type_id: z.string().min(1, 'Le type de peinture est requis'),
  number_paint_element_id: z.string().min(1, 'L\'élément de peinture est requis'),
  param_1: z.string().min(1, 'Le paramètre 1 est requis').regex(/^\d+(?:[.,]\d+)?$/, 'Le paramètre 1 doit être un nombre'),
  param_2: z.string().min(1, 'Le paramètre 2 est requis').regex(/^\d+(?:[.,]\d+)?$/, 'Le paramètre 2 doit être un nombre'),
})

type PaintingPriceFormData = z.infer<typeof paintingPriceSchema>

interface PaintingPriceMutateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paintingPrice?: PaintingPrice | null
  mode: 'create' | 'edit'
}

export function PaintingPriceMutateDialog({
  open,
  onOpenChange,
  paintingPrice,
  mode,
}: PaintingPriceMutateDialogProps) {
  const { createPaintingPrice, updatePaintingPrice, loading } = usePaintingPricesStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hourlyRates, setHourlyRates] = useState<HourlyRate[]>([])
  const [paintTypes, setPaintTypes] = useState<PaintType[]>([])
  const [numberPaintElements, setNumberPaintElements] = useState<NumberPaintElement[]>([])
  const [loadingData, setLoadingData] = useState(false)

  const form = useForm<PaintingPriceFormData>({
    resolver: zodResolver(paintingPriceSchema),
    defaultValues: {
      hourly_rate_id: '',
      paint_type_id: '',
      number_paint_element_id: '',
      param_1: '',
      param_2: '',
    },
  })

  // Charger les données pour les sélecteurs
  useEffect(() => {
    if (open) {
      loadSelectData()
    }
  }, [open])

  const loadSelectData = async () => {
    setLoadingData(true)
    try {
      const [hourlyRatesRes, paintTypesRes, numberPaintElementsRes] = await Promise.all([
        hourlyRatesService.getAll(),
        paintTypesService.getAll(),
        numberPaintElementsService.getAll(),
      ])
      
      setHourlyRates(hourlyRatesRes.data)
      setPaintTypes(paintTypesRes.data)
      setNumberPaintElements(numberPaintElementsRes.data)
    } catch (_error) {
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (paintingPrice && mode === 'edit') {
      form.reset({
        hourly_rate_id: paintingPrice.hourly_rate.id.toString(),
        paint_type_id: paintingPrice.paint_type.id.toString(),
        number_paint_element_id: paintingPrice.number_paint_element.id.toString(),
        param_1: '',
        param_2: '',
      })
    } else {
      form.reset({
        hourly_rate_id: '',
        paint_type_id: '',
        number_paint_element_id: '',
        param_1: '',
        param_2: '',
      })
    }
  }, [paintingPrice, mode, form])

  const onSubmit = async (data: PaintingPriceFormData) => {
    setIsSubmitting(true)
    
    try {
      let success = false
      
      if (mode === 'create') {
        const createData: PaintingPriceCreate = {
          hourly_rate_id: data.hourly_rate_id,
          paint_type_id: data.paint_type_id,
          number_paint_element_id: data.number_paint_element_id,
          param_1: parseFloat(String(data.param_1).replace(',', '.')),
          param_2: parseFloat(String(data.param_2).replace(',', '.')),
        }
        success = await createPaintingPrice(createData)
      } else if (paintingPrice) {
        const updateData: PaintingPriceUpdate = {
          hourly_rate_id: data.hourly_rate_id,
          paint_type_id: data.paint_type_id,
          number_paint_element_id: data.number_paint_element_id,
          param_1: parseFloat(String(data.param_1).replace(',', '.')),
          param_2: parseFloat(String(data.param_2).replace(',', '.')),
        }
        success = await updatePaintingPrice(paintingPrice.id, updateData)
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
      <DialogContent className="w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Créer un prix' : 'Modifier le prix'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Remplissez les informations pour créer un nouveau prix de peinture.'
              : 'Modifiez les informations du prix de peinture.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="param_1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paramètre 1</FormLabel>
                    <FormControl>
                      <Input type="number" inputMode="decimal" placeholder="Ex: 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="param_2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paramètre 2</FormLabel>
                    <FormControl>
                      <Input type="number" inputMode="decimal" placeholder="Ex: 20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hourly_rate_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taux horaire</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez un taux horaire" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hourlyRates.map((rate) => (
                        <SelectItem key={rate.id} value={rate.id.toString()}>
                          {rate.label} ({rate.value})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez un type de peinture" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paintTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.label}
                        </SelectItem>
                      ))}
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
                  <FormLabel>Élément de peinture</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez un élément de peinture" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {numberPaintElements.map((element) => (
                        <SelectItem key={element.id} value={element.id.toString()}>
                          {element.label} (Valeur: {element.value})
                        </SelectItem>
                      ))}
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
                disabled={isSubmitting || loadingData}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting || loading || loadingData}>
                {isSubmitting ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Modifier'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 