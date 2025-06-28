import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AssignmentsDataTable } from './components/assignments-data-table'
import { useAssignmentsStore, getAllStatusTabs } from '@/stores/assignments'
import { Plus, Search, Loader2, Filter, X } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/utils/format-currency'

export default function AssignmentsPage() {
  const navigate = useNavigate()
  const {
    loading,
    error,
    searchQuery,
    activeTab,
    fetchAssignments,
    setSearchQuery,
    setActiveTab,
    getFilteredAssignments,
    getStatusCounts,
    clearError,
  } = useAssignmentsStore()

  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['all'])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Charger les assignations au montage
  useEffect(() => {
    if (!isInitialized) {
      fetchAssignments()
      setIsInitialized(true)
    }
  }, [fetchAssignments, isInitialized])

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

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
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Dossiers
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
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

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <div className="flex gap-3 flex-1 max-w-2xl">
                <div className="relative flex-1">
                  {/* <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /> */}
                  <Input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Rechercher un dossier..."
                    className="pr-4 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Advanced Filters */}
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-11 px-4 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filtres
                      {selectedStatuses.length > 1 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {selectedStatuses.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">Filtres avancés</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Statuts multiples
                        </Label>
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
                              {/* <Badge variant="secondary" className="text-xs">
                                {statusCounts[tab.value] || 0}
                              </Badge> */}
                            </Label>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Montants
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <div>Total: {formatCurrency(filteredAssignments.reduce((sum, a) => sum + (parseFloat(a.total_amount) || 0), 0))}</div>
                            <div>Choc: {formatCurrency(filteredAssignments.reduce((sum, a) => sum + (parseFloat(a.shock_amount) || 0), 0))}</div>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <div>Autres: {formatCurrency(filteredAssignments.reduce((sum, a) => sum + (parseFloat(a.other_cost_amount) || 0), 0))}</div>
                            <div>Quittances: {formatCurrency(filteredAssignments.reduce((sum, a) => sum + (parseFloat(a.receipt_amount || '0') || 0), 0))}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Statistiques
                        </Label>
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <div>• {filteredAssignments.filter(a => a.receipts.length > 0).length} avec quittances</div>
                          <div>• {filteredAssignments.filter(a => a.shocks.length > 0).length} avec points de choc</div>
                          <div>• {filteredAssignments.filter(a => a.other_costs.length > 0).length} avec autres coûts</div>
                          <div>• {filteredAssignments.filter(a => a.expertise_date).length} avec date d'expertise</div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className='mt-4'>
              <Select value={activeTab} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    {allStatusTabs.map((tab) => (
                      <SelectItem key={tab.value} value={tab.value}>
                        <div className="flex items-center gap-2">
                          <span>{getStatusIcon(tab.value)}</span>
                          <span>{tab.label}</span>
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {statusCounts[tab.value] || 0}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
              </Select>
              </div>
            </div>
            {allStatusTabs.slice(0, 4).map((tab) => (
              <div
                key={tab.value}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-sm transition-shadow duration-200 cursor-pointer"
                onClick={() => handleStatusChange(tab.value)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {tab.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {statusCounts[tab.value] || 0}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    tab.value === 'pending' ? 'bg-yellow-400' :
                    tab.value === 'in_progress' ? 'bg-blue-400' :
                    tab.value === 'completed' ? 'bg-green-400' :
                    'bg-gray-400'
                  }`} />
                </div>
              </div>
            ))}
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
            {loading && !isInitialized ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Chargement des dossiers...</p>
                </div>
              </div>
            ) : (
              <div>
                {/* Active Tab Summary */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getStatusIcon(activeTab)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {allStatusTabs.find(tab => tab.value === activeTab)?.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activeTab === 'all' 
                            ? 'Tous les dossiers d\'expertise' 
                            : `${statusCounts[activeTab] || 0} dossier(s) avec ce statut`
                          }
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {statusCounts[activeTab] || 0} résultat(s)
                    </Badge>
                  </div>
                </div>

                {/* DataTable */}
                <div className=" overflow-hidden">
                  <AssignmentsDataTable data={filteredAssignments} />
                </div>

                <div className=" mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{filteredAssignments.length} dossiers au total</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Main>
    </>
  )
} 