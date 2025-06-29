import { useState, useEffect } from 'react'
import { usePaymentStore } from '@/stores/paymentStore'
import { Payment } from '@/types/comptabilite'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Search, Plus, Edit, Trash2, CreditCard, Eye, EyeOff, Activity, Euro } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

interface PaymentsPageProps {
  onButtonClick?: () => void
}

export default function PaymentsPage({ onButtonClick }: PaymentsPageProps) {
  const navigate = useNavigate()
  const {
    payments,
    fetchPayments,
    deletePayment
  } = usePaymentStore()

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const filteredPayments = payments.filter(payment =>
    payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.assignment.reference.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    try {
      await deletePayment(id)
    } catch (_error) {
      // Error handled by store
    }
  }

  const stats = {
    total: payments.length,
    totalAmount: payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0),
    active: payments.filter(p => p.status?.code === 'active').length,
    pending: payments.filter(p => p.status?.code === 'pending').length
  }

  const handleCreateClick = () => {
    navigate({ to: '/comptabilite/payment/create' })
    onButtonClick?.()
  }

  const handleEditClick = (payment: Payment) => {
    navigate({ to: `/comptabilite/payment/edit/${payment.id}` })
  }

  return (
    <div className="space-y-6 h-full w-full overflow-y-auto pb-6">
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Paiements</h3>
          <p className='text-muted-foreground text-sm'>Gérez tous les paiements et transactions financières.</p>
        </div>

        <div className='flex items-center gap-2'>
          <Button onClick={handleCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau paiement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Paiements</p>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant total</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</div>
            <p className="text-xs text-muted-foreground">Valeur totale</p>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Paiements validés</p>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">En cours de traitement</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un paiement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Payments Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="hover:shadow-lg transition-shadow shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{payment.reference.slice(0, 15)}...</CardTitle>
                <div className="flex items-center space-x-2">
                  {payment?.status?.code === 'active' ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Eye className="mr-1 h-3 w-3" />
                      Validé
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <EyeOff className="mr-1 h-3 w-3" />
                      En attente
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>
                Dossier: {payment?.assignment?.reference}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Montant:</span> {parseFloat(payment.amount).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {new Date(payment.date).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {payment.payment_type.label}
                  </div>
                  <div>
                    <span className="font-medium">Méthode:</span> {payment.payment_method.label}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    Créé le {new Date(payment.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(payment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Cela supprimera définitivement le paiement "{payment.reference}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(payment.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 