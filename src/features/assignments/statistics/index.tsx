/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search as SearchIcon, FileText, TrendingUp, BarChart3 } from 'lucide-react'
// import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format-currency'
// import { AssignmentSelect } from '@/features/widgets/AssignmentSelect'
import { StatisticsDataTable } from './components/statistics-data-table'
import { AdvancedFiltersDialog } from './components/advanced-filters-sheet'
import { useAssignmentStatisticsStore } from '@/stores/assignmentStatisticsStore'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'

interface AdvancedFilters {
  repairerId?: number | null
  insurerId?: number | null
  brokerId?: number | null
  claimNatureId?: number | null
  statusId?: number | null
  createdById?: number | null
  editedById?: number | null
  realizedById?: number | null
  validatedById?: number | null
  directedById?: number | null
}

export default function AssignmentStatisticsPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('')
  
  // Filtres avancés
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    repairerId: null,
    insurerId: null,
    brokerId: null,
    claimNatureId: null,
    statusId: null,
    createdById: null,
    editedById: null,
    realizedById: null,
    validatedById: null,
    directedById: null,
  })
  
  const { statistics, loading, fetchStatistics } = useAssignmentStatisticsStore()

  const handleSearch = () => {
    console.log('handleSearch called')
    console.log('startDate:', startDate)
    console.log('endDate:', endDate)
    console.log('advancedFilters:', advancedFilters)
    
    if (!startDate || !endDate) {
      console.log('Dates not defined, returning')
      return
    }

    // Construire les filtres de base (dates + dossier)
    const baseFilters: Record<string, string | number | undefined> = {
      start_date: startDate ? startDate.toISOString().split('T')[0] : undefined,
      end_date: endDate ? endDate.toISOString().split('T')[0] : undefined,
      assignment_id: selectedAssignmentId ? parseInt(selectedAssignmentId) : undefined
    }

    // Ajouter les filtres avancés s'ils sont définis
    const allFilters = { ...baseFilters }
    
    if (advancedFilters.repairerId) {
      allFilters.repairer_id = advancedFilters.repairerId
    }
    if (advancedFilters.insurerId) {
      allFilters.insurer_id = advancedFilters.insurerId
    }
    if (advancedFilters.brokerId) {
      allFilters.broker_id = advancedFilters.brokerId
    }
    if (advancedFilters.claimNatureId) {
      allFilters.claim_nature_id = advancedFilters.claimNatureId
    }
    if (advancedFilters.statusId) {
      allFilters.status_id = advancedFilters.statusId
    }
    if (advancedFilters.createdById) {
      allFilters.created_by = advancedFilters.createdById
    }
    if (advancedFilters.editedById) {
      allFilters.edited_by = advancedFilters.editedById
    }
    if (advancedFilters.realizedById) {
      allFilters.realized_by = advancedFilters.realizedById
    }
    if (advancedFilters.validatedById) {
      allFilters.validated_by = advancedFilters.validatedById
    }
    if (advancedFilters.directedById) {
      allFilters.directed_by = advancedFilters.directedById
    }

    console.log('Final filters:', allFilters)
    fetchStatistics(allFilters as any)
  }

  const handleAdvancedFiltersChange = (filters: typeof advancedFilters) => {
    setAdvancedFilters(filters)
    // Optionnel : déclencher automatiquement la recherche quand les filtres changent
    // handleSearch()
  }

  const handleApplyAdvancedFilters = () => {
    console.log('handleApplyAdvancedFilters called')
    console.log('startDate:', startDate)
    console.log('endDate:', endDate)
    
    // Vérifier si les dates sont définies
    if (!startDate || !endDate) {
      console.log('Dates not defined, cannot apply advanced filters')
      return
    }
    
    // Appliquer les filtres avancés en utilisant la recherche principale
    handleSearch()
  }

  const handleClearAdvancedFilters = () => {
    setAdvancedFilters({
      repairerId: null,
      insurerId: null,
      brokerId: null,
      claimNatureId: null,
      statusId: null,
      createdById: null,
      editedById: null,
      realizedById: null,
      validatedById: null,
      directedById: null,
    })
  }

  const handleClearAllFilters = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedAssignmentId('')
    handleClearAdvancedFilters()
  }

  const getActiveFiltersCount = () => {
    return Object.values(advancedFilters).filter(value => value !== undefined && value !== null).length
  }

  const hasActiveFilters = getActiveFiltersCount() > 0


  return (
        <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Statistiques des Dossiers</h1>
              <p className="text-muted-foreground">
                Analysez les performances et les tendances de vos dossiers d'expertise
              </p>
            </div>
          </div>

          {/* Filtres */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <SearchIcon className="h-5 w-5" />
                  Filtres de recherche
                </div>
                <div className="flex items-center gap-2">
                  <AdvancedFiltersDialog
                      filters={advancedFilters}
                      onFiltersChange={handleAdvancedFiltersChange}
                      onApplyFilters={handleApplyAdvancedFilters}
                      onClearFilters={handleClearAdvancedFilters}
                    />
                  {(hasActiveFilters || startDate || endDate || selectedAssignmentId) && (
                      <Button 
                        variant="outline" 
                        onClick={handleClearAllFilters}
                        disabled={loading}
                      >
                        Effacer tout
                      </Button>
                    )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Date de début */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de début</label>
                  <Input
                    type="date"
                    value={startDate ? startDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                    className="w-full"
                  />
                </div>

                {/* Date de fin */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de fin</label>
                  <Input
                    type="date"
                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                    className="w-full"
                  />
                </div>

                {/* Dossier spécifique */}
                {/* <div className="space-y-2">
                  <label className="text-sm font-medium">Dossier spécifique</label>
                  <AssignmentSelect
                    value={selectedAssignmentId}
                    onValueChange={setSelectedAssignmentId}
                    placeholder="Tous les dossiers"
                  />
                </div> */}

                {/* Bouton de recherche */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">&nbsp;</label>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSearch} 
                      disabled={!startDate || !endDate || loading}
                      className="flex-1"
                    >
                      <SearchIcon className="mr-2 h-4 w-4" />
                      Rechercher
                      {hasActiveFilters && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          +{getActiveFiltersCount()} filtres
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résumé des statistiques */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total des dossiers</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.assignments_by_year_and_month_count.reduce((total, item) => total + item.count, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dossiers sur la période sélectionnée
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Montant total</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      statistics.assignments_by_year_and_month_amount.reduce((total, item) => total + parseFloat(item.amount), 0)
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Montant total des dossiers
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Moyenne par dossier</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(() => {
                      const totalCount = statistics.assignments_by_year_and_month_count.reduce((total, item) => total + item.count, 0)
                      const totalAmount = statistics.assignments_by_year_and_month_amount.reduce((total, item) => total + parseFloat(item.amount), 0)
                      return totalCount > 0 ? formatCurrency(totalAmount / totalCount) : '0 €'
                    })()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Montant moyen par dossier
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tableau des statistiques */}
          {statistics && (
            <StatisticsDataTable statistics={statistics} />
          )}

          {/* État de chargement */}
          {loading && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Chargement des statistiques...
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Main>
      </>
  )
} 