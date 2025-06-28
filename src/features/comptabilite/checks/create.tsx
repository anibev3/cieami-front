import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCheckStore } from '@/stores/checkStore'
import { CreateCheckData } from '@/types/comptabilite'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, CreditCard, Building2, Calendar, Euro } from 'lucide-react'
import { PaymentSelect } from './components/payment-select'
import { BankSelect } from './components/bank-select'
import { DatePicker } from '../payments/components/date-picker'
import { toast } from 'sonner'

export default function CreateCheckPage() {
  const navigate = useNavigate()
  const { createCheck, loading } = useCheckStore()
  const [formData, setFormData] = useState<CreateCheckData>({
    payment_id: '',
    bank_id: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.payment_id || !formData.bank_id || !formData.date || formData.amount <= 0) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      await createCheck(formData)
      toast.success('Chèque créé avec succès')
      navigate({ to: '/comptabilite/checks' })
    } catch (_error) {
      toast.error('Erreur lors de la création du chèque')
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-300 to-blue-500 p-6 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 w-full justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/comptabilite/checks' })}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              
            </Button>
            <h1 className="text-2xl font-bold">Nouveau chèque</h1>
          </div>
          
          {/* Breadcrumbs */}
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-100">
            <span>Comptabilité</span>
            <span>/</span>
            <span>Chèques</span>
            <span>/</span>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Création
            </Badge>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className=" mx-auto shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Informations du chèque
          </CardTitle>
          <CardDescription>
            Remplissez les informations nécessaires pour créer un nouveau chèque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Selection */}
            <div className="space-y-2">
              <Label htmlFor="payment_id" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Paiement associé *
              </Label>
              <PaymentSelect
                value={formData.payment_id}
                onValueChange={(value) => setFormData({ ...formData, payment_id: value })}
                placeholder="Sélectionnez le paiement associé..."
              />
            </div>

            {/* Bank Selection */}
            <div className="space-y-2">
              <Label htmlFor="bank_id" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Banque *
              </Label>
              <BankSelect
                value={formData.bank_id}
                onValueChange={(value) => setFormData({ ...formData, bank_id: value })}
                placeholder="Sélectionnez la banque..."
              />
            </div>

            {/* Amount and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Montant (XOF) *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  placeholder="0.00"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date *
                </Label>
                <DatePicker
                  value={formData.date}
                  onValueChange={(date: string) => 
                    setFormData({ 
                      ...formData, 
                      date: date
                    })
                  }
                  placeholder="Sélectionnez une date..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/comptabilite/checks' })}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer le chèque
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 