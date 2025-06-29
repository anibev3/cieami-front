import { ColumnDef } from '@tanstack/react-table'
import { Assignment } from '@/types/assignments'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, AlertTriangle, Clock } from 'lucide-react'
import { formatDate } from '@/utils/format-date'
import { AssignmentActions } from './components/assignment-actions'
import { AssignmentStatusEnum } from '@/types/global-types'

interface ColumnsProps {
  onDelete: (assignment: Assignment) => void
  onOpenReceiptModal: (assignmentId: number, amount: number) => void
  onViewDetail: (assignmentId: number) => void
}

// Fonction utilitaire pour calculer le temps restant
function getTimeLeft(expireAt: string | null) {
  if (!expireAt) return null
  const now = new Date()
  const end = new Date(expireAt)
  const diff = end.getTime() - now.getTime()
  if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  return { expired: false, days, hours, minutes }
}

// Composant pour afficher le compte à rebours
function CountdownBadge({ label, expireAt, status, percent }: { 
  label: string
  expireAt: string | null
  status: string | null
  percent: number | null
}) {

  if (!expireAt) return null
  
  const timeLeft = getTimeLeft(expireAt)
  if (!timeLeft) return null

  const isUrgent = timeLeft.expired || (timeLeft.days === 0 && timeLeft.hours < 24)
  const isInProgress = status === 'in_progress'

  if (timeLeft.expired) {
    return (
      <div className="flex flex-col items-center gap-1">
        <Badge variant="destructive" className="flex items-center gap-1 bg-red-100 text-red-800 border-red-300 text-xs">
          <AlertTriangle className="h-3 w-3" />
          {label} expiré
        </Badge>
        {percent !== null && (
          <span className="text-xs text-red-600 font-medium">{percent}%</span>
        )}
      </div>
    ) 
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <Badge
        variant={isUrgent ? 'destructive' : 'outline'}
        className={
          isUrgent
            ? 'flex items-center gap-1 bg-red-100 text-red-800 border-red-300 text-xs animate-pulse'
            : isInProgress
            ? 'flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-300 text-xs'
            : 'flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-300 text-xs'
        }
      >
        {isUrgent && <AlertTriangle className="h-3 w-3" />}
        {!isUrgent && <Clock className="h-3 w-3" />}
        {timeLeft.days > 0 && `${timeLeft.days}j`}
        {timeLeft.days === 0 && timeLeft.hours > 0 && `${timeLeft.hours}h`}
        {timeLeft.days === 0 && timeLeft.hours === 0 && `${timeLeft.minutes}min`}
        {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && '<1min'}
      </Badge>
      {percent !== null && (
        <span className={`text-xs font-medium ${
          isUrgent ? 'text-red-600' : isInProgress ? 'text-blue-600' : 'text-gray-600'
        }`}>
          {percent}%
        </span>
      )}
    </div>
  )
}

// Fonction pour obtenir la variante de badge selon le statut
function getStatusVariant(statusCode: string) {
  switch (statusCode) {
    case AssignmentStatusEnum.ACTIVE:
      return 'info'
    case AssignmentStatusEnum.OPENED:
      return 'default'
    case AssignmentStatusEnum.REALIZED:
      return 'warning'
    case AssignmentStatusEnum.EDITED:
      return 'outline'
    case AssignmentStatusEnum.VALIDATED:
      return 'secondary'
    case AssignmentStatusEnum.CLOSED:
      return 'success'
    case AssignmentStatusEnum.IN_PAYMENT:
      return 'error'
    case AssignmentStatusEnum.PAID:
      return 'neutral'
    case AssignmentStatusEnum.INACTIVE:
      return 'primary'
    case AssignmentStatusEnum.CANCELLED:
      return 'error-light'
    case AssignmentStatusEnum.DELETED:
      return 'destructive'
    case AssignmentStatusEnum.ARCHIVED:
      return 'secondary'
    case AssignmentStatusEnum.DRAFT:
      return 'outline'
    default:
      return 'outline'
  }
}

export const createColumns = ({ onDelete, onOpenReceiptModal, onViewDetail }: ColumnsProps): ColumnDef<Assignment>[] => [

  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
      />
    ),
  },
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
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.getValue('status') as Assignment['status']
      
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
    accessorKey: 'edition_countdown',
    header: 'Délai d\'édition',
    cell: ({ row }) => {
      const assignment = row.original
      return (
        <CountdownBadge
          label="Édition"
          expireAt={assignment.edition_time_expire_at}
          status={assignment.edition_status}
          percent={assignment.edition_per_cent}
        />
      )
    },
  },
  {
    accessorKey: 'recovery_countdown',
    header: 'Délai de recouvrement',
    cell: ({ row }) => {
      const assignment = row.original
      return (
        <CountdownBadge
          label="Récupération"
          expireAt={assignment.recovery_time_expire_at}
          status={assignment.recovery_status}
          percent={assignment.recovery_per_cent}
        />
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