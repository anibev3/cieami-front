import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDebounce } from '@/hooks/use-debounce'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/utils/format-currency'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Filter, 
  X, 
  Plus
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
    pagination,
    fetchAssignments,
    setSearchQuery,
    setActiveTab,
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
  }

  const handleCreateAssignment = () => {
    navigate({ to: '/assignments/create' })
  }

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
                  
                  <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-11 px-4 bg-white/50 backdrop-blur-sm border-gray-200/60 hover:bg-gray-50/80"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Filtres
                        {selectedStatuses.length > 1 && (
                          <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs bg-blue-100 text-blue-700">
                            {selectedStatuses.length}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="end">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">Filtres avancés</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-gray-700">Statuts</Label>
                          {allStatusTabs.map((tab) => (
                            <div key={tab.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={tab.value}
                                checked={selectedStatuses.includes(tab.value)}
                                onCheckedChange={(checked) => 
                                  handleMultiStatusChange(tab.value, checked as boolean)
                                }
                              />
                              <Label
                                htmlFor={tab.value}
                                className="flex items-center gap-2 text-sm cursor-pointer"
                              >
                                <span>{getStatusIcon(tab.value)}</span>
                                <span>{tab.label}</span>
                              </Label>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Résumé</Label>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <div className="text-gray-500">Total: <span className="font-medium text-gray-900">{formatCurrency(filteredAssignments.reduce((sum, a) => sum + (parseFloat(a.total_amount || '0') || 0), 0))}</span></div>
                              <div className="text-gray-500">Choc: <span className="font-medium text-gray-900">{formatCurrency(filteredAssignments.reduce((sum, a) => sum + (parseFloat(a.shock_amount || '0') || 0), 0))}</span></div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-gray-500">Autres: <span className="font-medium text-gray-900">{formatCurrency(filteredAssignments.reduce((sum, a) => sum + (parseFloat(a.other_cost_amount || '0') || 0), 0))}</span></div>
                              <div className="text-gray-500">Quittances: <span className="font-medium text-gray-900">{formatCurrency(filteredAssignments.reduce((sum, a) => sum + (parseFloat(a.receipt_amount || '0') || 0), 0))}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
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
                    onClick={() => handleStatusChange(tab.id?.toString() || '')}
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
          {selectedStatuses.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Filtres actifs:</span>
              {selectedStatuses.map((status) => {
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