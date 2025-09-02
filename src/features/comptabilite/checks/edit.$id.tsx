import { useState, useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useCheckStore } from '@/stores/checkStore'
import { UpdateCheckData } from '@/types/comptabilite'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, CreditCard, Building2, Calendar, Euro, Loader2 } from 'lucide-react'
import { PaymentSelect } from './components/payment-select'
import { BankSelect } from './components/bank-select'
import { DatePicker } from '@/features/widgets/date-picker'
import { toast } from 'sonner'
import { RequireAnyRoleGate } from '@/components/ui/permission-gate'
import ForbiddenError from '@/features/errors/forbidden'
import { UserRole } from '@/stores/aclStore'

function EditCheckPageContent() {
  const navigate = useNavigate()
  const { id } = useParams({ from: '/_authenticated/comptabilite/check/edit/$id' })
  const { 
    checks, 
    loading, 
    fetchChecks, 
    updateCheck, 
    setSelectedCheck, 
    selectedCheck 
  } = useCheckStore()
  
  const [formData, setFormData] = useState<UpdateCheckData>({
    payment_id: '',
    bank_id: '',
    date: '',
    amount: 0
  })

  useEffect(() => {
    if (checks.length === 0) {
      fetchChecks()
    }
  }, [fetchChecks, checks.length])

  useEffect(() => {
    const check = checks.find(c => c.id.toString() === id)
    if (check) {
      setSelectedCheck(check)
      setFormData({
        payment_id: check.payment_id,
        bank_id: check.bank_id,
        date: check.date.split('T')[0],
        amount: parseFloat(check.amount)
      })
    }
  }, [checks, id, setSelectedCheck])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.payment_id || !formData.bank_id || !formData.date || (formData.amount ?? 0) <= 0) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      await updateCheck(parseInt(id), formData)
      toast.success('Chèque modifié avec succès')
      navigate({ to: '/comptabilite/checks' })
    } catch (_error) {
      toast.error('Erreur lors de la modification du chèque')
    }
  }

  if (!selectedCheck) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/comptabilite/checks' })}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Modifier le chèque #{selectedCheck.id}</h1>
                <p className="text-blue-100">Modifiez les informations du chèque</p>
              </div>
            </div>
          </div>
          
          {/* Breadcrumbs */}
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-100">
            <span>Comptabilité</span>
            <span>/</span>
            <span>Chèques</span>
            <span>/</span>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Modification
            </Badge>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Informations du chèque
          </CardTitle>
          <CardDescription>
            Modifiez les informations du chèque #{selectedCheck.id}
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
                value={formData.payment_id || ''}
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
                value={formData.bank_id || ''}
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
                  value={formData.amount || 0}
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
                  value={formData.date || ''}
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
                    Modification...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Modifier le chèque
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

export default function EditCheckPage() {
  return (
    <RequireAnyRoleGate
      roles={[UserRole.SYSTEM_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT_MANAGER]}
      fallback={<ForbiddenError />}
    >
      <EditCheckPageContent />
    </RequireAnyRoleGate>
  )
}