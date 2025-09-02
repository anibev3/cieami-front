import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCheckStore } from '@/stores/checkStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Search, Plus, Edit, Trash2, CheckSquare, Eye, EyeOff, Activity, Image } from 'lucide-react'
import { RequireAnyRoleGate } from '@/components/ui/permission-gate'
import ForbiddenError from '@/features/errors/forbidden'
import { UserRole } from '@/stores/aclStore'

function ChecksPageContent() {
  const navigate = useNavigate()
  const {
    checks,
    fetchChecks,
    deleteCheck
  } = useCheckStore()

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchChecks()
  }, [fetchChecks])

  const filteredChecks = checks.filter(check =>
    check?.reference?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    check?.bank?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    check?.payment?.reference?.toLowerCase().includes(searchTerm?.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    try {
      await deleteCheck(id)
    } catch (_error) {
      // Error handled by store
    }
  }

  const stats = {
    total: checks.length,
    totalAmount: checks.reduce((sum, check) => sum + parseFloat(check.amount), 0),
    active: checks.filter(c => c.status.code === 'active').length,
    pending: checks.filter(c => c.status.code === 'pending').length
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      
      <div className="flex items-center justify-between mb-4">
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Chèques</h3>
          {/* <p className='text-muted-foreground text-sm'>Gérez tous les chèques et leurs informations</p> */}
        </div>

        <Button onClick={() => navigate({ to: '/comptabilite/check/create' })}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau chèque
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Chèques</p>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</div>
            <p className="text-xs text-muted-foreground">Valeur totale</p>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Chèques encaissés</p>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">En cours d'encaissement</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un chèque..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Checks Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredChecks.map((check) => (
          <Card key={check.id} className="hover:shadow-lg transition-shadow shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{check.reference.slice(0, 10)}...</CardTitle>
                <div className="flex items-center space-x-2">
                  {check.status.code === 'active' ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Eye className="mr-1 h-3 w-3" />
                      Encassé
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
                {check.payment ? `Paiement: ${check.payment.reference}` : 'Aucun paiement'} | {check.bank ? `Banque: ${check.bank.name}` : 'Aucune banque'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Montant:</span> {parseFloat(check.amount).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {new Date(check.date).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Statut:</span> {check.status.label}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Photo:</span> 
                    {check.photo ? (
                      <Badge variant="outline" className="text-xs">
                        <Image className="mr-1 h-3 w-3" />
                        Disponible
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Aucune
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    Créé le {new Date(check.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate({ to: `/comptabilite/checks/edit/${check.id}` })}
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
                            Cette action ne peut pas être annulée. Cela supprimera définitivement le chèque {check.reference}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(check.id)}
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

export default function ChecksPage() {
  return (
    <RequireAnyRoleGate
      roles={[UserRole.SYSTEM_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT_MANAGER]}
      fallback={<ForbiddenError />}
    > 
    
      <ChecksPageContent />
    </RequireAnyRoleGate>

  )
}