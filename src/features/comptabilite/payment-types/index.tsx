import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CreditCard, 
  Wallet,
  TrendingUp,
  Activity,
  Calendar,
  Filter,
  Eye,
  Copy,
  Download
} from 'lucide-react'
import { usePaymentTypeStore } from '@/stores/paymentTypeStore'
import { PaymentType, CreatePaymentTypeData } from '@/types/comptabilite'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function PaymentTypesPage() {
  const { 
    paymentTypes, 
    loading, 
    fetchPaymentTypes, 
    createPaymentType, 
    updatePaymentType, 
    deletePaymentType 
  } = usePaymentTypeStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType | null>(null)
  const [formData, setFormData] = useState<CreatePaymentTypeData>({
    code: '',
    label: '',
    description: ''
  })

  useEffect(() => {
    fetchPaymentTypes()
  }, [fetchPaymentTypes])

  const filteredPaymentTypes = paymentTypes.filter(paymentType =>
    paymentType.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paymentType.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paymentType.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = async () => {
    try {
      await createPaymentType(formData)
      setIsCreateDialogOpen(false)
      setFormData({ code: '', label: '', description: '' })
    } catch (_error) {
      // Error is handled in the store
    }
  }

  const handleEdit = async () => {
    if (!selectedPaymentType) return
    
    try {
      await updatePaymentType(selectedPaymentType.id, formData)
      setIsEditDialogOpen(false)
      setSelectedPaymentType(null)
      setFormData({ code: '', label: '', description: '' })
    } catch (_error) {
      // Error is handled in the store
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deletePaymentType(id)
      toast.success('Type de paiement supprimé avec succès')
    } catch (_error) {
      // Error is handled in the store
    }
  }

  const openEditDialog = (paymentType: PaymentType) => {
    setSelectedPaymentType(paymentType)
    setFormData({
      code: paymentType.code,
      label: paymentType.label,
      description: paymentType.description || ''
    })
    setIsEditDialogOpen(true)
  }

  const stats = {
    total: paymentTypes.length,
    active: paymentTypes.filter(pt => pt.status.code === 'active').length,
    thisMonth: paymentTypes.filter(pt => {
      const createdAt = new Date(pt.created_at)
      const now = new Date()
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
    }).length
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Types</CardTitle>
            <CreditCard className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-blue-100">Types de paiement</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Activity className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-green-100">En activité</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce mois</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
            <p className="text-xs text-purple-100">Nouveaux types</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'usage</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-orange-100">Taux d'activation</p>
          </CardContent>
        </Card>
      </div>

      {/* Barre d'outils */}
      <div>
        <div>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Types de paiement</CardTitle>
              {/* <CardDescription>
                Gérez les différents types de paiement acceptés par votre système
              </CardDescription> */}
            </div>
            <div className='mb-4'>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un nouveau type de paiement</DialogTitle>
                  <DialogDescription>
                    Ajoutez un nouveau type de paiement à votre système
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="code">Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="Ex: cash, check, transfer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="label">Libellé</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="Ex: Espèces, Chèque, Virement"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description optionnelle"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreate} disabled={!formData.code || !formData.label}>
                    Créer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>

          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un type de paiement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ScrollArea className="h-[600px] w-full overflow-y-auto scroll-smooth">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 faded-bottom h-full w-full overflow-y-auto scroll-smooth">
                {filteredPaymentTypes.map((paymentType) => (
                  <Card key={paymentType.id} className="hover:shadow-lg transition-shadow shadow-none">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Wallet className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{paymentType.label.slice(0, 7)}{paymentType.label.length > 8 && '...'}</CardTitle>
                            <CardDescription className="font-mono text-xs">
                              {paymentType.code}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge 
                            variant={paymentType.status.code === 'active' ? 'default' : 'secondary'}
                            className={cn(
                              paymentType.status.code === 'active' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                            )}
                          >
                            {paymentType.status.label}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {paymentType.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {paymentType.description}
                        </p>
                      )}
                      
                      <Separator className="my-3" />
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>Créé le {new Date(paymentType.created_at).toLocaleDateString('fr-FR')}</span>
                        <span>par {paymentType.created_by.name}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openEditDialog(paymentType)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action ne peut pas être annulée. Cela supprimera définitivement le type de paiement "{paymentType.label}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(paymentType.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Dialog d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le type de paiement</DialogTitle>
            <DialogDescription>
              Modifiez les informations du type de paiement
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-code">Code</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: cash, check, transfer"
              />
            </div>
            <div>
              <Label htmlFor="edit-label">Libellé</Label>
              <Input
                id="edit-label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ex: Espèces, Chèque, Virement"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description optionnelle"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEdit} disabled={!formData.code || !formData.label}>
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 