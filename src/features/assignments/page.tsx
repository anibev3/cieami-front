import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDebounce } from '@/hooks/use-debounce'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/utils/format-currency'
import { Separator } from '@/components/ui/separator'
import { DateRangePicker } from '@/components/ui/range-calendar/date-range-picker'
import { ClientSelect } from '@/features/widgets/client-select'
import { UserSelect } from '@/features/widgets/user-select'
import { AssignmentTypeSelect } from '@/features/widgets/assignment-type-select'
import { 
  Search, 
  Filter, 
  X, 
  Plus,
  RefreshCw
} from 'lucide-react'
import { AssignmentsDataTable } from './components/assignments-data-table'
import { Pagination } from './components/pagination'
import { useAssignmentsStore, getAllStatusTabs } from '@/stores/assignments'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { Search as SearchComponent } from '@/components/search'

export default function AssignmentsPage() {
  const navigate = useNavigate()
  const {
    loading,
    error,
    searchQuery,
    activeTab,
    dateRange,
    pagination,
    fetchAssignments,
    setSearchQuery,
    setActiveTab,
    setDateRange,
    clearDateRange,
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
  const [selectedClient, setSelectedClient] = useState<number | null>(null)
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null)
  const [selectedAssignmentType, setSelectedAssignmentType] = useState<number | null>(null)

  // Debounce pour la recherche
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Initialiser le statut depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const statusParam = urlParams.get('status')
    
    if (statusParam) {
      const statusMap: Record<string, string> = {
        'opened': 'open',
        'realized': 'realized',
        'edited': 'edited',
        'validated': 'validated',
        'closed': 'closed'
      }
      const mappedStatus = statusMap[statusParam] || statusParam
      setActiveTab(mappedStatus)
      setSelectedStatuses([mappedStatus])
    }
  }, [setActiveTab])

  // Charger les assignations au montage et quand la recherche change
  useEffect(() => {
    if (!isInitialized) {
      fetchAssignments(1)
      setIsInitialized(true)
    }
  }, [fetchAssignments, isInitialized])

  // Effectuer la recherche quand le debouncedSearchQuery change
  useEffect(() => {
    if (isInitialized) {
      const filters = {
        search: debouncedSearchQuery,
        status_code: activeTab !== 'all' ? activeTab : undefined,
      }
      fetchAssignments(1, filters)
    }
  }, [debouncedSearchQuery, activeTab, isInitialized, fetchAssignments])

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

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [setSearchQuery])

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      setSelectedStatuses(['all'])
      setActiveTab('all')
    } else {
      setSelectedStatuses([value])
      setActiveTab(value)
    }
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
  }

  const clearFilters = () => {
    setSelectedStatuses(['all'])
    setActiveTab('all')
    setSearchQuery('')
    clearDateRange()
    setSelectedClient(null)
    setSelectedExpert(null)
    setSelectedAssignmentType(null)
  }

  const handleClientChange = useCallback((clientId: number | null) => {
    setSelectedClient(clientId)
    // Recharger les données avec le nouveau filtre
    const filters = {
      search: searchQuery,
      status_code: activeTab !== 'all' ? activeTab : undefined,
      client_id: clientId || undefined,
      expert_id: selectedExpert || undefined,
      assignment_type_id: selectedAssignmentType || undefined,
      start_date: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
      end_date: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined
    }
    fetchAssignments(1, filters)
  }, [searchQuery, activeTab, selectedExpert, selectedAssignmentType, dateRange, fetchAssignments])

  const handleExpertChange = useCallback((expertId: number | null) => {
    setSelectedExpert(expertId)
    // Recharger les données avec le nouveau filtre
    const filters = {
      search: searchQuery,
      status_code: activeTab !== 'all' ? activeTab : undefined,
      client_id: selectedClient || undefined,
      expert_id: expertId || undefined,
      assignment_type_id: selectedAssignmentType || undefined,
      start_date: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
      end_date: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined
    }
    fetchAssignments(1, filters)
  }, [searchQuery, activeTab, selectedClient, selectedAssignmentType, dateRange, fetchAssignments])

  const handleAssignmentTypeChange = useCallback((typeId: string) => {
    setSelectedAssignmentType(typeId ? Number(typeId) : null)
    // Recharger les données avec le nouveau filtre
    const filters = {
      search: searchQuery,
      status_code: activeTab !== 'all' ? activeTab : undefined,
      client_id: selectedClient || undefined,
      expert_id: selectedExpert || undefined,
      assignment_type_id: typeId ? Number(typeId) : undefined,
      start_date: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
      end_date: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined
    }
    fetchAssignments(1, filters)
  }, [searchQuery, activeTab, selectedClient, selectedExpert, dateRange, fetchAssignments])

  const handleDateRangeChange = useCallback((values: { range: { from: Date; to: Date | undefined }; rangeCompare?: { from: Date; to: Date | undefined } }) => {
    setDateRange({
      from: values.range.from,
      to: values.range.to || null
    })
    // Recharger les données avec le nouveau filtre de dates
    const filters = {
      search: searchQuery,
      status_code: activeTab !== 'all' ? activeTab : undefined,
      start_date: values.range.from.toISOString().split('T')[0],
      end_date: values.range.to ? values.range.to.toISOString().split('T')[0] : undefined
    }
    fetchAssignments(1, filters)
  }, [setDateRange, searchQuery, activeTab, fetchAssignments])

  const handleCreateAssignment = () => {
    navigate({ to: '/assignments/create' })
  }

  const handleRefresh = useCallback(() => {
    // Recharger les données avec les filtres actuels
    const filters = {
      search: searchQuery,
      status_code: activeTab !== 'all' ? activeTab : undefined,
      client_id: selectedClient || undefined,
      expert_id: selectedExpert || undefined,
      assignment_type_id: selectedAssignmentType || undefined,
      start_date: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
      end_date: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined
    }
    fetchAssignments(1, filters)
    toast.success('Données rafraîchies')
  }, [searchQuery, activeTab, selectedClient, selectedExpert, selectedAssignmentType, dateRange, fetchAssignments])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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
              <Button 
                onClick={handleCreateAssignment}
                className=" text-white px-6 py-2.5 font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau dossier
              </Button>
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
                    className="h-11 bg-white/50 backdrop-blur-sm border-gray-200/60 hover:bg-gray-50/80"
                    title="Rafraîchir les données"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                  
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-11 bg-white/50 backdrop-blur-sm border-gray-200/60 hover:bg-gray-50/80"
                      >
                        <Filter className="h-4 w-4 mr-2" />
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

                        {/* Section Type d'assignation */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <Label className="text-sm font-semibold text-gray-900">Type d'assignation</Label>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600">
                              Choisissez le type d'assignation
                            </p>
                            <AssignmentTypeSelect
                              value={selectedAssignmentType?.toString() || ''}
                              onValueChange={handleAssignmentTypeChange}
                              placeholder="Sélectionner un type..."
                            />
                          </div>
                        </div>

                        <Separator className="my-3" />

                        {/* Section Résumé - Plus compacte */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <Label className="text-sm font-semibold text-gray-900">Résumé</Label>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total:</span>
                                  <span className="font-semibold text-gray-900">
                                    {formatCurrency(filteredAssignments.reduce((sum, a) => sum + (parseFloat(a.total_amount || '0') || 0), 0))}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Choc:</span>
                                  <span className="font-semibold text-gray-900">
                                    {formatCurrency(filteredAssignments.reduce((sum, a) => sum + (parseFloat(a.shock_amount || '0') || 0), 0))}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Autres:</span>
                                  <span className="font-semibold text-gray-900">
                                    {formatCurrency(filteredAssignments.reduce((sum, a) => sum + (parseFloat(a.other_cost_amount || '0') || 0), 0))}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Quittances:</span>
                                  <span className="font-semibold text-gray-900">
                                    {formatCurrency(filteredAssignments.reduce((sum, a) => sum + (parseFloat(a.receipt_amount || '0') || 0), 0))}
                                  </span>
                                </div>
                              </div>
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
          {(selectedStatuses.length > 1 || dateRange.from || dateRange.to) && (
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Filtres actifs:</span>
              {selectedStatuses.length > 1 && selectedStatuses.map((status) => {
                const tab = allStatusTabs.find(t => t.value === status)
                return (
                  <Badge
                    key={status}
                    variant="outline"
                    className={`${getStatusColor(status)} border-current`}
                  >
                    {getStatusIcon(status)} {tab?.label}
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
                )
              })}
              {dateRange.from && (
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  📅 {dateRange.from.toLocaleDateString('fr-FR')}
                  {dateRange.to && ` - ${dateRange.to.toLocaleDateString('fr-FR')}`}
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
                  👤 Client sélectionné
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
                  🔍 Expert sélectionné
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
                  📋 Type sélectionné
                  <button
                    onClick={() => setSelectedAssignmentType(null)}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-sm  border-gray-200 dark:border-gray-700 ">
            <div>
              {/* DataTable */}
              <div className=" overflow-hidden">
                <AssignmentsDataTable data={filteredAssignments} loading={loading} />
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