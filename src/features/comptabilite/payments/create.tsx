import { useState } from 'react'
import { usePaymentStore } from '@/stores/paymentStore'
import { CreatePaymentData } from '@/types/comptabilite'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Save, FileText, CreditCard, Calendar, Building2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AssignmentSelect } from './components/assignment-select'
import { DatePicker } from './components/date-picker'
import { PaymentTypeSelect } from './components/payment-type-select'
import { PaymentMethodSelect } from './components/payment-method-select'

export default function CreatePaymentPage() {
  const navigate = useNavigate()
  const { createPayment, loading } = usePaymentStore()
  
  const [formData, setFormData] = useState<CreatePaymentData>({
    assignment_id: '',
    payment_type_id: '',
    payment_method_id: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await createPayment(formData)
      
      // Afficher un toast de succès avec les détails du paiement créé
      toast.success(
        <div className="space-y-2">
          <div className="font-semibold">Paiement créé avec succès !</div>
          <div className="text-sm space-y-1">
            <div><span className="font-medium">Référence :</span> {result.reference}</div>
            <div><span className="font-medium">Montant :</span> {Number(result.amount).toLocaleString('fr-FR')} F CFA</div>
            <div><span className="font-medium">Date :</span> {new Date(result.date).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>,
        {
          duration: 5000,
          action: {
            label: 'Voir la liste',
            onClick: () => navigate({ to: '/comptabilite/payments' })
          }
        }
      )
      
      // Rediriger vers la liste des paiements
      navigate({ to: '/comptabilite/payments' })
    } catch (_error) {
      // Error handled by store
    }
  }

  return (
    <div className="space-y-6 w-full h-full overflow-y-auto pb-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/comptabilite/payments' })}
              className="hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <h1 className="text-2xl font-bold">Nouveau chèque</h1>
            </Button>
            {/* <Separator orientation="vertical" className="h-6" /> */}
            
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
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Comptabilité
          </button>
          <span>/</span>
          <button 
            onClick={() => navigate({ to: '/comptabilite/payments' })}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Paiements
          </button>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">Nouveau</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Informations principales */}
          <Card className="shadow-none">
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
                  value={formData.assignment_id}
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
                  value={formData.date}
                  onValueChange={(value) => setFormData({ ...formData, date: value })}
                  placeholder="Sélectionnez la date de paiement"
                />
              </div>
            </CardContent>
          </Card>

          {/* Type et méthode de paiement */}
          <Card className="shadow-none">
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
                  value={formData.payment_type_id}
                  onValueChange={(value) => setFormData({ ...formData, payment_type_id: value })}
                  placeholder="Sélectionnez un type de paiement"
                />
              </div>

              
              {formData.payment_type_id != '1' && (
              <div className="space-y-2">
                <Label htmlFor="payment_method_id">Méthode de paiement *</Label>
                <PaymentMethodSelect
                  value={formData.payment_method_id}
                  onValueChange={(value) => setFormData({ ...formData, payment_method_id: value })}
                  placeholder="Sélectionnez une méthode de paiement"
                />
                </div>
              )}
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
            {loading ? 'Création...' : 'Créer le paiement'}
          </Button>
        </div>
      </form>
    </div>
  )
} 