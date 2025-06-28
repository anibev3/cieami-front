import { ColumnDef } from '@tanstack/react-table'
import { Assignment } from '@/types/assignments'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
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
          {/* <User className="h-4 w-4 text-muted-foreground" /> */}
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
          {/* <Car className="h-4 w-4 text-muted-foreground" /> */}
          <div>
            <p className="font-medium">{vehicle.license_plate}</p>
            {/* <p className="text-sm text-muted-foreground">
              {vehicle.type} {vehicle.option}
            </p> */}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'insurer',
    header: 'Assureur',
    cell: ({ row }) => {
      const insurer = row.getValue('insurer') as Assignment['insurer']
      return (
        <div className="flex items-center justify-center space-x-2">
          {/* <Building className="h-4 w-4 text-muted-foreground" /> */}
          <div>
            <div className="font-medium">{insurer.name}</div>
            {/* <div className="text-sm text-muted-foreground">{insurer.code}</div> */}
          </div>
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'assignment_type',
  //   header: 'Type',
  //   cell: ({ row }) => {
  //     const assignmentType = row.getValue('assignment_type') as Assignment['assignment_type']
  //     return (
  //       <div className="flex items-center space-x-2">
  //         {/* <FileText className="h-4 w-4 text-muted-foreground" /> */}
  //         <div>
  //           <div className="font-medium">{assignmentType.label}</div>
  //           {/* <div className="text-sm text-muted-foreground">{assignmentType.code}</div> */}
  //         </div>
  //       </div>
  //     )
  //   },
  // },
  {
    accessorKey: 'expertise_type',
    header: 'Type d\'expertise',
    cell: ({ row }) => {
      const expertiseType = row.getValue('expertise_type') as Assignment['expertise_type']
      return (
        <div>
          <div className="font-medium">{expertiseType.label}</div>
          {/* <div className="text-sm text-muted-foreground">{expertiseType.code}</div> */}
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'total_amount',
  //   header: 'Montant total',
  //   cell: ({ row }) => {
  //     const totalAmount = row.getValue('total_amount') as number
  //     return (
  //       <div className="flex items-center space-x-2">
  //         {/* <DollarSign className="h-4 w-4 text-green-600" /> */}
  //         <div className="font-medium text-green-600">
  //           {formatCurrency(totalAmount || 0)}
  //         </div>
  //       </div>
  //     )
  //   },
  // },
  // {
  //   accessorKey: 'shock_amount',
  //   header: 'Montant choc',
  //   cell: ({ row }) => {
  //     const shockAmount = row.getValue('shock_amount') as number
  //     return (
  //       <div className="font-medium text-blue-600">
  //         {formatCurrency(shockAmount || 0)}
  //       </div>
  //     )
  //   },
  // },
  // {
  //   accessorKey: 'other_cost_amount',
  //   header: 'Autres coûts',
  //   cell: ({ row }) => {
  //     const otherCostAmount = row.getValue('other_cost_amount') as number
  //     return (
  //       <div className="font-medium text-orange-600">
  //         {formatCurrency(otherCostAmount || 0)}
  //       </div>
  //     )
  //   },
  // },
  // {
  //   accessorKey: 'receipt_amount',
  //   header: 'Quittances',
  //   cell: ({ row }) => {
  //     const assignment = row.original
  //     return (
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         onClick={() => onOpenReceiptModal(assignment.id, parseFloat(assignment.total_amount || '0'))}
  //         className="flex items-center space-x-2"
  //       >
  //         {/* <Receipt className="h-4 w-4" /> */}
  //         <span>{ assignment.receipts.length } (qtce{ assignment.receipts.length > 1 ? 's' : '' })</span>
  //       </Button>
  //     )
  //   },
  // },

  {
    accessorKey: 'progress',
    header: 'Progression',
    cell: ({ row }) => {
      // const status = row.getValue('status') as Assignment['status']
      const getStatusVariant = (code: string) => {


        
        switch (code) {
          case 'active':
            return 'info'
          case 'opened':
            return 'default'
          case 'realized':
            return 'warning'
          case 'edited':
            return 'outline'
          case 'corrected':
            return 'secondary'
          case 'closed':
            return 'success'
          case 'in_payment':
            return 'error'
          case 'paid':
            return 'neutral'
          case 'inactive':
            return 'primary'
          case 'cancelled':
            return 'error-light'
          case 'deleted':
            return 'destructive'
          default:
            return 'outline'
        }
      }
      
      return (
        // <Badge variant={getStatusVariant(status.code)}>
        //   {status.label}
        // </Badge>
        <div className="flex items-center space-x-2">
          {/* <User className="h-4 w-4 text-muted-foreground" /> */}
          <div>
            <div className="font-medium">{ row.getValue('edition') }</div>
            <div className="text-sm text-muted-foreground">Progression</div>
          </div>
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
            return 'info'
          case 'opened':
            return 'default'
          case 'realized':
            return 'warning'
          case 'edited':
            return 'outline'
          case 'corrected':
            return 'secondary'
          case 'closed':
            return 'success'
          case 'in_payment':
            return 'error'
          case 'paid':
            return 'neutral'
          case 'inactive':
            return 'primary'
          case 'cancelled':
            return 'error-light'
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
    accessorKey: 'expertise_date',
    header: 'Date expertise',
    cell: ({ row }) => {
      const expertiseDate = row.getValue('expertise_date') as string
      return (
        <div className="flex items-center space-x-2">
          {/* <Calendar className="h-4 w-4 text-muted-foreground" /> */}
          <div className="text-sm text-muted-foreground">
            {expertiseDate ? formatDate(expertiseDate) : 'Non définie'}
          </div>
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'created_at',
  //   header: 'Créé le',
  //   cell: ({ row }) => {
  //     return (
  //       <div className="text-sm text-muted-foreground">
  //         {formatDate(row.getValue('created_at'))}
  //       </div>
  //     )
  //   },
  // },
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