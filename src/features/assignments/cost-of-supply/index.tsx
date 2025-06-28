import { useState, useEffect, useMemo } from 'react'
import { useSupplyPricesStore, useSuppliesStore } from '@/stores/supplies'
import { SupplyPrice, SupplyPriceRequest } from '@/types/supplies'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Calculator, 
  Eye, 
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { DatePicker } from '@/features/comptabilite/payments/components/date-picker'
import { VehicleModelSelect } from './components/vehicle-model-select'
import { SupplySelect } from './components/supply-select'
import { AdvancedFilters } from './components/advanced-filters'
import { SupplyPriceResults } from './components/supply-price-results'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

export default function CostOfSupplyPage() {
  const { supplyPrices, loading, fetchSupplyPrices } = useSupplyPricesStore()
  const { fetchSupplies } = useSuppliesStore()
  
  const [formData, setFormData] = useState<SupplyPriceRequest>({
    vehicle_model_id: '',
    supply_id: null,
    date: null
  })

  const [selectedResult, setSelectedResult] = useState<SupplyPrice | null>(null)
  const [selectedSupplyId, setSelectedSupplyId] = useState<number | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Filtres avancés
  const [filters, setFilters] = useState({
    search: '',
    priceRange: {
      min: '',
      max: ''
    },
    operations: {
      disassembly: false,
      replacement: false,
      repair: false,
      paint: false,
      control: false
    },
    status: {
      new: false,
      obsolete: false,
      recovery: false,
      standard: false
    }
  })

  useEffect(() => {
    fetchSupplies()
  }, [fetchSupplies])

  const handleSearch = async () => {
    if (!formData.vehicle_model_id) {
      toast.error('Veuillez sélectionner un modèle de véhicule')
      return
    }
    await fetchSupplyPrices(formData)
  }

  const handleResultClick = (supplyPrice: SupplyPrice) => {
    setSelectedResult(supplyPrice)
    setSelectedSupplyId(supplyPrice.supply.id)
  }

  const handleSupplyPriceSelect = (_price: SupplyPrice) => {
    // Optionnel : gérer la sélection d'un prix spécifique
    // console.log('Prix sélectionné:', price)
  }

  const formatCurrency = (amount: string) => {
    return parseFloat(amount).toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  const getStatusBadge = (supplyPrice: SupplyPrice) => {
    const hasNewPrice = parseFloat(supplyPrice.new_amount) > 0
    const hasObsolescence = parseFloat(supplyPrice.obsolescence_rate) > 0
    const hasRecovery = parseFloat(supplyPrice.recovery_rate) > 0

    if (hasNewPrice) return <Badge className="bg-green-100 text-green-800">Nouveau</Badge>
    if (hasObsolescence) return <Badge className="bg-red-100 text-red-800">Obsolète</Badge>
    if (hasRecovery) return <Badge className="bg-blue-100 text-blue-800">Récupération</Badge>
    return <Badge variant="secondary">Standard</Badge>
  }

  const getOperationIcons = (supplyPrice: SupplyPrice) => {
    const operations = []
    if (supplyPrice.disassembly) operations.push('Démontage')
    if (supplyPrice.replacement) operations.push('Remplacement')
    if (supplyPrice.repair) operations.push('Réparation')
    if (supplyPrice.paint) operations.push('Peinture')
    if (supplyPrice.control) operations.push('Contrôle')
    return operations
  }

  // Filtrage des résultats
  const filteredSupplyPrices = useMemo(() => {
    return supplyPrices.filter(supplyPrice => {
      // Filtre de recherche textuelle
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const supplyName = supplyPrice.supply.label.toLowerCase()
        if (!supplyName.includes(searchLower)) {
          return false
        }
      }

      // Filtre de plage de prix
      const price = parseFloat(supplyPrice.new_amount)
      if (filters.priceRange.min && price < parseFloat(filters.priceRange.min)) {
        return false
      }
      if (filters.priceRange.max && price > parseFloat(filters.priceRange.max)) {
        return false
      }

      // Filtre des opérations
      const hasOperationFilter = Object.values(filters.operations).some(Boolean)
      if (hasOperationFilter) {
        const operationMatches = 
          (filters.operations.disassembly && supplyPrice.disassembly) ||
          (filters.operations.replacement && supplyPrice.replacement) ||
          (filters.operations.repair && supplyPrice.repair) ||
          (filters.operations.paint && supplyPrice.paint) ||
          (filters.operations.control && supplyPrice.control)
        
        if (!operationMatches) {
          return false
        }
      }

      // Filtre des statuts
      const hasStatusFilter = Object.values(filters.status).some(Boolean)
      if (hasStatusFilter) {
        const hasNewPrice = parseFloat(supplyPrice.new_amount) > 0
        const hasObsolescence = parseFloat(supplyPrice.obsolescence_rate) > 0
        const hasRecovery = parseFloat(supplyPrice.recovery_rate) > 0
        const isStandard = !hasNewPrice && !hasObsolescence && !hasRecovery

        const statusMatches = 
          (filters.status.new && hasNewPrice) ||
          (filters.status.obsolete && hasObsolescence) ||
          (filters.status.recovery && hasRecovery) ||
          (filters.status.standard && isStandard)

        if (!statusMatches) {
          return false
        }
      }

      return true
    })
  }, [supplyPrices, filters])

  const clearFilters = () => {
    setFilters({
      search: '',
      priceRange: {
        min: '',
        max: ''
      },
      operations: {
        disassembly: false,
        replacement: false,
        repair: false,
        paint: false,
        control: false
      },
      status: {
        new: false,
        obsolete: false,
        recovery: false,
        standard: false
      }
    })
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
        <div className='mb-6'>
          <Card className="shadow-sm border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Recherche de prix
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Configurez les paramètres pour trouver les prix de fournitures
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Modèle de véhicule
                  </label>
                  <VehicleModelSelect
                    value={formData.vehicle_model_id}
                    onValueChange={(value) => setFormData({ ...formData, vehicle_model_id: value })}
                    placeholder="Sélectionnez un modèle..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Fourniture
                  </label>
                  <SupplySelect
                    value={formData.supply_id?.toString() || ''}
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      supply_id: value ? parseInt(value) : null 
                    })}
                    placeholder="Sélectionnez une fourniture..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Date
                  </label>
                  <DatePicker
                    value={formData.date || ''}
                    onValueChange={(date: string) => 
                      setFormData({ 
                        ...formData, 
                        date: date
                      })
                    }
                    placeholder="Sélectionnez une date..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 opacity-0">
                    Action
                  </label>
                  <Button 
                    onClick={handleSearch} 
                    disabled={loading || !formData.vehicle_model_id}
                    className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Recherche...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Rechercher
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex gap-3 h-full w-full">
          {/* Colonne 1: Formulaire */}
          {/* <div className="w-72 flex-shrink-0">
            <Card className="shadow-none px-2"> 
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Recherche de prix
                </CardTitle>
                <CardDescription>
                  Configurez les paramètres de recherche
                </CardDescription>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Modèle de véhicule *</label>
                  <VehicleModelSelect
                    value={formData.vehicle_model_id}
                    onValueChange={(value) => setFormData({ ...formData, vehicle_model_id: value })}
                    placeholder="Sélectionnez un modèle..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Fourniture (optionnel)</label>
                  <SupplySelect
                    value={formData.supply_id?.toString() || ''}
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      supply_id: value ? parseInt(value) : null 
                    })}
                    placeholder="Sélectionnez une fourniture..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date (optionnel)</label>
                  <DatePicker
                    value={formData.date || ''}
                    onValueChange={(date: string) => 
                      setFormData({ 
                        ...formData, 
                        date: date
                      })
                    }
                    placeholder="Sélectionnez une date..."
                  />
                </div>

                <Button 
                  onClick={handleSearch} 
                  disabled={loading || !formData.vehicle_model_id}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recherche...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Rechercher
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div> */}

          {/* Colonne 2: Résultats */}
          <div className="w-full">
            <Card className="h-full shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Résultats ({filteredSupplyPrices.length})
                  </div>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                </CardTitle>
                <CardDescription>
                  Cliquez sur un résultat pour voir les détails
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtres avancés */}
                <AdvancedFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                />

                <ScrollArea className="h-[calc(100vh-350px)] hidden-scrollbar">
                  <div className="space-y-3">
                    {filteredSupplyPrices.map((supplyPrice) => (
                      <Card 
                        key={supplyPrice.id} 
                        className={`cursor-pointer transition-all hover:shadow-md shadow-none ${
                          selectedResult?.id === supplyPrice.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handleResultClick(supplyPrice)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{supplyPrice.supply.label}</span>
                            </div>
                            {getStatusBadge(supplyPrice)}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Prix neuf:</span>
                              <div className="font-semibold text-green-600">
                                {formatCurrency(supplyPrice.new_amount)}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Taux de Vetusté:</span>
                              <div className="font-semibold text-red-600">
                                {parseFloat(supplyPrice.obsolescence_rate)}%
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1">
                            {getOperationIcons(supplyPrice).map((op, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {op}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {filteredSupplyPrices.length === 0 && !loading && (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucun résultat trouvé</p>
                        <p className="text-sm">Essayez de modifier vos critères de recherche ou vos filtres</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Colonne 3: Détails du prix */}
          <div className="w-full">
            <Card className="h-full shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Détails du prix
                </CardTitle>
                <CardDescription>
                  Informations détaillées du prix sélectionné
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedResult ? (
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-4">
                      {/* Informations de base */}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <span className="h-4 w-4" />
                          Fourniture
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Nom:</span>
                            <span className="font-medium">{selectedResult.supply.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ID:</span>
                            <span>{selectedResult.supply.id}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Opérations */}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Opérations
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            {selectedResult.disassembly ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span>Démontage</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedResult.replacement ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span>Remplacement</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedResult.repair ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span>Réparation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedResult.paint ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span>Peinture</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedResult.control ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span>Contrôle</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Prix neuf */}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Prix neuf
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">HT:</span>
                            <span className="font-medium">{formatCurrency(selectedResult.new_amount_excluding_tax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">TVA:</span>
                            <span className="font-medium">{formatCurrency(selectedResult.new_amount_tax)}</span>
                          </div>
                          <div className="flex justify-between text-base font-semibold text-green-600">
                            <span>TTC:</span>
                            <span>{formatCurrency(selectedResult.new_amount)}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Obsolescence */}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          Vetusté
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Taux:</span>
                            <span className="font-medium text-red-600">{selectedResult.obsolescence_rate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Montant HT:</span>
                            <span>{formatCurrency(selectedResult.obsolescence_amount_excluding_tax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Montant TTC:</span>
                            <span>{formatCurrency(selectedResult.obsolescence_amount)}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Récupération */}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          Récupération
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Taux:</span>
                            <span className="font-medium text-blue-600">{selectedResult.recovery_rate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Montant HT:</span>
                            <span>{formatCurrency(selectedResult.recovery_amount_excluding_tax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Montant TTC:</span>
                            <span>{formatCurrency(selectedResult.recovery_amount)}</span>
                          </div>
                        </div>
                      </div>

                      {selectedResult.comment && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Info className="h-4 w-4" />
                              Commentaire
                            </h4>
                            <p className="text-sm text-muted-foreground">{selectedResult.comment}</p>
                          </div>
                        </>
                      )}

                      <Separator />

                      {/* Informations système */}
                      <div>
                        <h4 className="font-semibold mb-2">Informations système</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Créé le:</span>
                            <span>{new Date(selectedResult.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Modifié le:</span>
                            <span>{new Date(selectedResult.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bouton pour voir plus de détails */}
                      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            Voir tous les détails
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Détails complets - {selectedResult.supply.label}</DialogTitle>
                            <DialogDescription>
                              Toutes les informations détaillées du prix de fourniture
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Contenu détaillé du modal */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-semibold mb-2">Informations de base</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">ID:</span>
                                    <span>{selectedResult.id}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fourniture:</span>
                                    <span>{selectedResult.supply.label}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">ID Fourniture:</span>
                                    <span>{selectedResult.supply.id}</span>
                                  </div>
                                </div>
                              </div>
                              <div className='border-l border-gray-200 pl-4'>
                                <h5 className="font-semibold mb-2">Opérations</h5>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Démontage:</span>
                                    <Badge variant={selectedResult.disassembly ? "default" : "secondary"}>
                                      {selectedResult.disassembly ? "Oui" : "Non"}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Remplacement:</span>
                                    <Badge variant={selectedResult.replacement ? "default" : "secondary"}>
                                      {selectedResult.replacement ? "Oui" : "Non"}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Réparation:</span>
                                    <Badge variant={selectedResult.repair ? "default" : "secondary"}>
                                      {selectedResult.repair ? "Oui" : "Non"}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Peinture:</span>
                                    <Badge variant={selectedResult.paint ? "default" : "secondary"}>
                                      {selectedResult.paint ? "Oui" : "Non"}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Contrôle:</span>
                                    <Badge variant={selectedResult.control ? "default" : "secondary"}>
                                      {selectedResult.control ? "Oui" : "Non"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <h5 className="font-semibold mb-2 text-green-600">Prix neuf</h5>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>HT:</span>
                                    <span className="font-medium">{formatCurrency(selectedResult.new_amount_excluding_tax)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>TVA:</span>
                                    <span className="font-medium">{formatCurrency(selectedResult.new_amount_tax)}</span>
                                  </div>
                                  <div className="flex justify-between font-semibold">
                                    <span>TTC:</span>
                                    <span>{formatCurrency(selectedResult.new_amount)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className='border-l border-gray-200 pl-4'>
                                <h5 className="font-semibold mb-2 text-red-600">Vetusté</h5>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Taux:</span>
                                    <span className="font-medium">{selectedResult.obsolescence_rate}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>HT:</span>
                                    <span>{formatCurrency(selectedResult.obsolescence_amount_excluding_tax)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>TTC:</span>
                                    <span>{formatCurrency(selectedResult.obsolescence_amount)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className='border-l border-gray-200 pl-4'>
                                <h5 className="font-semibold mb-2 text-blue-600">Récupération</h5>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Taux:</span>
                                    <span className="font-medium">{selectedResult.recovery_rate}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>HT:</span>
                                    <span>{formatCurrency(selectedResult.recovery_amount_excluding_tax)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>TTC:</span>
                                    <span>{formatCurrency(selectedResult.recovery_amount)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {selectedResult.comment && (
                              <>
                                <Separator />
                                <div>
                                  <h5 className="font-semibold mb-2">Commentaire</h5>
                                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                                    {selectedResult.comment}
                                  </p>
                                </div>
                              </>
                            )}

                            <Separator />

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <h5 className="font-semibold mb-2">Dates</h5>
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Créé le:</span>
                                    <span>{new Date(selectedResult.created_at).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Modifié le:</span>
                                    <span>{new Date(selectedResult.updated_at).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h5 className="font-semibold mb-2">Statut</h5>
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Supprimé:</span>
                                    <Badge variant={selectedResult.deleted_at ? "destructive" : "default"}>
                                      {selectedResult.deleted_at ? "Oui" : "Non"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Sélectionnez un résultat</p>
                    <p className="text-sm">pour voir les détails</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Colonne 4: Prix de la fourniture sélectionnée */}
          <div className="w-full">
            <SupplyPriceResults 
              supplyId={selectedSupplyId} 
              vehicleModelId={formData.vehicle_model_id}
              onSelectPrice={handleSupplyPriceSelect}
            />
          </div>
        </div>
      </Main>
    </>
  )
}