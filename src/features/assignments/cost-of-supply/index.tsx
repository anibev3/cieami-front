import { useState, useEffect, useMemo } from 'react'
import { useSupplyPricesStore, useSuppliesStore } from '@/stores/supplies'
import { SupplyPrice, SupplyPriceRequest } from '@/types/supplies'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Calculator, 
  Loader2
} from 'lucide-react'
import { DatePicker } from '@/features/widgets/date-picker'
import { BrandSelect } from '@/features/widgets'
import { VehicleModelSelect } from './components/vehicle-model-select'
import { SupplySelect } from './components/supply-select'

import { DataTable } from './components/data-table'
import { createColumns } from './components/columns'
import { SupplyPriceDetailModal } from './components/supply-price-detail-modal'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function CostOfSupplyPageContent() {
  const { supplyPrices, loading, fetchSupplyPrices } = useSupplyPricesStore()
  const { fetchSupplies } = useSuppliesStore()
  
  const [formData, setFormData] = useState<SupplyPriceRequest>({
    vehicle_model_id: '',
    supply_id: null,
    date: null
  })

  const [selectedBrandId, setSelectedBrandId] = useState<string>('')
  const [selectedResult, setSelectedResult] = useState<SupplyPrice | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

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

  // Réinitialiser le modèle quand la marque change
  useEffect(() => {
    if (selectedBrandId !== '') {
      setFormData(prev => ({ ...prev, vehicle_model_id: '', supply_id: null }))
    }
  }, [selectedBrandId])

  // Réinitialiser la fourniture quand le modèle change
  useEffect(() => {
    if (formData.vehicle_model_id !== '') {
      setFormData(prev => ({ ...prev, supply_id: null }))
    }
  }, [formData.vehicle_model_id])

  const handleSearch = async () => {
    if (!formData.vehicle_model_id) {
      toast.error('Veuillez sélectionner un modèle de véhicule')
      return
    }
    if (!formData.supply_id) {
      toast.error('Veuillez sélectionner une fourniture')
      return
    }
    await fetchSupplyPrices(formData)
  }

  const handleViewDetails = (supplyPrice: SupplyPrice) => {
    setSelectedResult(supplyPrice)
    setDetailModalOpen(true)
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
        const hasObsolescence = supplyPrice.obsolescence_rate ? parseFloat(supplyPrice.obsolescence_rate) > 0 : false
        const hasRecovery = supplyPrice.recovery_amoun ? parseFloat(supplyPrice.recovery_amoun) > 0 : false
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

  const _clearFilters = () => {
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
          <Card className="shadow-none border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Marque
                  </label>
                  <BrandSelect
                    value={selectedBrandId}
                    onValueChange={setSelectedBrandId}
                    placeholder="Sélectionnez une marque"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Modèle de véhicule
                  </label>
                  <VehicleModelSelect
                    value={formData.vehicle_model_id}
                    onValueChange={(value) => setFormData({ ...formData, vehicle_model_id: value })}
                    placeholder="Sélectionnez un modèle..."
                    brandId={selectedBrandId}
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
                    vehicleModelId={formData.vehicle_model_id}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    À partir de
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
                    disabled={loading || !formData.vehicle_model_id || !formData.supply_id}
                    className="w-full h-10  hover:from-blue-700 hover:to-indigo-700  transition-all duration-200"
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
        {/* Filtres avancés */}
        {/* <div className="mb-6">
          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div> */}

        {/* Data Table */}
        <DataTable
          columns={createColumns(handleViewDetails)}
          data={filteredSupplyPrices}
          loading={loading}
          searchPlaceholder="Rechercher une fourniture..."
          title="Résultats de recherche"
          description={`${filteredSupplyPrices.length} fourniture(s) trouvée(s)`}
        />

        {/* Modal de détails */}
        <SupplyPriceDetailModal
          supplyPrice={selectedResult}
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
        />
      </Main>
    </>
  )
}

export default function CostOfSupplyPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_ASSIGNMENT}>
      <CostOfSupplyPageContent />
    </ProtectedRoute>
  )
}