import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { usePaymentStore } from '@/stores/paymentStore'
import { Payment } from '@/types/comptabilite'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { DateRangePicker } from '@/components/ui/range-calendar/date-range-picker'
// import { AssignmentSelect } from '@/features/widgets/AssignmentSelect'
import { PaymentTypeSelect } from '@/features/widgets/payment-type-select'
import { PaymentMethodSelect } from '@/features/widgets/payment-method-select'
import { Plus, Filter, X } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { PaymentDataTable } from './payment-data-table'
import { createPaymentColumns } from './payment-columns'
import { Pagination } from './components/Pagination'
import { Main } from '@/components/layout/main'
import { Badge } from '@/components/ui/badge'

interface PaymentsPageProps {
  onButtonClick?: () => void
}

export default function PaymentsPage({ onButtonClick }: PaymentsPageProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  // const [selectedAssignment, setSelectedAssignment] = useState<string>('')
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null
  })
  const isMountedRef = useRef(true)
  const {
    payments,
    loading,
    currentPage,
    totalPages,
    totalItems,
    perPage,
    hasNextPage,
    hasPrevPage,
    totalAmount,
    exportUrl,
    fetchPayments,
    deletePayment
  } = usePaymentStore()

  // Fonction stable pour charger les paiements (non utilisée pour l'instant)
  // const loadPayments = useCallback((page: number, size: number, search: string) => {
  //   if (isMountedRef.current && !loading) {
  //     fetchPayments(page, size, search)
  //   }
  // }, [fetchPayments, loading])

  // Effet de montage/démontage
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Effet pour charger les données initiales seulement
  useEffect(() => {
    if (isMountedRef.current) {
      fetchPayments(currentPage, perPage, searchQuery)
    }
  }, []) // Déclenché seulement au montage

  // Effet séparé pour la recherche
  useEffect(() => {
    if (isMountedRef.current && searchQuery !== undefined) {
      // Délai pour éviter trop d'appels API pendant la saisie
      const timeoutId = setTimeout(() => {
        fetchPayments(1, perPage, searchQuery)
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [searchQuery, perPage, fetchPayments])

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deletePayment(id)
      // Recharger la page actuelle après suppression
      if (isMountedRef.current) {
        fetchPayments(currentPage, perPage, searchQuery)
      }
    } catch (_error) {
      // Error handled by store
    }
  }, [deletePayment, currentPage, perPage, searchQuery, fetchPayments])

  const handleCreateClick = useCallback(() => {
    navigate({ to: '/comptabilite/payment/create' })
    onButtonClick?.()
  }, [navigate, onButtonClick])

  const handleEditClick = useCallback((payment: Payment) => {
    navigate({ to: `/comptabilite/payment/edit/${payment.id}` })
  }, [navigate])

  const handleViewClick = useCallback((payment: Payment) => {
    navigate({ to: `/comptabilite/payment-detail/${payment.id}` })
  }, [navigate])

  const handlePageChange = useCallback((page: number) => {
    // Appel direct de l'API au lieu d'utiliser setPage qui déclenche un useEffect
    fetchPayments(page, perPage, searchQuery)
  }, [fetchPayments, perPage, searchQuery])

  const handlePerPageChange = useCallback((newPerPage: number) => {
    // Appel direct de l'API au lieu d'utiliser setPerPage qui déclenche un useEffect
    fetchPayments(1, newPerPage, searchQuery)
  }, [fetchPayments, searchQuery])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    // Retour à la première page lors d'une nouvelle recherche
    fetchPayments(1, perPage, query)
  }, [fetchPayments, perPage])

  const handleRefresh = useCallback(() => {
    if (isMountedRef.current) {
      fetchPayments(currentPage, perPage, searchQuery)
    }
  }, [currentPage, perPage, searchQuery, fetchPayments])

  const clearFilters = () => {
    setSearchQuery('')
    // setSelectedAssignment('')
    setSelectedPaymentType('')
    setSelectedPaymentMethod('')
    setDateRange({ from: null, to: null })
    // Recharger les données sans filtres
    fetchPayments(1, perPage, '')
  }

  // const handleAssignmentChange = useCallback((assignmentId: string) => {
  //   setSelectedAssignment(assignmentId)
  //   // Recharger les données avec le nouveau filtre
  //   const filters = {
  //     search: searchQuery,
  //     assignment_id: assignmentId || undefined,
  //     payment_type_id: selectedPaymentType || undefined,
  //     payment_method_id: selectedPaymentMethod || undefined,
  //     start_date: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
  //     end_date: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined
  //   }
  //   fetchPayments(1, perPage, searchQuery, filters)
  // }, [searchQuery, selectedPaymentType, selectedPaymentMethod, dateRange, fetchPayments])

  const handlePaymentTypeChange = useCallback((typeId: string) => {
    setSelectedPaymentType(typeId)
    // Recharger les données avec le nouveau filtre
    const filters = {
      search: searchQuery,
      //  assignment_id: selectedAssignment || undefined,
      payment_type_id: typeId || undefined,
      payment_method_id: selectedPaymentMethod || undefined,
      start_date: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
      end_date: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined
    }
    fetchPayments(1, perPage, searchQuery, filters)
  }, [searchQuery, selectedPaymentMethod, dateRange, fetchPayments])

  const handlePaymentMethodChange = useCallback((methodId: string) => {
    setSelectedPaymentMethod(methodId)
    // Recharger les données avec le nouveau filtre
    const filters = {
      search: searchQuery,
      // assignment_id: selectedAssignment || undefined,
      payment_type_id: selectedPaymentType || undefined,
      payment_method_id: methodId || undefined,
      start_date: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
      end_date: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined
    }
    fetchPayments(1, perPage, searchQuery, filters)
  }, [searchQuery, selectedPaymentType, dateRange, fetchPayments])

  const handleDateRangeChange = useCallback((values: { range: { from: Date; to: Date | undefined }; rangeCompare?: { from: Date; to: Date | undefined } }) => {
    setDateRange({
      from: values.range.from,
      to: values.range.to || null
    })
    // Recharger les données avec le nouveau filtre de dates
    const filters = {
      search: searchQuery,
      // assignment_id: selectedAssignment || undefined,
      payment_type_id: selectedPaymentType || undefined,
      payment_method_id: selectedPaymentMethod || undefined,
      start_date: values.range.from.toISOString().split('T')[0],
      end_date: values.range.to ? values.range.to.toISOString().split('T')[0] : undefined
    }
    fetchPayments(1, perPage, searchQuery, filters)
  }, [searchQuery, selectedPaymentType, selectedPaymentMethod, fetchPayments])

  const columns = useMemo(() => createPaymentColumns({
    onDelete: handleDelete,
    onView: handleViewClick
  }), [handleDelete, handleViewClick])

  return (
    <>
      <Main>
        <div className="space-y-6 h-full w-full overflow-y-auto pb-6">
          {/* Header */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex flex-col gap-2'>
              <h3 className='text-lg font-bold'>Paiements</h3>
              <p className='text-muted-foreground text-sm'>
                Gérez tous les paiements et transactions financières.
              </p>
            </div>

            <div className='flex items-center gap-2'>
              <DateRangePicker
                      initialDateFrom={dateRange.from || undefined}
                      initialDateTo={dateRange.to || undefined}
                      onUpdate={handleDateRangeChange}
                      showCompare={false}
                      className="w-full"
                    />
              {/* Filtres avancés */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 bg-white/50 backdrop-blur-sm border-gray-200/60 hover:bg-gray-50/80"
                  >
                    <Filter className="h-4 w-4" />
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
                    
                    {/* Section Dossier */}
                    {/* <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <Label className="text-sm font-semibold text-gray-900">Dossier</Label>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-700">Sélectionner un dossier</Label>
                        <AssignmentSelect
                          value={selectedAssignment}
                          onValueChange={handleAssignmentChange}
                          placeholder="Sélectionner un dossier..."
                        />
                      </div>
                    </div> */}

                    {/* <Separator className="my-3" /> */}

                    {/* Section Type de paiement */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <Label className="text-sm font-semibold text-gray-900">Type de paiement</Label>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-700">Choisir le type</Label>
                        <PaymentTypeSelect
                          value={selectedPaymentType}
                          onValueChange={handlePaymentTypeChange}
                          placeholder="Sélectionner un type..."
                        />
                      </div>
                    </div>

                    <Separator className="my-3" />

                    {/* Section Méthode de paiement */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <Label className="text-sm font-semibold text-gray-900">Méthode de paiement</Label>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-700">Choisir la méthode</Label>
                        <PaymentMethodSelect
                          value={selectedPaymentMethod}
                          onValueChange={handlePaymentMethodChange}
                          placeholder="Sélectionner une méthode..."
                        />
                      </div>
                    </div>

                    <Separator className="my-3" />

                    {/* Section Période */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
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
                  </div>
                </SheetContent>
              </Sheet>
              <Button onClick={handleCreateClick}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau paiement
              </Button>
            </div>
          </div>

          {/* DataTable */}
          <PaymentDataTable
            data={payments}
            columns={columns}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onRefresh={handleRefresh}
            loading={loading}
            onSearch={handleSearch}
            totalAmount={totalAmount}
            totalItems={totalItems}
            exportUrl={exportUrl}
          />

          {/* Affichage des filtres actifs */}
          {(selectedPaymentType || selectedPaymentMethod || dateRange.from || dateRange.to) && (
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Filtres actifs:</span>
              {/* {selectedAssignment && (
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  📁 Dossier sélectionné
                  <button
                    onClick={() => setSelectedAssignment('')}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )} */}
              {selectedPaymentType && (
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  💳 Type sélectionné
                  <button
                    onClick={() => setSelectedPaymentType('')}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedPaymentMethod && (
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                  🏦 Méthode sélectionnée
                  <button
                    onClick={() => setSelectedPaymentMethod('')}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {dateRange.from && (
                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                  📅 {dateRange.from.toLocaleDateString('fr-FR')}
                  {dateRange.to && ` - ${dateRange.to.toLocaleDateString('fr-FR')}`}
                  <button
                    onClick={() => setDateRange({ from: null, to: null })}
                    className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}



          {/* Pagination avancée */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            perPage={perPage}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            loading={loading}
          />
        </div>
      </Main>
    </>
  )
} 