import { ColumnDef } from '@tanstack/react-table'
import { Receipt } from '@/types/administration'
import { Badge } from '@/components/ui/badge'
import { Calendar, Receipt as ReceiptIcon } from 'lucide-react'
import { formatCurrency } from '@/utils/format-currency'
import { ReceiptActions } from './receipt-actions'

interface ColumnsProps {
  onView: (receipt: Receipt) => void
  onEdit: (receipt: Receipt) => void
  onDelete: (receipt: Receipt) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnsProps): ColumnDef<Receipt>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-sm">{row.getValue('id')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'receipt_type',
    header: 'Type de quittance',
    cell: ({ row }) => {
      const receiptType = row.getValue('receipt_type') as Receipt['receipt_type']
      return (
        <div className="flex items-center space-x-2">
          {/* <Tag className="h-4 w-4 text-muted-foreground" /> */}
          <div>
            <div className="font-medium">{receiptType.label}</div>
            <div className="text-xs text-muted-foreground">{receiptType.code}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'amount_excluding_tax',
    header: 'Montant HT',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount_excluding_tax'))
      return (
        <div className="flex items-center space-x-2">
          {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
          <span className="font-mono text-sm">{formatCurrency(amount)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'amount_tax',
    header: 'TVA',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount_tax'))
      return (
        <div className="flex items-center space-x-2">
          {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
          <span className="font-mono text-sm">{formatCurrency(amount)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'Montant TTC',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      return (
        <div className="flex items-center space-x-2">
          {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
          <span className="font-mono text-sm font-semibold">{formatCurrency(amount)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.getValue('status') as Receipt['status']
      const getStatusVariant = (code: string) => {
        switch (code) {
          case 'active': return 'default'
          case 'inactive': return 'secondary'
          case 'pending': return 'outline'
          default: return 'secondary'
        }
      }
      return (
        <Badge variant={getStatusVariant(status.code)}>
          {status.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Créé le',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{date.toLocaleDateString('fr-FR')}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <ReceiptActions
        receipt={row.original}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
]
