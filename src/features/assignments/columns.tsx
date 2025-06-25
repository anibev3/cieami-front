import { ColumnDef } from '@tanstack/react-table'
import { Assignment } from '@/types/assignments'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Receipt, Car, User, FileText, ExternalLink } from 'lucide-react'
import { formatDate } from '@/utils/format-date'
import { formatCurrency } from '@/utils/format-currency'
import { AssignmentActions } from './components/assignment-actions'

interface ColumnsProps {
  onDelete: (assignment: Assignment) => void
  onOpenReceiptModal: (assignmentId: number, amount: number) => void
  onViewDetail: (assignmentId: number) => void
}

export const createColumns = ({ onDelete, onOpenReceiptModal, onViewDetail }: ColumnsProps): ColumnDef<Assignment>[] => [
  {
    accessorKey: 'reference',
    header: 'Référence',
    cell: ({ row }) => {
      const assignment = row.original
      return (
        <button
          onClick={() => onViewDetail(assignment.id)}
          className="flex items-center gap-2 font-medium text-primary hover:text-primary/80 hover:underline transition-colors bg-transparent border-none cursor-pointer text-left"
        >
          {row.getValue('reference')}
          <ExternalLink className="h-3 w-3" />
        </button>
      )
    },
  },
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row }) => {
      const client = row.getValue('client') as Assignment['client']
      return (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{client.name}</div>
            <div className="text-sm text-muted-foreground">{client.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'vehicle',
    header: 'Véhicule',
    cell: ({ row }) => {
      const vehicle = row.getValue('vehicle') as Assignment['vehicle']
      return (
        <div className="flex items-center space-x-2">
          <Car className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{vehicle.license_plate}</div>
            <div className="text-sm text-muted-foreground">
              {/* {vehicle.brand.label} {vehicle.vehicle_model.label} */}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'assignment_type',
    header: 'Type',
    cell: ({ row }) => {
      const assignmentType = row.getValue('assignment_type') as Assignment['assignment_type']
      return (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{assignmentType.label}</div>
            <div className="text-sm text-muted-foreground">{assignmentType.code}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'expert',
    header: 'Expert',
    cell: ({ row }) => {
      const expert = row.getValue('expert') as Assignment['expert']
      return (
        <div>
          {expert ? (
            <>
              <div className="font-medium">{expert.name}</div>
              <div className="text-sm text-muted-foreground">{expert.email}</div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Non assigné</div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'Montant',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number
      return (
        <div className="font-medium text-green-600">
          {formatCurrency(amount)}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.getValue('status') as Assignment['status']
      const getStatusVariant = (code: string) => {
        switch (code) {
          case 'active':
          case 'opened':
            return 'default'
          case 'realized':
          case 'edited':
          case 'corrected':
            return 'secondary'
          case 'closed':
          case 'in_payment':
            return 'outline'
          case 'paid':
            return 'default'
          case 'inactive':
          case 'cancelled':
          case 'deleted':
            return 'destructive'
          default:
            return 'outline'
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
    accessorKey: 'receipts',
    header: 'Quittances',
    cell: ({ row }) => {
      const receipts = row.getValue('receipts') as Assignment['receipts'] || []
      const totalReceipts = receipts.reduce((sum, receipt) => sum + receipt.amount, 0)
      const assignment = row.original
      
      return (
        <div className="flex items-center space-x-2">
          <div className="text-sm">
            <div className="font-medium">{formatCurrency(totalReceipts)}</div>
            <div className="text-muted-foreground">{receipts.length} quittance(s)</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenReceiptModal(assignment.id, assignment.amount)}
            className="h-8 w-8 p-0"
          >
            <Receipt className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Créé le',
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {formatDate(row.getValue('created_at'))}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const assignment = row.original

      return (
        <AssignmentActions
          assignment={assignment}
          onDelete={onDelete}
          onOpenReceiptModal={onOpenReceiptModal}
          onViewDetail={onViewDetail}
        />
      )
    },
  },
] 