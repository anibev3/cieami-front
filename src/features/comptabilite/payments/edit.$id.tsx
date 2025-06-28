import { useState, useEffect } from 'react'
import { usePaymentStore } from '@/stores/paymentStore'
import { UpdatePaymentData } from '@/types/comptabilite'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Save, Loader2, FileText, CreditCard, Calendar, Building2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AssignmentSelect } from './components/assignment-select'
import { DatePicker } from './components/date-picker'
import { PaymentTypeSelect } from './components/payment-type-select'
import { PaymentMethodSelect } from './components/payment-method-select'

export default function EditPaymentPage() {
  const navigate = useNavigate()
  const id = window.location.pathname.split('/').pop()
  const { 
    payments, 
    fetchPayments, 
    updatePayment, 
    loading 
  } = usePaymentStore()
  
  const [formData, setFormData] = useState<UpdatePaymentData>({
    assignment_id: '',
    payment_type_id: '',
    payment_method_id: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0
  })

  const payment = payments.find(p => p.id === parseInt(id || '0'))

  useEffect(() => {
    if (payments.length === 0) {
      fetchPayments()
    }
  }, [fetchPayments, payments.length])

  useEffect(() => {
    if (payment) {
      setFormData({
        assignment_id: payment.assignment.id.toString(),
        payment_type_id: payment.payment_type.id.toString(),
        payment_method_id: payment.payment_method.id.toString(),
        date: payment.date.split('T')[0],
        amount: parseFloat(payment.amount)
      })
    }
  }, [payment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    try {
      await updatePayment(parseInt(id), formData)
      toast.success('Paiement mis à jour avec succès')
      navigate({ to: '/comptabilite/payments' })
    } catch (_error) {
      // Error handled by store
    }
  }

  if (!payment && payments.length > 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du paiement...</p>
        </div>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">Paiement non trouvé</p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/comptabilite/payments' })}
            className="mt-4"
          >
            Retour aux paiements
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full h-full overflow-y-auto pb-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 rounded-lg border border-orange-200 dark:border-orange-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/comptabilite/payments' })}
              className="hover:bg-orange-100 dark:hover:bg-orange-900/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Modifier le Paiement
                  </h1>
            </Button>
            <Separator orientation="vertical" className="h-6" />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>Comptabilité</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <button 
            onClick={() => navigate({ to: '/comptabilite' })}
            className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            Comptabilité
          </button>
          <span>/</span>
          <button 
            onClick={() => navigate({ to: '/comptabilite/payments' })}
            className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            Paiements
          </button>
          <span>/</span>
          <span className="text-orange-600 dark:text-orange-400 font-medium">Modifier</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informations principales
              </CardTitle>
              <CardDescription>
                Informations de base du paiement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assignment_id">Dossier *</Label>
                <AssignmentSelect
                  value={formData.assignment_id || ''}
                  onValueChange={(value) => setFormData({ ...formData, assignment_id: value })}
                  placeholder="Sélectionnez un dossier édité"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-2">
                  Montant (F CFA) *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  placeholder="0.00"
                  required
                  className="text-lg font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date de paiement *</Label>
                <DatePicker
                  value={formData.date || ''}
                  onValueChange={(value) => setFormData({ ...formData, date: value })}
                  placeholder="Sélectionnez la date de paiement"
                />
              </div>
            </CardContent>
          </Card>

          {/* Type et méthode de paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Type et méthode
              </CardTitle>
              <CardDescription>
                Définissez le type et la méthode de paiement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment_type_id">Type de paiement *</Label>
                <PaymentTypeSelect
                  value={formData.payment_type_id || ''}
                  onValueChange={(value) => setFormData({ ...formData, payment_type_id: value })}
                  placeholder="Sélectionnez un type de paiement"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method_id">Méthode de paiement *</Label>
                <PaymentMethodSelect
                  value={formData.payment_method_id || ''}
                  onValueChange={(value) => setFormData({ ...formData, payment_method_id: value })}
                  placeholder="Sélectionnez une méthode de paiement"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/comptabilite/payments' })}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </div>
      </form>
    </div>
  )
} 