import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AssignmentsDataTable } from './components/assignments-data-table'
  import { useAssignmentsStore, getAllStatusTabs } from '@/stores/assignments'
import { Plus, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AssignmentsPage() {
  const navigate = useNavigate()
  const {
    assignments,
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

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue)
  }

  const handleCreateAssignment = () => {
    navigate({ to: '/assignments/create' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dossiers</h1>
        <Button onClick={handleCreateAssignment}>
          <Plus className="mr-2 h-4 w-4" />
          Ouvrir un dossier
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Rechercher un dossier..."
            className="pl-10 pr-4"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Total: {assignments.length} assignations</span>
        </div>
      </div>

      {/* Filtres par statut */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {allStatusTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? 'default' : 'outline'}
              className={activeTab === tab.value ? 'bg-blue-600 text-white' : ''}
              size="sm"
              onClick={() => handleTabChange(tab.value)}
            >
              {tab.label}
              <Badge
                variant={activeTab === tab.value ? 'secondary' : 'outline'}
                className="ml-2 text-xs"
              >
                {statusCounts[tab.value] || 0}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div>
        {loading && !isInitialized ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Chargement...</span>
          </div>
        ) : (
          <div>
            {/* Résumé du statut */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <h3 className="text-gray-900 font-semibold">
                {allStatusTabs.find(tab => tab.value === activeTab)?.label} ({statusCounts[activeTab] || 0})
              </h3>
              <p className="text-sm text-gray-600">
                {activeTab === 'all' 
                  ? 'Toutes les assignations' 
                  : `Assignations avec le statut "${allStatusTabs.find(tab => tab.value === activeTab)?.label}"`
                }
              </p>
            </div>

            {/* DataTable */}
            <AssignmentsDataTable data={filteredAssignments} />
          </div>
        )}
      </div>
    </div>
  )
} 