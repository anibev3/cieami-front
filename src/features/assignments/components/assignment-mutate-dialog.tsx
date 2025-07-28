/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AssignmentCreate, AssignmentUpdate } from '@/types/assignments'
import { useAssignmentsStore } from '@/stores/assignments'
import { useUsersStore } from '@/stores/usersStore'
import { useVehiclesStore } from '@/stores/vehicles'
import { useAssignmentTypesStore } from '@/stores/assignmentTypesStore'
import { UserSelect } from '@/features/widgets/user-select'

const assignmentSchema = z.object({
  reference: z.string().min(1, 'La référence est requise'),
  client_id: z.number().min(1, 'Le client est requis'),
  vehicle_id: z.number().min(1, 'Le véhicule est requis'),
  assignment_type_id: z.number().min(1, 'Le type d\'assignation est requis'),
  expert_id: z.number().min(1, 'L\'expert est requis'),
  amount: z.number().min(0, 'Le montant doit être positif'),
  description: z.string().optional(),
})

interface AssignmentMutateDialogProps {
  id: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignmentMutateDialog({ id, open, onOpenChange }: AssignmentMutateDialogProps) {
  const [loading, setLoading] = useState(false)
  const { createAssignment, updateAssignment, fetchAssignment, currentAssignment } = useAssignmentsStore()
  const { fetchUsers } = useUsersStore()
  const { vehicles, fetchVehicles } = useVehiclesStore()
  const { assignmentTypes, fetchAssignmentTypes } = useAssignmentTypesStore()

  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      reference: '',
      client_id: 0,
      vehicle_id: 0,
      assignment_type_id: 0,
      expert_id: 0,
      amount: 0,
      description: '',
    },
  })

  const isEditing = !!id

  // Charger les données nécessaires
  useEffect(() => {
    if (open) {
      fetchUsers()
      fetchVehicles()
      fetchAssignmentTypes()
      
      if (isEditing && id) {
        fetchAssignment(id)
      }
    }
  }, [open, isEditing, id, fetchUsers, fetchVehicles, fetchAssignmentTypes, fetchAssignment])

  // Mettre à jour le formulaire quand l'assignation est chargée
  useEffect(() => {
    if (currentAssignment && isEditing) {
      form.reset({
        reference: currentAssignment.reference,
        client_id: currentAssignment.client.id,
        vehicle_id: currentAssignment.vehicle.id,
        assignment_type_id: currentAssignment.assignment_type.id,
        expert_id: currentAssignment.created_by.id, // Utiliser created_by comme expert par défaut
        amount: 0, // Montant par défaut car pas de propriété amount dans Assignment
        description: '', // Description par défaut car pas de propriété description dans Assignment
      })
    }
  }, [currentAssignment, isEditing, form])

  const onSubmit = async (values: z.infer<typeof assignmentSchema>) => {
    setLoading(true)
    
    try {
      if (isEditing && id) {
        await updateAssignment(id, values as AssignmentUpdate)
      } else {
        await createAssignment(values as AssignmentCreate)
      }
      
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier l\'assignation' : 'Créer une assignation'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les informations de l\'assignation ci-dessous.'
              : 'Remplissez les informations pour créer une nouvelle assignation.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence</FormLabel>
                    <FormControl>
                      <Input placeholder="REF-2024-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <UserSelect
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value || 0)}
                      placeholder="Sélectionner un client"
                      filterRole="client"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicle_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Véhicule</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un véhicule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                          {vehicle.license_plate} - {vehicle.brand.label} {vehicle.vehicle_model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assignment_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'assignation</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assignmentTypes.map((type) => (
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
                name="expert_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expert</FormLabel>
                    <FormControl>
                      <UserSelect
                        value={field.value || null}
                        onValueChange={(value) => field.onChange(value || 0)}
                        placeholder="Sélectionner un expert"
                        filterRole="expert"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de l'assignation..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 