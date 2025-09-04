import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCheckStore } from '@/stores/checkStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, CheckSquare, EyeOff, Activity, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { RequireAnyRoleGate } from '@/components/ui/permission-gate'
import ForbiddenError from '@/features/errors/forbidden'
import { UserRole } from '@/stores/aclStore'
import { DataTable } from './components/data-table'
import { createColumns } from './components/columns'
import { CheckDialogs } from './components/check-dialogs'
import { Check } from '@/types/comptabilite'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function ChecksPageContent() {
  const navigate = useNavigate()
  const {
    checks,
    pagination,
    loading,
    fetchChecks,
    deleteCheck,
    setSelectedCheck,
    selectedCheck
  } = useCheckStore()

  const [searchTerm, _setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  useEffect(() => {
    fetchChecks({
      page: currentPage,
      per_page: perPage,
      search: searchTerm || undefined
    })
  }, [fetchChecks, currentPage, perPage, searchTerm])

  const handleView = (check: Check) => {
    setSelectedCheck(check)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (check: Check) => {
    navigate({ to: `/comptabilite/checks/edit/${check.id}` })
  }

  const handleDelete = (check: Check) => {
    setSelectedCheck(check)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedCheck) return
    try {
      await deleteCheck(selectedCheck.id)
      setSelectedCheck(null)
    } catch (_error) {
      // Error handled by store
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  // Pagination functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
  }

  const stats = {
    total: pagination?.total || 0,
    totalAmount: checks.reduce((sum, check) => sum + parseFloat(check.amount), 0),
    active: checks.filter(c => c.status?.code === 'active').length,
    pending: checks.filter(c => c.status?.code === 'pending').length
  }

  const columns = createColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete
  })

  return (
    <div className="space-y-6 w-full pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Chèques</h3>
          <p className='text-muted-foreground text-sm'>Gérez tous les chèques et leurs informations</p>
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

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={checks}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination Sticky Bottom */}
      {pagination && pagination.total > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Affichage de {pagination.from} à {pagination.to} sur {pagination.total} chèques
                </span>
                <Select value={perPage.toString()} onValueChange={(value) => handlePerPageChange(parseInt(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i
                  if (pageNum > pagination.last_page) return null
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.last_page}
                >
                  Suivant
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.last_page)}
                  disabled={currentPage === pagination.last_page}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <CheckDialogs
        isViewOpen={isViewDialogOpen}
        selectedCheck={selectedCheck}
        onCloseView={() => setIsViewDialogOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le chèque "{selectedCheck?.reference}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
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

export default function ChecksPage() {
  return (
    <RequireAnyRoleGate
      roles={[UserRole.SYSTEM_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT_MANAGER, UserRole.ACCOUNTANT]}
      fallback={<ForbiddenError />}
    > 
    
      <ChecksPageContent />
    </RequireAnyRoleGate>

  )
}