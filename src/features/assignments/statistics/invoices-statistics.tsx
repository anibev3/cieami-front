/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search as SearchIcon, RefreshCw, X, Filter, Calendar, User, FileText, Hash, CheckCircle, Copy } from 'lucide-react'
import { 
  StatisticsType, 
  StatisticsFilters, 
  InvoiceStatisticsFilters
} from '@/types/statistics'
import { UnifiedAdvancedFilters } from './components/unified-advanced-filters'
import { UnifiedStatisticsDisplay } from './components/unified-statistics-display'
import { useStatisticsStore } from '@/stores/statisticsStore'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { toast } from 'sonner'
import { Permission } from '@/types/auth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

// Configuration des icônes et labels pour les filtres des factures
const FILTER_CONFIG: Record<string, { icon: any; label: string; color: string }> = {
  start_date: { icon: Calendar, label: 'Date de début', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  end_date: { icon: Calendar, label: 'Date de fin', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  invoice_id: { icon: Hash, label: 'ID Facture', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  client_id: { icon: User, label: 'Client', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  assignment_id: { icon: FileText, label: 'ID Dossier', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  payment_status_id: { icon: CheckCircle, label: 'Statut de paiement', color: 'bg-green-100 text-green-700 border-green-300' },
  created_by: { icon: User, label: 'Créé par', color: 'bg-green-100 text-green-700 border-green-300' },
  status_id: { icon: CheckCircle, label: 'Statut', color: 'bg-gray-100 text-gray-700 border-gray-300' },
}

// Clés de stockage localStorage
const STORAGE_KEYS = {
  STATISTICS_FILTERS: 'invoices_statistics_filters',
  STATISTICS_DATES: 'invoices_statistics_dates'
}

function InvoicesStatisticsPageContent() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  
  const { 
    statistics, 
    loading, 
    error,
    fetchStatistics, 
    clearStatistics,
    clearError,
    downloadExport
  } = useStatisticsStore()

  const getDefaultFilters = useCallback((): InvoiceStatisticsFilters => {
    return {
      start_date: startDate ? startDate.toISOString().split('T')[0] : '',
      end_date: endDate ? endDate.toISOString().split('T')[0] : '',
      invoice_id: undefined,
      client_id: undefined,
      assignment_id: undefined,
      payment_status_id: undefined,
      created_by: undefined,
      status_id: undefined,
    }
  }, [startDate, endDate])

  const [filters, setFilters] = useState<InvoiceStatisticsFilters>(getDefaultFilters())

  // Charger les filtres sauvegardés
  const loadSavedFilters = useCallback(() => {
    try {
      // Charger les dates
      const savedDates = localStorage.getItem(STORAGE_KEYS.STATISTICS_DATES)
      if (savedDates) {
        const dates = JSON.parse(savedDates)
        if (dates.startDate) setStartDate(new Date(dates.startDate))
        if (dates.endDate) setEndDate(new Date(dates.endDate))
      }

      // Charger les filtres avancés
      const savedFilters = localStorage.getItem(STORAGE_KEYS.STATISTICS_FILTERS)
      if (savedFilters) {
        const filters = JSON.parse(savedFilters)
        setFilters(filters)
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des filtres sauvegardés:', error)
    }
  }, [])

  // Sauvegarder les filtres
  const saveFilters = useCallback(() => {
    try {
      // Sauvegarder les dates
      localStorage.setItem(STORAGE_KEYS.STATISTICS_DATES, JSON.stringify({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      }))

      // Sauvegarder les filtres avancés
      localStorage.setItem(STORAGE_KEYS.STATISTICS_FILTERS, JSON.stringify(filters))
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des filtres:', error)
    }
  }, [startDate, endDate, filters])

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 5000 })
      clearError()
    }
  }, [error, clearError])

  // Charger les filtres sauvegardés au montage
  useEffect(() => {
    loadSavedFilters()
  }, [loadSavedFilters])

  // Sauvegarder les filtres quand ils changent
  useEffect(() => {
    saveFilters()
  }, [filters, startDate, endDate, saveFilters])

  // Mettre à jour les filtres quand les dates changent
  useEffect(() => {
    setFilters(getDefaultFilters())
    clearStatistics()
  }, [startDate, endDate, clearStatistics, getDefaultFilters])

  const handleSearch = () => {
    triggerSearch()
  }

  const handleAdvancedFiltersChange = (newFilters: StatisticsFilters) => {
    setFilters(newFilters as InvoiceStatisticsFilters)
  }

  const handleApplyAdvancedFilters = () => {
    triggerSearch()
  }

  const handleClearAdvancedFilters = () => {
    setFilters(getDefaultFilters())
  }

  const handleClearAllFilters = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setFilters(getDefaultFilters())
    clearStatistics()
    
    // Nettoyer le localStorage
    localStorage.removeItem(STORAGE_KEYS.STATISTICS_FILTERS)
    localStorage.removeItem(STORAGE_KEYS.STATISTICS_DATES)
  }

  // Fonction pour obtenir le label d'un filtre
  const getFilterLabel = (key: string, value: any): string => {
    if (value === undefined || value === null || value === '') return ''
    
    // Pour les IDs, on peut afficher "ID: valeur" ou essayer de récupérer le nom
    if (key.endsWith('_id')) {
      return `${FILTER_CONFIG[key]?.label || key}: ${value}`
    }
    
    return `${FILTER_CONFIG[key]?.label || key}: ${value}`
  }

  // Fonction pour supprimer un filtre spécifique
  const removeFilter = (key: string) => {
    const newFilters = { ...filters, [key]: undefined }
    setFilters(newFilters)
    
    // Déclencher automatiquement la recherche si les dates sont définies
    if (startDate && endDate) {
      setTimeout(() => {
        const updatedFilters = {
          ...newFilters,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        }
        const typeToUse = 'invoices' as StatisticsType
        fetchStatistics(typeToUse, updatedFilters)
      }, 100)
    }
  }

  // Fonction pour supprimer les dates
  const removeDateFilter = (type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(undefined)
    } else {
      setEndDate(undefined)
    }
    
    // Déclencher automatiquement la recherche si l'autre date est définie
    if ((type === 'start' && endDate) || (type === 'end' && startDate)) {
      setTimeout(() => {
        const updatedFilters = {
          ...filters,
          start_date: startDate?.toISOString().split('T')[0] || '',
          end_date: endDate?.toISOString().split('T')[0] || ''
        }
        const typeToUse = 'invoices' as StatisticsType
        fetchStatistics(typeToUse, updatedFilters)
      }, 100)
    }
  }

  const getActiveFiltersCount = () => {
    const baseFilters = ['start_date', 'end_date']
    const allKeys = Object.keys(filters)
    return allKeys.filter(key => 
      !baseFilters.includes(key) && 
      filters[key as keyof InvoiceStatisticsFilters] !== undefined &&
      filters[key as keyof InvoiceStatisticsFilters] !== null
    ).length
  }

  const hasActiveFilters = getActiveFiltersCount() > 0
  const canSearch = startDate && endDate

  // Fonction pour déclencher la recherche avec les filtres actuels
  const triggerSearch = useCallback(() => {
    if (!startDate || !endDate) {
      toast.error('Veuillez sélectionner une période de début et de fin')
      return
    }
    
    const updatedFilters = {
      ...filters,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    }
    
    setFilters(updatedFilters)
    fetchStatistics('invoices', updatedFilters)
  }, [startDate, endDate, filters, fetchStatistics])

  // Fonction pour copier l'URL actuelle dans le presse-papiers
  const copyCurrentURL = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('URL copiée dans le presse-papiers !')
    } catch (_error) {
      // Fallback pour les navigateurs qui ne supportent pas clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('URL copiée dans le presse-papiers !')
    }
  }

  // Composant pour afficher les filtres actifs
  const ActiveFiltersDisplay = () => {
    const activeFilters = Object.entries(filters).filter(([key, value]) => 
      value !== undefined && value !== null && value !== '' && key !== 'start_date' && key !== 'end_date'
    )

    if (activeFilters.length === 0 && !startDate && !endDate) return null

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filtres actifs:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Filtres de date */}
          {startDate && (
            <Badge variant="outline" className={FILTER_CONFIG.start_date.color}>
              <Calendar className="h-3 w-3 mr-1" />
              {FILTER_CONFIG.start_date.label}: {startDate.toLocaleDateString('fr-FR')}
              <button
                onClick={() => removeDateFilter('start')}
                className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {endDate && (
            <Badge variant="outline" className={FILTER_CONFIG.end_date.color}>
              <Calendar className="h-3 w-3 mr-1" />
              {FILTER_CONFIG.end_date.label}: {endDate.toLocaleDateString('fr-FR')}
              <button
                onClick={() => removeDateFilter('end')}
                className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Filtres avancés */}
          {activeFilters.map(([key, value]) => {
            const config = FILTER_CONFIG[key as keyof typeof FILTER_CONFIG]
            if (!config) return null

            const IconComponent = config.icon
            return (
              <Badge key={key} variant="outline" className={config.color}>
                <IconComponent className="h-3 w-3 mr-1" />
                {getFilterLabel(key, value)}
                <button
                  onClick={() => removeFilter(key)}
                  className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}

          {/* Bouton pour tout effacer */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAllFilters}
            className="ml-2 h-7 px-3 text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300"
          >
            <X className="mr-1 h-3 w-3" />
            Effacer tout
          </Button>
        </div>
      </div>
    )
  }

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
              <h1 className="text-2xl font-bold tracking-tight">Statistiques des factures</h1>
              <p className="text-muted-foreground">
                Analysez les performances et les tendances de vos factures
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyCurrentURL}
                className="gap-2"
                title="Copier l'URL avec tous les filtres"
              >
                <Copy className="h-4 w-4" />
                Copier l'URL
              </Button>
            </div>
          </div>

          {/* Filtres de base */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <SearchIcon className="h-5 w-5" />
                  Filtres de base
                </div>
                <div className="flex items-center gap-2">
                  <UnifiedAdvancedFilters
                    type="invoices"
                    filters={filters as StatisticsFilters}
                    onFiltersChange={handleAdvancedFiltersChange}
                    onApplyFilters={handleApplyAdvancedFilters}
                    onClearFilters={handleClearAdvancedFilters}
                    onDownloadExport={statistics && 'export_url' in statistics ? downloadExport : undefined}
                    exportUrl={statistics && 'export_url' in statistics ? statistics.export_url : undefined}
                    loading={loading}
                  />
                  {(hasActiveFilters || startDate || endDate) && (
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                {/* Bouton de recherche */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">&nbsp;</label>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSearch} 
                      disabled={!canSearch || loading}
                      className="flex-1"
                    >
                      {loading ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <SearchIcon className="mr-2 h-4 w-4" />
                      )}
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

          {/* Affichage des filtres actifs */}
          <ActiveFiltersDisplay />

          {/* Affichage des statistiques */}
          {statistics && (
            <UnifiedStatisticsDisplay
              type="invoices"
              statistics={statistics}
              onDownloadExport={downloadExport}
            />
          )}

          {/* État de chargement */}
          {loading && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2">
                  <RefreshCw className="animate-spin h-4 w-4" />
                  Chargement des statistiques...
                </div>
              </CardContent>
            </Card>
          )}

          {/* Message d'aide */}
          {!statistics && !loading && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune statistique affichée</h3>
                <p className="text-muted-foreground mb-4">
                  Définissez une période et cliquez sur Rechercher pour afficher les données des factures.
                </p>
                <Button onClick={handleSearch} disabled={!canSearch}>
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Lancer une recherche
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </Main>
    </>
  )
}

export default function InvoicesStatisticsPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.INVOICE_STATISTICS}>
      <InvoicesStatisticsPageContent />
    </ProtectedRoute>
  )
}
