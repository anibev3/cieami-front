/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search as SearchIcon, RefreshCw, X, Filter, Calendar, User, Building, Car, FileText, CreditCard, Hash, Shield, Wrench, FileCheck, CheckCircle, Edit, Play, Target, AlertCircle, Copy } from 'lucide-react'
import { 
  StatisticsType, 
  StatisticsFilters, 
  AssignmentStatisticsFilters,
  PaymentStatisticsFilters,
  InvoiceStatisticsFilters
} from '@/types/statistics'
import { StatisticsTypeSelector } from './components/statistics-type-selector'
import { UnifiedAdvancedFilters } from './components/unified-advanced-filters'
import { UnifiedStatisticsDisplay } from './components/unified-statistics-display'
import { useStatisticsStore } from '@/stores/statisticsStore'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { toast } from 'sonner'
import { UserRole } from '@/stores/aclStore'
import { useUser } from '@/hooks/useAuth'

// Configuration des icônes et labels pour chaque type de filtre
const FILTER_CONFIG: Record<string, { icon: any; label: string; color: string }> = {
  // Filtres communs
  start_date: { icon: Calendar, label: 'Date de début', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  end_date: { icon: Calendar, label: 'Date de fin', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  
  // Filtres des assignations
  assignment_id: { icon: Hash, label: 'ID Dossier', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  vehicle_id: { icon: Car, label: 'Véhicule', color: 'bg-red-100 text-red-700 border-red-300' },
  repairer_id: { icon: Wrench, label: 'Réparateur', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  insurer_id: { icon: Shield, label: 'Assureur', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  assignment_type_id: { icon: FileText, label: 'Type de mission', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  expertise_type_id: { icon: FileCheck, label: 'Type d\'expertise', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  claim_nature_id: { icon: AlertCircle, label: 'Nature du sinistre', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  opened_by: { icon: User, label: 'Créé par', color: 'bg-green-100 text-green-700 border-green-300' },
  edited_by: { icon: Edit, label: 'Modifié par', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  realized_by: { icon: Play, label: 'Réalisé par', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  directed_by: { icon: Target, label: 'Dirigé par', color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
  validated_by: { icon: CheckCircle, label: 'Validé par', color: 'bg-green-100 text-green-700 border-green-300' },
  status_id: { icon: CheckCircle, label: 'Statut', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  
  // Filtres des paiements
  payment_id: { icon: Hash, label: 'ID Paiement', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  payment_method_id: { icon: CreditCard, label: 'Méthode de paiement', color: 'bg-green-100 text-green-700 border-green-300' },
  payment_type_id: { icon: CreditCard, label: 'Type de paiement', color: 'bg-green-100 text-green-700 border-green-300' },
  bank_id: { icon: Building, label: 'Banque', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  client_id: { icon: User, label: 'Client', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  
  // Filtres des factures
  invoice_id: { icon: Hash, label: 'ID Facture', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  payment_status_id: { icon: CheckCircle, label: 'Statut de paiement', color: 'bg-green-100 text-green-700 border-green-300' },
}

// Clés de stockage localStorage
const STORAGE_KEYS = {
  STATISTICS_TYPE: 'statistics_type',
  STATISTICS_FILTERS: 'statistics_filters',
  STATISTICS_DATES: 'statistics_dates'
}

export default function StatisticsPage() {
  const user = useUser()
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [selectedType, setSelectedType] = useState<StatisticsType>('assignments')
  
  const { 
    statistics, 
    loading, 
    error,
    currentType,
    fetchStatistics, 
    clearStatistics,
    clearError,
    setCurrentType,
    downloadExport
  } = useStatisticsStore()

  // Définir les rôles autorisés pour voir toutes les statistiques
  const authorizedRoles = useMemo(() => [UserRole.SYSTEM_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT_MANAGER, UserRole.ACCOUNTANT], [])
  const hasFullAccess = useMemo(() => 
    user?.role && authorizedRoles.includes(user.role as unknown as UserRole), 
    [user?.role, authorizedRoles]
  )
  
  // Types de statistiques disponibles selon le rôle
  const availableTypes: StatisticsType[] = useMemo(() => 
    hasFullAccess 
      ? ['assignments', 'payments', 'invoices'] 
      : ['assignments'],
    [hasFullAccess]
  )

  const getDefaultFilters = useCallback((): StatisticsFilters => {
    const baseFilters = {
      start_date: startDate ? startDate.toISOString().split('T')[0] : '',
      end_date: endDate ? endDate.toISOString().split('T')[0] : ''
    }

    switch (selectedType) {
      case 'assignments':
        return {
          ...baseFilters,
          assignment_id: undefined,
          vehicle_id: undefined,
          repairer_id: undefined,
          insurer_id: undefined,
          assignment_type_id: undefined,
          expertise_type_id: undefined,
          claim_nature_id: undefined,
          opened_by: undefined,
          edited_by: undefined,
          realized_by: undefined,
          directed_by: undefined,
          validated_by: undefined,
          status_id: undefined,
        } as AssignmentStatisticsFilters

      case 'payments':
        return {
          ...baseFilters,
          payment_id: undefined,
          payment_method_id: undefined,
          payment_type_id: undefined,
          bank_id: undefined,
          client_id: undefined,
          assignment_id: undefined,
          opened_by: undefined,
          status_id: undefined,
        } as PaymentStatisticsFilters

      case 'invoices':
        return {
          ...baseFilters,
          invoice_id: undefined,
          client_id: undefined,
          assignment_id: undefined,
          payment_status_id: undefined,
          opened_by: undefined,
          status_id: undefined,
        } as InvoiceStatisticsFilters

      default:
        return baseFilters
    }
  }, [selectedType, startDate, endDate])

  const [filters, setFilters] = useState<StatisticsFilters>(getDefaultFilters())

  // Charger les filtres sauvegardés
  const loadSavedFilters = useCallback(() => {
    try {
      // Charger le type de statistique
      const savedType = localStorage.getItem(STORAGE_KEYS.STATISTICS_TYPE)
      if (savedType && ['assignments', 'payments', 'invoices'].includes(savedType)) {
        setSelectedType(savedType as StatisticsType)
      }

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
        if (filters[selectedType]) {
          setFilters(filters[selectedType])
        }
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des filtres sauvegardés:', error)
    }
  }, [selectedType])

  // Sauvegarder les filtres
  const saveFilters = useCallback(() => {
    try {
      // Sauvegarder le type
      localStorage.setItem(STORAGE_KEYS.STATISTICS_TYPE, selectedType)

      // Sauvegarder les dates
      localStorage.setItem(STORAGE_KEYS.STATISTICS_DATES, JSON.stringify({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      }))

      // Sauvegarder les filtres avancés par type
      const savedFilters = localStorage.getItem(STORAGE_KEYS.STATISTICS_FILTERS)
      const allFilters = savedFilters ? JSON.parse(savedFilters) : {}
      allFilters[selectedType] = filters
      localStorage.setItem(STORAGE_KEYS.STATISTICS_FILTERS, JSON.stringify(allFilters))
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des filtres:', error)
    }
  }, [selectedType, startDate, endDate, filters])

  // Synchroniser le type sélectionné avec le store
  useEffect(() => {
    if (currentType !== selectedType) {
      setCurrentType(selectedType)
    }
  }, [selectedType, currentType, setCurrentType])

  // S'assurer que le type sélectionné est valide selon le rôle
  useEffect(() => {
    if (!availableTypes.includes(selectedType)) {
      setSelectedType('assignments')
    }
  }, [selectedType, availableTypes])

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
  }, [filters, selectedType, startDate, endDate, saveFilters])

  // Mettre à jour les filtres quand le type change
  useEffect(() => {
    setFilters(getDefaultFilters())
    clearStatistics()
  }, [selectedType, clearStatistics, getDefaultFilters])

  const handleSearch = () => {
    triggerSearch()
  }

  const handleAdvancedFiltersChange = (newFilters: StatisticsFilters) => {
    setFilters(newFilters)
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
    localStorage.removeItem(STORAGE_KEYS.STATISTICS_TYPE)
    
    // Nettoyer l'URL
    try {
      const url = new URL(window.location.href)
      const searchParams = url.searchParams
      
      // Supprimer tous les paramètres
      searchParams.delete('type')
      searchParams.delete('start_date')
      searchParams.delete('end_date')
      
      // Supprimer tous les filtres avancés
      Object.keys(FILTER_CONFIG).forEach(key => {
        searchParams.delete(key)
      })
      
      // Mettre à jour l'URL
      window.history.replaceState({}, '', url.toString())
    } catch (error) {
      console.warn('Erreur lors du nettoyage de l\'URL:', error)
    }
  }

  const handleTypeChange = (newType: StatisticsType) => {
    setSelectedType(newType)
    clearStatistics()
    
    // Si des dates sont définies, déclencher automatiquement la recherche
    if (startDate && endDate) {
      setTimeout(() => {
        const updatedFilters = {
          ...filters,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        }
        fetchStatistics(newType, updatedFilters)
      }, 100)
    }
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
        fetchStatistics(selectedType, updatedFilters)
      }, 100) // Petit délai pour laisser le state se mettre à jour
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
        fetchStatistics(selectedType, updatedFilters)
      }, 100)
    }
  }

  const getActiveFiltersCount = () => {
    const baseFilters = ['start_date', 'end_date']
    const allKeys = Object.keys(filters)
    return allKeys.filter(key => 
      !baseFilters.includes(key) && 
      filters[key as keyof StatisticsFilters] !== undefined &&
      filters[key as keyof StatisticsFilters] !== null
    ).length
  }

  const hasActiveFilters = getActiveFiltersCount() > 0
  const canSearch = startDate && endDate

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

  // Fonction pour mettre à jour l'URL avec les filtres actuels
  const updateURL = useCallback((filters: StatisticsFilters, type: StatisticsType, startDate?: Date, endDate?: Date) => {
    try {
      const url = new URL(window.location.href)
      const searchParams = url.searchParams
      
      // Supprimer tous les paramètres existants
      searchParams.delete('type')
      searchParams.delete('start_date')
      searchParams.delete('end_date')
      
      // Supprimer tous les filtres avancés
      Object.keys(filters).forEach(key => {
        if (key !== 'start_date' && key !== 'end_date') {
          searchParams.delete(key)
        }
      })
      
      // Ajouter le type de statistique
      searchParams.set('type', type)
      
      // Ajouter les dates
      if (startDate) {
        searchParams.set('start_date', startDate.toISOString().split('T')[0])
      }
      if (endDate) {
        searchParams.set('end_date', endDate.toISOString().split('T')[0])
      }
      
      // Ajouter les filtres avancés
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && key !== 'start_date' && key !== 'end_date') {
          searchParams.set(key, value.toString())
        }
      })
      
      // Mettre à jour l'URL sans recharger la page
      window.history.replaceState({}, '', url.toString())
    } catch (error) {
      console.warn('Erreur lors de la mise à jour de l\'URL:', error)
    }
  }, [])

  // Fonction pour charger les filtres depuis l'URL
  const loadFiltersFromURL = useCallback(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      
      // Charger le type depuis l'URL
      const typeParam = urlParams.get('type')
      if (typeParam && ['assignments', 'payments', 'invoices'].includes(typeParam)) {
        setSelectedType(typeParam as StatisticsType)
      }
      
      // Charger les dates depuis l'URL
      const startDateParam = urlParams.get('start_date')
      const endDateParam = urlParams.get('end_date')
      
      if (startDateParam) {
        setStartDate(new Date(startDateParam))
      }
      if (endDateParam) {
        setEndDate(new Date(endDateParam))
      }
      
      // Charger les filtres avancés depuis l'URL
      const urlFilters: any = {}
      Object.keys(FILTER_CONFIG).forEach(key => {
        const value = urlParams.get(key)
        if (value) {
          // Convertir les IDs en nombres
          if (key.endsWith('_id')) {
            urlFilters[key] = Number(value)
          } else {
            urlFilters[key] = value
          }
        }
      })
      
      if (Object.keys(urlFilters).length > 0) {
        setFilters(prev => ({ ...prev, ...urlFilters }))
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des filtres depuis l\'URL:', error)
    }
  }, [])

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
    fetchStatistics(selectedType, updatedFilters)
  }, [startDate, endDate, filters, selectedType, fetchStatistics])

  // Charger les filtres depuis l'URL au montage
  useEffect(() => {
    loadFiltersFromURL()
  }, [loadFiltersFromURL])

  // Mettre à jour l'URL quand les filtres changent
  useEffect(() => {
    updateURL(filters, selectedType, startDate, endDate)
  }, [filters, selectedType, startDate, endDate, updateURL])

  // Écouter les changements d'URL (navigation, bouton retour, etc.)
  useEffect(() => {
    const handlePopState = () => {
      loadFiltersFromURL()
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [loadFiltersFromURL])

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

  return (
      // <RequireAnyRoleGate
      //   roles={[UserRole.SYSTEM_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT_MANAGER, UserRole.ACCOUNTANT]}
      //   fallback={<ForbiddenError />}
    // >
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
              <h1 className="text-2xl font-bold tracking-tight">Statistiques 
                {!hasFullAccess && <span> des dossiers</span>}
                </h1>
                <p className="text-muted-foreground">
                  Analysez les performances et les tendances de vos données
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

            {/* Message d'information sur les permissions */}
            {/* {!hasFullAccess && (
              <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Accès limité aux statistiques
                    </span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Votre rôle vous permet uniquement de consulter les statistiques des dossiers d'expertise.
                    Pour accéder aux statistiques des paiements et factures, contactez votre administrateur.
                  </p>
                </CardContent>
              </Card>
            )} */}

          {/* Sélecteur de type de statistique */}
          {hasFullAccess && <StatisticsTypeSelector
              selectedType={selectedType}
              onTypeChange={handleTypeChange}
              availableTypes={availableTypes}
            />
          }
            

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
                      type={selectedType}
                      filters={filters}
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
                type={selectedType}
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
                    Sélectionnez un type de statistique, définissez une période et cliquez sur Rechercher pour afficher les données.
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
      // </RequireAnyRoleGate>
  )
} 