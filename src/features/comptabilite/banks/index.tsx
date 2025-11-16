import { useState, useEffect } from 'react'
import { useBankStore } from '@/stores/bankStore'
import { Bank, CreateBankData } from '@/types/comptabilite'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'
import { DataTable } from './components/data-table'
import { createColumns } from './components/columns'

  function BanksPageContent() {
  const {
    banks,
    loading,
    fetchBanks,
    createBank,
    updateBank,
    deleteBank,
    setSelectedBank,
    selectedBank
  } = useBankStore()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState<CreateBankData>({
    code: '',
    name: '',
    description: ''
  })

  useEffect(() => {
    fetchBanks()
  }, [fetchBanks])

  // Handlers pour les actions de la datatable
  const handleView = (bank: Bank) => {
    setSelectedBank(bank)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (bank: Bank) => {
    setSelectedBank(bank)
    setFormData({
      code: bank.code,
      name: bank.name,
      description: bank.description || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (bank: Bank) => {
    setSelectedBank(bank)
    setIsDeleteDialogOpen(true)
  }

  const handleCreate = async () => {
    try {
      await createBank(formData)
      setIsCreateDialogOpen(false)
      setFormData({
        code: '',
        name: '',
        description: ''
      })
    } catch (_error) {
      // Error handled by store
    }
  }

  const handleEditSubmit = async () => {
    if (!selectedBank) return
    try {
      await updateBank(selectedBank.id, formData)
      setIsEditDialogOpen(false)
      setSelectedBank(null)
      setFormData({
        code: '',
        name: '',
        description: ''
      })
    } catch (_error) {
      // Error handled by store
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedBank) return
    try {
      await deleteBank(selectedBank.id)
      setSelectedBank(null)
    } catch (_error) {
      // Error handled by store
    }
  }

  // Création des colonnes pour la datatable
  const columns = createColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete
  })

  return (
    <div className="space-y-6 w-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banques</h1>
          <p className="text-muted-foreground">
            Gérez les banques partenaires et leurs informations
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle banque
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Créer une banque</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle banque partenaire
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="BNP"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="BNP Paribas"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de la banque"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreate} disabled={loading}>
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={banks}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier la banque</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la banque
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Code</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditSubmit} disabled={loading}>
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails de la banque</DialogTitle>
            <DialogDescription>
              Informations complètes de la banque
            </DialogDescription>
          </DialogHeader>
          {selectedBank && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Code</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {selectedBank.code}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nom</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {selectedBank.name}
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded border min-h-[60px]">
                  {selectedBank.description || 'Aucune description'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Statut</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {selectedBank.status.label}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Créé le</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {new Date(selectedBank.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement la banque "{selectedBank?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false)
              setSelectedBank(null)
            }}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 

export default function BanksPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_PAYMENT}>
      <BanksPageContent />
    </ProtectedRoute>
  )
}