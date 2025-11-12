import { ColumnDef } from '@tanstack/react-table'
import { AssignmentRequest } from '@/types/assignment-requests'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Edit, MoreHorizontal, Building, Wrench, User, Car, Calendar, FileText, XCircle } from 'lucide-react'
import { formatDate } from '@/utils/format-date'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ColumnsProps {
  onViewDetail: (id: string) => void
  onOpenFolder: (id: string) => void
  onReject?: (id: string) => void
  canReject?: boolean
}

export const createAssignmentRequestColumns = ({
  onViewDetail,
  onOpenFolder,
  onReject,
  canReject = false,
}: ColumnsProps): ColumnDef<AssignmentRequest>[] => {

  return [
    {
      accessorKey: 'reference',
      header: 'Référence',
      cell: ({ row }) => {
        const request = row.original
        return (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded">
              <FileText className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-semibold text-sm">{request.reference}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'client',
      header: 'Client',
      cell: ({ row }) => {
        const request = row.original
        return (
          <div className="flex items-center gap-2 min-w-[200px]">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="font-medium text-sm">{request.client.name}</span>
              {request.client.email && (
                <span className="text-xs text-muted-foreground">{request.client.email}</span>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'insurer',
      header: 'Assureur',
      cell: ({ row }) => {
        const request = row.original
        return (
          <div className="flex items-center gap-2 min-w-[150px]">
            <div className="flex flex-col">
              <span className="font-medium text-sm">{request.insurer.name}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'repairer',
      header: 'Réparateur',
      cell: ({ row }) => {
        const request = row.original
        return (
          <div className="flex items-center gap-2 min-w-[150px]">
            <div className="flex flex-col">
              <span className="font-medium text-sm">{request.repairer.name}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'vehicle',
      header: 'Véhicule',
      cell: ({ row }) => {
        const request = row.original
        return (
          <div className="flex items-center gap-2 min-w-[150px]">
            <div className="flex flex-col">
              <span className="font-medium text-sm">{request.vehicle.license_plate}</span>
              {request.vehicle.serial_number && (
                <span className="text-xs text-muted-foreground">S/N: {request.vehicle.serial_number}</span>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'policy_number',
      header: 'N° Police',
      cell: ({ row }) => {
        const request = row.original
        return (
          <div className="text-sm">
            {request.policy_number || <span className="text-muted-foreground">-</span>}
          </div>
        )
      },
    },
    {
      accessorKey: 'claim_number',
      header: 'N° Sinistre',
      cell: ({ row }) => {
        const request = row.original
        return (
          <div className="text-sm">
            {request.claim_number || <span className="text-muted-foreground">-</span>}
          </div>
        )
      },
    },
    {
      accessorKey: 'expertise_place',
      header: 'Lieu d\'expertise',
      cell: ({ row }) => {
        const request = row.original
        return (
          <div className="text-sm max-w-[200px] truncate">
            {request.expertise_place || <span className="text-muted-foreground">-</span>}
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const request = row.original
        const statusCode = request.status.code
        const getStatusColor = (code: string) => {
          switch (code) {
            case 'active':
              return 'bg-green-100 text-green-800 border-green-200'
            case 'inactive':
              return 'bg-gray-100 text-gray-800 border-gray-200'
            case 'pending':
              return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'rejected':
              return 'bg-red-100 text-red-800 border-red-200'
            default:
              return 'bg-gray-100 text-gray-800 border-gray-200'
          }
        }
        return (
          <Badge className={getStatusColor(statusCode)}>
            {request.status.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Date de création',
      cell: ({ row }) => {
        const request = row.original
        return (
          <div className="flex items-center gap-2 text-sm">
            <span>{request.created_at ? formatDate(request.created_at) : '-'}</span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const request = row.original
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => onViewDetail(request.id)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Voir le détail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpenFolder(request.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Ouvrir le dossier
                </DropdownMenuItem>
                {canReject && onReject && request.status.code !== 'rejected' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onReject(request.id)}
                      className="text-orange-600"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Rejeter
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
    },
  ]
}

