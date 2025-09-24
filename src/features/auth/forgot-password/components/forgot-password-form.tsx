import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
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
import { authService } from '@/services/authService'
import { toast } from 'sonner'

type ForgotFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Veuillez entrer votre email' })
    .email({ message: 'Adresse email invalide' }),
})

export function ForgotPasswordForm({ className, ...props }: ForgotFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    
    try {
      const response = await authService.resetPassword({ email: data.email })
      return;
      
      // Afficher le message de succès de l'API ou un message par défaut
      toast.success(response.message || 'Email de réinitialisation envoyé avec succès')
      setIsSuccess(true)
      
      // Réinitialiser le formulaire
      form.reset()
      
    } catch (error: unknown) {
      // L'erreur est déjà gérée par l'intercepteur axios
      // eslint-disable-next-line no-console
      console.error('Erreur lors de la réinitialisation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Adresse email</FormLabel>
              <FormControl>
                <Input placeholder='john.doe@gmail.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading || isSuccess} type="submit">
          {isLoading ? 'Envoi en cours...' : isSuccess ? 'Email envoyé' : 'Continuer'}
        </Button>
      </form>
    </Form>
  )
}
