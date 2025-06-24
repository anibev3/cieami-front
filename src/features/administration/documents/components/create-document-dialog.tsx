import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { useDocuments } from '../context/documents-context'
import { CreateDocumentTransmittedData } from '@/types/administration'

const createDocumentSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  label: z.string().min(1, 'Le libellé est requis'),
  description: z.string().min(1, 'La description est requise'),
})

export function CreateDocumentDialog() {
  const { isCreateDialogOpen, closeCreateDialog, createDocument, loading } = useDocuments()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateDocumentTransmittedData>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: {
      code: '',
      label: '',
      description: '',
    },
  })

  const onSubmit = async (data: CreateDocumentTransmittedData) => {
    try {
      setIsSubmitting(true)
      await createDocument(data)
      form.reset()
    } catch (_error) {
      // L'erreur est déjà gérée dans le contexte
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset()
      closeCreateDialog()
    }
  }

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau document</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau type de document transmis au système.
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
                    <Input placeholder="ex: carte_grise" {...field} />
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
                    <Input placeholder="ex: Carte grise" {...field} />
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
                      placeholder="Description du document..."
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
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 