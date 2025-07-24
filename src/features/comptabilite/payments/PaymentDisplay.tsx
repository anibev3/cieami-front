import { useEffect } from 'react'
import { usePaymentStore } from '@/stores/paymentStore'
import { Payment } from '@/types/comptabilite'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { PaymentDataTable } from './payment-data-table'
import { createPaymentColumns } from './payment-columns'

interface PaymentsPageProps {
  onButtonClick?: () => void
}

export default function PaymentsPage({ onButtonClick }: PaymentsPageProps) {
  const navigate = useNavigate()
  const {
    payments,
    fetchPayments,
    deletePayment
  } = usePaymentStore()

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const handleDelete = async (id: number) => {
    try {
      await deletePayment(id)
    } catch (_error) {
      // Error handled by store
    }
  }

  const handleCreateClick = () => {
    navigate({ to: '/comptabilite/payment/create' })
    onButtonClick?.()
  }

  const handleEditClick = (payment: Payment) => {
    navigate({ to: `/comptabilite/payment/edit/${payment.id}` })
  }

  const columns = createPaymentColumns({
    onEdit: handleEditClick,
    onDelete: handleDelete
  })

  return (
    <div className="space-y-6 h-full w-full overflow-y-auto pb-6">
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Paiements</h3>
          <p className='text-muted-foreground text-sm'>Gérez tous les paiements et transactions financières.</p>
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
        onRefresh={fetchPayments}
      />
    </div>
  )
} 