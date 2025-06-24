import { useState, useEffect } from 'react'
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
import { UpdateDocumentTransmittedData } from '@/types/administration'

const updateDocumentSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
})

export function EditDocumentDialog() {
  const { 
    isEditDialogOpen, 
    closeEditDialog, 
    updateDocument, 
    selectedDocument, 
    loading 
  } = useDocuments()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UpdateDocumentTransmittedData>({
    resolver: zodResolver(updateDocumentSchema),
    defaultValues: {
      label: '',
      description: '',
    },
  })

  useEffect(() => {
    if (selectedDocument) {
      form.reset({
        label: selectedDocument.label,
        description: selectedDocument.description,
      })
    }
  }, [selectedDocument, form])

  const onSubmit = async (data: UpdateDocumentTransmittedData) => {
    if (!selectedDocument) return
    
    try {
      setIsSubmitting(true)
      await updateDocument(selectedDocument.id, data)
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
      closeEditDialog()
    }
  }

  if (!selectedDocument) return null

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le document</DialogTitle>
          <DialogDescription>
            Modifiez les informations du document "{selectedDocument.label}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Code</label>
              <Input value={selectedDocument.code} disabled />
            </div>
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
                {isSubmitting ? 'Modification...' : 'Modifier'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 