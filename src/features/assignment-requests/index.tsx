import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDebounce } from '@/hooks/use-debounce'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { DateRangePicker } from '@/components/ui/range-calendar/date-range-picker'
import { ClientSelect } from '@/features/widgets/client-select'
import { InsurerSelect } from '@/features/widgets/insurer-select'
import { RepairerSelect } from '@/features/widgets/repairer-select'
import { VehicleSelect } from '@/features/widgets/vehicle-select'
import { 
  Search, 
  Filter, 
  X, 
  RefreshCw,
  FileText,
  TrendingUp,
  Calendar as CalendarIcon,
  Users
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AssignmentRequestsDataTable } from './components/assignment-requests-data-table'
import { Pagination } from '@/features/assignments/components/pagination'
import { useAssignmentRequestsStore } from '@/stores/assignmentRequests'
import { AssignmentRequest } from '@/types/assignment-requests'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { Search as SearchComponent } from '@/components/search'
import { useACL } from '@/hooks/useACL'

export default function AssignmentRequestsPage() {
  const navigate = useNavigate()
  const { isAdmin, isSystemAdmin } = useACL()
  const {
    assignmentRequests,
    loading,
    error,
    searchQuery,
    pagination,
    filters,
    fetchAssignmentRequests,
    setSearchQuery,
    // setFilters,
    clearFilters,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    clearError,
    rejectAssignmentRequest,
  } = useAssignmentRequestsStore()
  
  // Vérifier si l'utilisateur peut rejeter (admin ou system admin)
  const canReject = isAdmin() || isSystemAdmin()

  const [isInitialized, setIsInitialized] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null
  })
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [selectedInsurer, setSelectedInsurer] = useState<string | null>(null)
  const [selectedRepairer, setSelectedRepairer] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [requestToReject, setRequestToReject] = useState<AssignmentRequest | null>(null)

  // Debounce pour la recherche
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Initialiser les données au montage
  useEffect(() => {
    if (!isInitialized) {
      fetchAssignmentRequests(1, {})
      setIsInitialized(true)
    }
  }, [isInitialized, fetchAssignmentRequests])

  // Effectuer la recherche quand le debouncedSearchQuery change
  useEffect(() => {
    if (isInitialized) {
      const currentFilters = {
        ...filters,
        search: debouncedSearchQuery,
        client_id: selectedClient ? Number(selectedClient) : undefined,
        insurer_id: selectedInsurer ? Number(selectedInsurer) : undefined,
        repairer_id: selectedRepairer ? Number(selectedRepairer) : undefined,
        vehicle_id: selectedVehicle ? Number(selectedVehicle) : undefined,
        date_from: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
        date_to: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined,
      }
      fetchAssignmentRequests(1, currentFilters)
    }
  }, [debouncedSearchQuery, isInitialized, selectedClient, selectedInsurer, selectedRepairer, selectedVehicle, dateRange, fetchAssignmentRequests, filters])

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [setSearchQuery])

  const handleViewDetail = useCallback((id: string) => {
    navigate({ to: `/assignment-requests/${id}` })
  }, [navigate])

  const handleOpenFolder = useCallback((id: string) => {
    navigate({ to: `/assignments/edit/${id}?is_assignment_request=true` })
  }, [navigate])

  const handleReject = useCallback((id: string) => {
    const request = assignmentRequests.find(r => r.id === id)
    if (request) {
      setRequestToReject(request)
      setRejectDialogOpen(true)
    }
  }, [assignmentRequests])

  const handleConfirmReject = useCallback(async () => {
    if (requestToReject) {
      await rejectAssignmentRequest(requestToReject.id)
      setRejectDialogOpen(false)
      setRequestToReject(null)
    }
  }, [requestToReject, rejectAssignmentRequest])

  const handleRefresh = useCallback(() => {
    const currentFilters = {
      ...filters,
      search: searchQuery,
      client_id: selectedClient ? Number(selectedClient) : undefined,
      insurer_id: selectedInsurer ? Number(selectedInsurer) : undefined,
      repairer_id: selectedRepairer ? Number(selectedRepairer) : undefined,
      vehicle_id: selectedVehicle ? Number(selectedVehicle) : undefined,
      date_from: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
      date_to: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined,
    }
    fetchAssignmentRequests(pagination.currentPage, currentFilters)
  }, [fetchAssignmentRequests, pagination.currentPage, filters, searchQuery, selectedClient, selectedInsurer, selectedRepairer, selectedVehicle, dateRange])

  const handleClearFilters = useCallback(() => {
    clearFilters()
    setSelectedClient(null)
    setSelectedInsurer(null)
    setSelectedRepairer(null)
    setSelectedVehicle(null)
    setDateRange({ from: null, to: null })
  }, [clearFilters])

  const hasActiveFilters = 
    searchQuery || 
    selectedClient || 
    selectedInsurer || 
    selectedRepairer || 
    selectedVehicle || 
    dateRange.from || 
    dateRange.to

  return (
    <>
      <Header fixed>
        <SearchComponent />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="space-y-6 p-6">
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Demandes d'expertise</h1>
                  <p className="text-muted-foreground mt-1">
                    Gérez toutes les demandes d'expertise reçues
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par référence, client, assureur..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                  {hasActiveFilters && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                      !
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtres de recherche</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Client */}
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <ClientSelect
                      value={selectedClient}
                      onValueChange={setSelectedClient}
                    />
                  </div>

                  {/* Assureur */}
                  <div className="space-y-2">
                    <Label>Assureur</Label>
                    <InsurerSelect
                      value={selectedInsurer}
                      onValueChange={(value) => setSelectedInsurer(value ? String(value) : null)}
                    />
                  </div>

                  {/* Réparateur */}
                  <div className="space-y-2">
                    <Label>Réparateur</Label>
                    <RepairerSelect
                      value={selectedRepairer}
                      onValueChange={(value) => setSelectedRepairer(value ? String(value) : null)}
                    />
                  </div>

                  {/* Véhicule */}
                  <div className="space-y-2">
                    <Label>Véhicule</Label>
                    <VehicleSelect
                      value={selectedVehicle || ''}
                      onValueChange={(value) => setSelectedVehicle(value || null)}
                    />
                  </div>

                  {/* Plage de dates */}
                  <div className="space-y-2">
                    <Label>Date de création</Label>
                    <DateRangePicker
                      initialDateFrom={dateRange.from || undefined}
                      initialDateTo={dateRange.to || undefined}
                      onUpdate={(values) => {
                        setDateRange({
                          from: values.range.from || null,
                          to: values.range.to || null
                        })
                      }}
                    />
                  </div>

                  <Separator />

                  {/* Boutons d'action */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Réinitialiser
                    </Button>
                    <Button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1"
                    >
                      Appliquer
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total des demandes</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">{pagination.totalItems}</p>
                </div>
                <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-full">
                  <FileText className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Page actuelle</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">{pagination.currentPage}</p>
                </div>
                <div className="p-3 bg-green-200 dark:bg-green-800 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-700 dark:text-green-300" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Pages totales</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">{pagination.totalPages}</p>
                </div>
                <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-full">
                  <CalendarIcon className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Par page</p>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">{pagination.perPage}</p>
                </div>
                <div className="p-3 bg-orange-200 dark:bg-orange-800 rounded-full">
                  <Users className="h-6 w-6 text-orange-700 dark:text-orange-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Tableau */}
          <div className="rounded-lg border bg-card">
            <AssignmentRequestsDataTable
              data={assignmentRequests}
              loading={loading}
              onViewDetail={handleViewDetail}
              onOpenFolder={handleOpenFolder}
              onReject={canReject ? handleReject : undefined}
              canReject={canReject}
            />
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              perPage={pagination.perPage}
              onPageChange={goToPage}
              onNextPage={goToNextPage}
              onPreviousPage={goToPreviousPage}
            />
          )}
        </div>

        {/* Dialog de confirmation de rejet */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rejeter la demande d'expertise</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir rejeter la demande d'expertise{' '}
                <strong>{requestToReject?.reference}</strong> ? Cette action changera le statut de la demande.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleConfirmReject} disabled={loading}>
                Rejeter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Main>
    </>
  )
}

