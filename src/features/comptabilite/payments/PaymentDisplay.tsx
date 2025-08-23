import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { usePaymentStore } from '@/stores/paymentStore'
import { Payment } from '@/types/comptabilite'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { PaymentDataTable } from './payment-data-table'
import { createPaymentColumns } from './payment-columns'
import { Pagination } from './components/Pagination'
import { Main } from '@/components/layout/main'

interface PaymentsPageProps {
  onButtonClick?: () => void
}

export default function PaymentsPage({ onButtonClick }: PaymentsPageProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
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
          />

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