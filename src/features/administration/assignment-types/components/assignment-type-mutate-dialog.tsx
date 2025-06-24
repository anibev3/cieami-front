import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AssignmentTypeCreate, AssignmentTypeUpdate } from '@/types/assignment-types'
import { useAssignmentTypesStore } from '@/stores/assignmentTypes'

const assignmentTypeSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  label: z.string().min(1, 'Le libellé est requis'),
  description: z.string().min(1, 'La description est requise'),
})

type AssignmentTypeFormData = z.infer<typeof assignmentTypeSchema>

interface AssignmentTypeMutateDialogProps {
  id: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignmentTypeMutateDialog({ id, open, onOpenChange }: AssignmentTypeMutateDialogProps) {
  const [loading, setLoading] = useState(false)
  const { createAssignmentType, updateAssignmentType, currentAssignmentType, fetchAssignmentType } = useAssignmentTypesStore()

  const form = useForm<AssignmentTypeFormData>({
    resolver: zodResolver(assignmentTypeSchema),
    defaultValues: {
      code: '',
      label: '',
      description: '',
    },
  })

  const isEditing = !!id

  // Charger les données pour l'édition
  useEffect(() => {
    if (id && open) {
      fetchAssignmentType(id)
    }
  }, [id, open, fetchAssignmentType])

  // Mettre à jour le formulaire avec les données du type d'affectation
  useEffect(() => {
    if (currentAssignmentType && isEditing) {
      form.reset({
        code: currentAssignmentType.code,
        label: currentAssignmentType.label,
        description: currentAssignmentType.description,
      })
    }
  }, [currentAssignmentType, isEditing, form])

  const onSubmit = async (data: AssignmentTypeFormData) => {
    setLoading(true)
    
    try {
      if (isEditing && id) {
        const updateData: AssignmentTypeUpdate = {
          ...data,
        }
        await updateAssignmentType(id, updateData)
        toast.success('Type d\'affectation mis à jour avec succès')
      } else {
        const createData: AssignmentTypeCreate = {
          ...data,
        }
        await createAssignmentType(createData)
        toast.success('Type d\'affectation créé avec succès')
      }
      
      onOpenChange(false)
      form.reset()
    } catch (error) {
      // Error handled by store
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le type d\'affectation' : 'Créer un type d\'affectation'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les informations du type d\'affectation ci-dessous.'
              : 'Remplissez les informations pour créer un nouveau type d\'affectation.'
            }
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
                    <Input {...field} placeholder="Ex: 001" />
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
                    <Input {...field} placeholder="Ex: Expertise judiciaire" />
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
                    <Textarea {...field} placeholder="Description détaillée du type d'affectation" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 