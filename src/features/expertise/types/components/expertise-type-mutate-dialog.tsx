/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ExpertiseTypeCreate, ExpertiseTypeUpdate } from '@/types/expertise-types'
import { useExpertiseTypesStore } from '@/stores/expertise-types'

interface ExpertiseTypeMutateDialogProps {
  id?: number | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ExpertiseTypeMutateDialog({ id, open, onOpenChange }: ExpertiseTypeMutateDialogProps) {
  const { expertiseTypes, createExpertiseType, updateExpertiseType, loading, error } = useExpertiseTypesStore()
  const isEdit = !!id
  const [form, setForm] = useState<ExpertiseTypeCreate | ExpertiseTypeUpdate>({
    code: '',
    label: '',
    description: '',
  })

  useEffect(() => {
    if (isEdit && id) {
      const expertiseType = expertiseTypes.find((et) => et.id === id)
      if (expertiseType) {
        setForm({
          code: expertiseType.code,
          label: expertiseType.label,
          description: expertiseType.description,
        })
      }
    } else {
      setForm({ code: '', label: '', description: '' })
    }
  }, [isEdit, id, expertiseTypes])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && id) {
        await updateExpertiseType(id, form)
        toast.success('Type d\'expertise modifié avec succès')
      } else {
        await createExpertiseType(form as ExpertiseTypeCreate)
        toast.success('Type d\'expertise créé avec succès')
      }
      onOpenChange?.(false)
    } catch (err) {
      // handled by store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier le type d\'expertise' : 'Ajouter un type d\'expertise'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Code"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            required
            disabled={loading}
          />
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Libellé</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            required
            disabled={loading}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {isEdit ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 