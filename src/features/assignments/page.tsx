import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDebounce } from '@/hooks/use-debounce'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { DateRangePicker } from '@/components/ui/range-calendar/date-range-picker'
import { ClientSelect } from '@/features/widgets/client-select'
import { UserSelect } from '@/features/widgets/user-select'
import { AssignmentTypeSelect } from '@/features/widgets/assignment-type-select'
import { VehicleSelect } from '@/features/widgets/vehicle-select'
import { InsurerSelect } from '@/features/widgets/insurer-select'
import { BrokerSelect } from '@/features/widgets/broker-select'
import { RepairerSelect } from '@/features/widgets/repairer-select'
import { ExpertiseTypeSelect } from '@/features/widgets/expertise-type-select'
import { 
  Search, 
  Filter, 
  X, 
  Plus,
  RefreshCw
} from 'lucide-react'
import { AssignmentsDataTable } from './components/assignments-data-table'
import { Pagination } from './components/pagination'
import { AssignmentsPageSkeleton } from './components/skeletons/assignments-page-skeleton'
import { useAssignmentsStore, getAllStatusTabs } from '@/stores/assignments'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { Search as SearchComponent } from '@/components/search'
import { EntityTypeEnum, useACL } from '@/hooks/useACL'
import { UserRole, Permission } from '@/types/auth'
import { useUser } from '@/stores/authStore'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

function AssignmentsPageContent() {
  const navigate = useNavigate()
  const { hasRole, isMainOrganization } = useACL()
  const currentUser = useUser()
  
  // Vérifier si l'utilisateur peut créer un dossier
  // Les utilisateurs de type chambre (main_organization) ne peuvent pas créer de dossiers
  const currentUserEntityTypeCode = currentUser?.entity?.entity_type?.code
  const canCreateAssignment = !isMainOrganization() && 
    currentUserEntityTypeCode !== EntityTypeEnum.MAIN_ORGANIZATION && 
    !hasRole(UserRole.REPAIRER_ADMIN)
  const {
    loading,
    error,
    searchQuery,
    activeTab,
    dateRange,
    pagination,
    selectedClient,
    selectedExpert,
    selectedAssignmentType,
    selectedVehicle,
    selectedInsurer,
    selectedBroker,
    selectedRepairer,
    selectedExpertiseType,
    selectedOpenedBy,
    selectedRealisedBy,
    selectedEditedBy,
    selectedValidatedBy,
    fetchAssignments,
    setSearchQuery,
    setActiveTab,
    setDateRange,
    clearDateRange,
    setSelectedClient,
    setSelectedExpert,
    setSelectedAssignmentType,
    setSelectedVehicle,
    setSelectedInsurer,
    setSelectedBroker,
    setSelectedRepairer,
    setSelectedExpertiseType,
    setSelectedOpenedBy,
    setSelectedRealisedBy,
    setSelectedEditedBy,
    setSelectedValidatedBy,
    getFilteredAssignments,
    getStatusCounts,
    clearError,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = useAssignmentsStore()

  

  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['all'])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Debounce pour la recherche
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Initialiser le statut depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const statusParam = urlParams.get('status')
    const clientParam = urlParams.get('client_id')
    const expertParam = urlParams.get('expert_id')
    const assignmentTypeParam = urlParams.get('assignment_type_id')
    const vehicleParam = urlParams.get('vehicle_id')
    const insurerParam = urlParams.get('insurer_id')
    const brokerParam = urlParams.get('broker_id')
    const repairerParam = urlParams.get('repairer_id')
    const expertiseTypeParam = urlParams.get('expertise_type_id')
    const openedByParam = urlParams.get('opened_by')
    const realisedByParam = urlParams.get('realised_by')
    const editedByParam = urlParams.get('edited_by')
    const validatedByParam = urlParams.get('validated_by')
    const dateFromParam = urlParams.get('date_from')
    const dateToParam = urlParams.get('date_to')
    const searchParam = urlParams.get('search')
    
    // Mettre à jour l'état avec les paramètres de l'URL
    if (statusParam) {
      const statusMap: Record<string, string> = {
        'opened': 'opened',
        'realized': 'realized',
        'edited': 'edited',
        'validated': 'validated',
        'closed': 'closed',
        'cancelled': 'cancelled',
        'archived': 'archived',
        'paid': 'paid'
      }
      const mappedStatus = statusMap[statusParam] || statusParam
      setActiveTab(mappedStatus)
      setSelectedStatuses([mappedStatus])
    }
    
    if (clientParam) {
      setSelectedClient(Number(clientParam))
    }
    
    if (expertParam) {
      setSelectedExpert(Number(expertParam))
    }
    
    if (assignmentTypeParam) {
      setSelectedAssignmentType(Number(assignmentTypeParam))
    }
    
    if (vehicleParam) {
      setSelectedVehicle(Number(vehicleParam))
    }
    
    if (insurerParam) {
      setSelectedInsurer(Number(insurerParam))
    }
    
    if (brokerParam) {
      setSelectedBroker(Number(brokerParam))
    }
    
    if (repairerParam) {
      setSelectedRepairer(Number(repairerParam))
    }
    
    if (expertiseTypeParam) {
      setSelectedExpertiseType(Number(expertiseTypeParam))
    }
    
    if (openedByParam) {
      setSelectedOpenedBy(Number(openedByParam))
    }
    
    if (realisedByParam) {
      setSelectedRealisedBy(Number(realisedByParam))
    }
    
    if (editedByParam) {
      setSelectedEditedBy(Number(editedByParam))
    }
    
    if (validatedByParam) {
      setSelectedValidatedBy(Number(validatedByParam))
    }
    
    if (dateFromParam || dateToParam) {
      setDateRange({
        from: dateFromParam ? new Date(dateFromParam) : null,
        to: dateToParam ? new Date(dateToParam) : null
      })
    }
    
    if (searchParam) {
      setSearchQuery(searchParam)
    }
  }, [setActiveTab, setDateRange, setSelectedClient, setSelectedExpert, setSelectedAssignmentType, setSelectedVehicle, setSelectedInsurer, setSelectedBroker, setSelectedRepairer, setSelectedExpertiseType, setSelectedOpenedBy, setSelectedRealisedBy, setSelectedEditedBy, setSelectedValidatedBy, setSearchQuery])

  // Charger les assignations au montage et quand la recherche change
  useEffect(() => {
    if (!isInitialized) {
      // Construire les filtres initiaux à partir de l'URL
      const initialFilters = {
        search: searchQuery || undefined,
        status_code: activeTab !== 'all' ? activeTab : undefined,
        client_id: selectedClient || undefined,
        expert_id: selectedExpert || undefined,
        assignment_type_id: selectedAssignmentType || undefined,
        vehicle_id: selectedVehicle || undefined,
        insurer_id: selectedInsurer || undefined,
        broker_id: selectedBroker || undefined,
        repairer_id: selectedRepairer || undefined,
        expertise_type_id: selectedExpertiseType || undefined,
        opened_by: selectedOpenedBy || undefined,
        realised_by: selectedRealisedBy || undefined,
        edited_by: selectedEditedBy || undefined,
        validated_by: selectedValidatedBy || undefined,
        start_date: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
        end_date: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined
      }
      
      fetchAssignments(1, initialFilters)
      setIsInitialized(true)
    }
  }, [fetchAssignments, isInitialized, searchQuery, activeTab, selectedClient, selectedExpert, selectedAssignmentType, selectedVehicle, selectedInsurer, selectedBroker, selectedRepairer, selectedExpertiseType, selectedOpenedBy, selectedRealisedBy, selectedEditedBy, selectedValidatedBy, dateRange])

  // Effectuer la recherche quand le debouncedSearchQuery change
  useEffect(() => {
    if (isInitialized) {
      const filters = {
        search: debouncedSearchQuery,
        status_code: activeTab !== 'all' ? activeTab : undefined,
        client_id: selectedClient || undefined,
        expert_id: selectedExpert || undefined,
        assignment_type_id: selectedAssignmentType || undefined,
        vehicle_id: selectedVehicle || undefined,
        insurer_id: selectedInsurer || undefined,
        broker_id: selectedBroker || undefined,
        repairer_id: selectedRepairer || undefined,
        expertise_type_id: selectedExpertiseType || undefined,
        opened_by: selectedOpenedBy || undefined,
        realised_by: selectedRealisedBy || undefined,
        edited_by: selectedEditedBy || undefined,
        validated_by: selectedValidatedBy || undefined,
        start_date: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
        end_date: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined
      }
      fetchAssignments(1, filters)
    }
  }, [debouncedSearchQuery, isInitialized, activeTab, selectedClient, selectedExpert, selectedAssignmentType, selectedVehicle, selectedInsurer, selectedBroker, selectedRepairer, selectedExpertiseType, selectedOpenedBy, selectedRealisedBy, selectedEditedBy, selectedValidatedBy, dateRange, fetchAssignments])

  // Filtrer les assignations
  const filteredAssignments = getFilteredAssignments()
  const statusCounts = getStatusCounts()
  const allStatusTabs = getAllStatusTabs()

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  // Afficher le skeleton pendant le chargement initial
  if (loading && !isInitialized) {
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
          <div className="mx-auto">
            <AssignmentsPageSkeleton />
          </div>
        </Main>
      </>
    )
  }

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSearchQuery])

  const handleSearchFromColumn = useCallback((query: string) => {
    setSearchQuery(query)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSearchQuery])

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      setSelectedStatuses(['all'])
      setActiveTab('all')
    } else {
      setSelectedStatuses([value])
      setActiveTab(value)
    }
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }

  const handleMultiStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      const newStatuses = selectedStatuses.filter(s => s !== 'all')
      setSelectedStatuses([...newStatuses, status])
      setActiveTab(status)
    } else {
      const newStatuses = selectedStatuses.filter(s => s !== status)
      if (newStatuses.length === 0) {
        setSelectedStatuses(['all'])
        setActiveTab('all')
      } else {
        setSelectedStatuses(newStatuses)
        setActiveTab(newStatuses[0])
      }
    }
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }

  const clearFilters = () => {
    setSelectedStatuses(['all'])
    setActiveTab('all')
    setSearchQuery('')
    clearDateRange()
    setSelectedClient(null)
    setSelectedExpert(null)
    setSelectedAssignmentType(null)
    setSelectedVehicle(null)
    setSelectedInsurer(null)
    setSelectedBroker(null)
    setSelectedRepairer(null)
    setSelectedExpertiseType(null)
    setSelectedOpenedBy(null)
    setSelectedRealisedBy(null)
    setSelectedEditedBy(null)
    setSelectedValidatedBy(null)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }

  const handleClientChange = useCallback((clientId: string | null) => {
    setSelectedClient(clientId ? Number(clientId) : null)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSelectedClient])

  const handleExpertChange = useCallback((expertId: number | null) => {
    setSelectedExpert(expertId)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSelectedExpert])

  const handleAssignmentTypeChange = useCallback((typeId: string) => {
    setSelectedAssignmentType(typeId ? Number(typeId) : null)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSelectedAssignmentType])

  const handleVehicleChange = useCallback((vehicleId: string) => {
    const vehicleIdNum = vehicleId ? Number(vehicleId) : null
    setSelectedVehicle(vehicleIdNum)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSelectedVehicle])

  const handleInsurerChange = useCallback((insurerId: string | number | null) => {
    setSelectedInsurer(insurerId ? Number(insurerId) : null)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSelectedInsurer])

  const handleBrokerChange = useCallback((brokerId: number | null) => {
    setSelectedBroker(brokerId)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSelectedBroker])

  const handleRepairerChange = useCallback((repairerId: string | number | null) => {
    setSelectedRepairer(repairerId ? Number(repairerId) : null)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSelectedRepairer])

  const handleExpertiseTypeChange = useCallback((expertiseTypeId: number | null) => {
    setSelectedExpertiseType(expertiseTypeId)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSelectedExpertiseType])

  const handleOpenedByChange = useCallback((userId: number | null) => {
    setSelectedOpenedBy(userId)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSelectedOpenedBy])

  const handleRealisedByChange = useCallback((userId: number | null) => {
    setSelectedRealisedBy(userId)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSelectedRealisedBy])

  const handleEditedByChange = useCallback((userId: number | null) => {
    setSelectedEditedBy(userId)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSelectedEditedBy])

  const handleValidatedByChange = useCallback((userId: number | null) => {
    setSelectedValidatedBy(userId)
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setSelectedValidatedBy])

  const handleDateRangeChange = useCallback((values: { range: { from: Date; to: Date | undefined }; rangeCompare?: { from: Date; to: Date | undefined } }) => {
    setDateRange({
      from: values.range.from,
      to: values.range.to || null
    })
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
  }, [setDateRange])

  const handleCreateAssignment = () => {
    navigate({ to: '/assignments/create' })
  }

  const handleRefresh = useCallback(() => {
    // L'API sera appelée automatiquement par le useEffect qui surveille les changements
    toast.success('Données rafraîchies')
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '🟡'
      case 'in_progress': return '🔵'
      case 'completed': return '🟢'
      case 'cancelled': return '🔴'
      default: return '⚪'
    }
  }

  // Fonction pour formater l'affichage des filtres actifs
  const getFilterDisplayText = (filterType: string, value: string | number | null) => {
    switch (filterType) {
      case 'status': {
        const statusTab = allStatusTabs.find(tab => tab.value === value)
        return statusTab ? statusTab.label : value
      }
      case 'client':
        return `Client ID: ${value}`
      case 'expert':
        return `Expert ID: ${value}`
      case 'assignmentType':
        return `Type ID: ${value}`
      case 'vehicle':
        return `Véhicule ID: ${value}`
      case 'insurer':
        return `Assureur ID: ${value}`
      case 'broker':
        return `Courtier ID: ${value}`
      case 'repairer':
        return `Réparateur ID: ${value}`
      case 'expertiseType':
        return `Type d'expertise ID: ${value}`
      case 'openedBy':
        return `Ouvert par ID: ${value}`
      case 'realisedBy':
        return `Réalisé par ID: ${value}`
      case 'editedBy':
        return `Modifié par ID: ${value}`
      case 'validatedBy':
        return `Validé par ID: ${value}`
      case 'date':
        return value
      case 'search':
        return `"${value}"`
      default:
        return value
    }
  }

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
        <div className="mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Dossiers
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Gérez vos dossiers d'expertise automobile
                </p>
              </div>
              {canCreateAssignment && (
                <Button 
                  onClick={handleCreateAssignment}
                  className=" text-white px-6 py-2.5 font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau dossier
                </Button>
              )}
            </div>
          </div>

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Search and Filters */}
              <div className="flex-1 max-w-2xl">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Rechercher un dossier..."
                      className="pl-10 h-11 bg-white/50 backdrop-blur-sm border-gray-200/60 focus:border-blue-500/60 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="relative flex-1">
                    <DateRangePicker
                      initialDateFrom={dateRange.from || undefined}
                      initialDateTo={dateRange.to || undefined}
                      onUpdate={handleDateRangeChange}
                      showCompare={false}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Bouton de rafraîchissement */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="h-11 bg-white/50 backdrop-blur-sm border-gray-200/60 hover:bg-gray-50/80 px-4"
                    title="Rafraîchir les données"
                  >
                    <RefreshCw className={`h-4 w-4 mx-2 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                  
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-11 bg-white/50 backdrop-blur-sm border-gray-200/60 hover:bg-gray-50/80"
                      >
                        <Filter className="h-4 w-4 mr-2" /> Filtres
                        {selectedStatuses.length > 1 && (
                          <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs bg-blue-100 text-blue-700">
                            {selectedStatuses.length}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-lg md:max-w-xl">
                      <SheetHeader className="pb-3">
                        <SheetTitle className="text-lg font-bold text-gray-900">Filtres avancés</SheetTitle>
                      </SheetHeader>
                      <div className="space-y-4 py-2 px-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                        {/* Header avec bouton de réinitialisation */}
                        <div className="flex items-center justify-between pb-2 border-b">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Personnalisez vos filtres</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Réinitialiser
                          </Button>
                        </div>
                        
                        {/* Section Statuts */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <Label className="text-sm font-semibold text-gray-900">Statuts</Label>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {allStatusTabs.map((tab) => (
                              <div key={tab.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={tab.value}
                                  checked={selectedStatuses.includes(tab.value)}
                                  onCheckedChange={(checked) => 
                                    handleMultiStatusChange(tab.value, checked as boolean)
                                  }
                                  className="h-4 w-4"
                                />
                                <Label
                                  htmlFor={tab.value}
                                  className="flex items-center gap-2 text-xs cursor-pointer flex-1"
                                >
                                  <span className="text-sm">{getStatusIcon(tab.value)}</span>
                                  <span className="font-medium truncate">{tab.label}</span>
                                  <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5">
                                    {statusCounts[tab.value] || 0}
                                  </Badge>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator className="my-3" />

                        {/* Section Période */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <Label className="text-sm font-semibold text-gray-900">Période</Label>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600">
                              Sélectionnez une plage de dates
                            </p>
                            <DateRangePicker
                              initialDateFrom={dateRange.from || undefined}
                              initialDateTo={dateRange.to || undefined}
                              onUpdate={handleDateRangeChange}
                              showCompare={false}
                              className="w-full"
                            />
                          </div>
                        </div>

                        <Separator className="my-3" />

                        {/* Section Participants - Layout en colonnes */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <Label className="text-sm font-semibold text-gray-900">Participants</Label>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">Client</Label>
                              <ClientSelect
                                value={selectedClient}
                                onValueChange={handleClientChange}
                                placeholder="Sélectionner un client..."
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">Expert</Label>
                              <UserSelect
                                value={selectedExpert}
                                onValueChange={handleExpertChange}
                                placeholder="Sélectionner un expert"
                                filterRole="expert,expert_manager"
                                showStatus={true}
                              />
                            </div>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        {/* Section Type de mission */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <Label className="text-sm font-semibold text-gray-900">Type de mission</Label>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600">
                              Choisissez le type de mission
                            </p>
                            <AssignmentTypeSelect
                              value={selectedAssignmentType?.toString() || ''}
                              onValueChange={handleAssignmentTypeChange}
                              placeholder="Sélectionner un type..."
                            />
                          </div>
                        </div>

                        <Separator className="my-3" />

                        {/* Section Véhicule */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <Label className="text-sm font-semibold text-gray-900">Véhicule</Label>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600">
                              Sélectionnez un véhicule
                            </p>
                            <VehicleSelect
                              value={selectedVehicle?.toString() || ''}
                              onValueChange={handleVehicleChange}
                              placeholder="Sélectionner un véhicule..."
                            />
                          </div>
                        </div>

                        <Separator className="my-3" />

                        {/* Section Assureur */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <Label className="text-sm font-semibold text-gray-900">Assureur</Label>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600">
                              Sélectionnez un assureur
                            </p>
                            <InsurerSelect
                              value={selectedInsurer}
                              onValueChange={handleInsurerChange}
                              placeholder="Sélectionner un assureur..."
                            />
                          </div>
                        </div>

                        <Separator className="my-3" />

                        {/* Section Courtier */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            <Label className="text-sm font-semibold text-gray-900">Courtier</Label>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600">
                              Sélectionnez un courtier
                            </p>
                            <BrokerSelect
                              value={selectedBroker}
                              onValueChange={handleBrokerChange}
                              placeholder="Sélectionner un courtier..."
                            />
                          </div>
                        </div>

                        <Separator className="my-3" />

                        {/* Section Réparateur */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <Label className="text-sm font-semibold text-gray-900">Réparateur</Label>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600">
                              Sélectionnez un réparateur
                            </p>
                            <RepairerSelect
                              value={selectedRepairer}
                              onValueChange={handleRepairerChange}
                              placeholder="Sélectionner un réparateur..."
                            />
                          </div>
                        </div>

                        <Separator className="my-3" />

                        {/* Section Type d'expertise */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <Label className="text-sm font-semibold text-gray-900">Type d'expertise</Label>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600">
                              Sélectionnez un type d'expertise
                            </p>
                            <ExpertiseTypeSelect
                              value={selectedExpertiseType}
                              onValueChange={handleExpertiseTypeChange}
                              placeholder="Sélectionner un type..."
                            />
                          </div>
                        </div>

                        <Separator className="my-3" />

                        {/* Section Responsabilités */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                            <Label className="text-sm font-semibold text-gray-900">Responsabilités</Label>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">Ouvert par</Label>
                              <UserSelect
                                value={selectedOpenedBy}
                                onValueChange={handleOpenedByChange}
                                placeholder="Sélectionner un utilisateur..."
                                filterRole="expert,expert_manager"
                                showStatus={true}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">Réalisé par</Label>
                              <UserSelect
                                value={selectedRealisedBy}
                                onValueChange={handleRealisedByChange}
                                placeholder="Sélectionner un utilisateur..."
                                filterRole="expert,expert_manager"
                                showStatus={true}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">Modifié par</Label>
                              <UserSelect
                                value={selectedEditedBy}
                                onValueChange={handleEditedByChange}
                                placeholder="Sélectionner un utilisateur..."
                                filterRole="expert,expert_manager"
                                showStatus={true}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">Validé par</Label>
                              <UserSelect
                                value={selectedValidatedBy}
                                onValueChange={handleValidatedByChange}
                                placeholder="Sélectionner un utilisateur..."
                                filterRole="expert,expert_manager"
                                showStatus={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Status Overview Cards */}
              <div className="flex gap-3">
                {allStatusTabs.slice(0, 4).map((tab) => (
                  <div
                    key={tab.value}
                    className={`group relative flex-1 min-w-0 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/60 p-4 hover:bg-white/80 hover:border-gray-300/60 transition-all duration-200 cursor-pointer ${
                      activeTab === tab.value ? 'ring-2 ring-blue-500/20 border-blue-300/60' : ''
                    }`}
                    onClick={() => handleStatusChange(tab.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-600 truncate">
                          {tab.label}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {statusCounts[tab.value] || 0}
                        </p>
                      </div>
                      <div className={`w-2 h-2 rounded-full transition-colors ${
                        tab.value === 'pending' ? 'bg-yellow-400' :
                        tab.value === 'in_progress' ? 'bg-blue-400' :
                        tab.value === 'completed' ? 'bg-green-400' :
                        'bg-gray-400'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedStatuses.length > 1 || dateRange.from || dateRange.to || selectedClient || selectedExpert || selectedAssignmentType || selectedVehicle || selectedInsurer || selectedBroker || selectedRepairer || selectedExpertiseType || selectedOpenedBy || selectedRealisedBy || selectedEditedBy || selectedValidatedBy) && (
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Filtres actifs:</span>
              {selectedStatuses.length > 1 && selectedStatuses.map((status) => (
                <Badge
                  key={status}
                  variant="outline"
                  className={`${getStatusColor(status)} border-current`}
                >
                  {getStatusIcon(status)} {getFilterDisplayText('status', status)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMultiStatusChange(status, false)
                    }}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {dateRange.from && (
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  📅 {getFilterDisplayText('date', dateRange.from.toLocaleDateString('fr-FR'))}
                  {dateRange.to && ` - ${getFilterDisplayText('date', dateRange.to.toLocaleDateString('fr-FR'))}`}
                  <button
                    onClick={() => clearDateRange()}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedClient && (
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                  👤 {getFilterDisplayText('client', selectedClient)}
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedExpert && (
                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                  🔍 {getFilterDisplayText('expert', selectedExpert)}
                  <button
                    onClick={() => setSelectedExpert(null)}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedAssignmentType && (
                <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300">
                  📋 {getFilterDisplayText('assignmentType', selectedAssignmentType)}
                  <button
                    onClick={() => setSelectedAssignmentType(null)}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedVehicle && (
                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                  🚗 {getFilterDisplayText('vehicle', selectedVehicle)}
                  <button
                    onClick={() => setSelectedVehicle(null)}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedInsurer && (
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  🛡️ {getFilterDisplayText('insurer', selectedInsurer)}
                  <button
                    onClick={() => setSelectedInsurer(null)}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedBroker && (
                <Badge variant="outline" className="bg-teal-100 text-teal-700 border-teal-300">
                  👔 {getFilterDisplayText('broker', selectedBroker)}
                  <button
                    onClick={() => setSelectedBroker(null)}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedRepairer && (
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                  🔧 {getFilterDisplayText('repairer', selectedRepairer)}
                  <button
                    onClick={() => setSelectedRepairer(null)}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedExpertiseType && (
                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                  🧠 {getFilterDisplayText('expertiseType', selectedExpertiseType)}
                  <button
                    onClick={() => setSelectedExpertiseType(null)}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedOpenedBy && (
                <Badge variant="outline" className="bg-cyan-100 text-cyan-700 border-cyan-300">
                  🔓 {getFilterDisplayText('openedBy', selectedOpenedBy)}
                  <button
                    onClick={() => setSelectedOpenedBy(null)}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedRealisedBy && (
                <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
                  ✅ {getFilterDisplayText('realisedBy', selectedRealisedBy)}
                  <button
                    onClick={() => setSelectedRealisedBy(null)}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedEditedBy && (
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  ✏️ {getFilterDisplayText('editedBy', selectedEditedBy)}
                  <button
                    onClick={() => setSelectedEditedBy(null)}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedValidatedBy && (
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  🎯 {getFilterDisplayText('validatedBy', selectedValidatedBy)}
                  <button
                    onClick={() => setSelectedValidatedBy(null)}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                  🔍 {getFilterDisplayText('search', searchQuery)}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {/* Bouton Réinitialiser tous les filtres */}
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="ml-2 h-7 px-3 text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300"
              >
                <X className="mr-1 h-3 w-3" />
                Réinitialiser tout
              </Button>
            </div>
          )}

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-sm  border-gray-200 dark:border-gray-700 ">
            <div>
              {/* DataTable */}
              <div className=" overflow-hidden">
                <AssignmentsDataTable 
                data={filteredAssignments} 
                loading={loading} 
                onSearch={handleSearchFromColumn}
              />
              </div>

              {/* Pagination */}
              <div className="p-4 border-t">
                {/* <div className="text-sm text-gray-600 mb-2">
                  Debug: currentPage={pagination.currentPage}, totalPages={pagination.totalPages}, totalItems={pagination.totalItems}
                </div> */}
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  perPage={pagination.perPage}
                  onPageChange={goToPage}
                  onNextPage={goToNextPage}
                  onPreviousPage={goToPreviousPage}
                />
              </div>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}

export default function AssignmentsPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_ASSIGNMENT}>
      <AssignmentsPageContent />
    </ProtectedRoute>
  )
} 