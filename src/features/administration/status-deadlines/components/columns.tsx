import { ColumnDef } from '@tanstack/react-table'
import { StatusDeadline } from '@/types/administration'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react'

// Props pour les actions
interface StatusDeadlineActionsProps {
  deadline: StatusDeadline
  onView: (deadline: StatusDeadline) => void
  onEdit: (deadline: StatusDeadline) => void
  onDelete: (deadline: StatusDeadline) => void
  onEnable: (deadline: StatusDeadline) => void
  onDisable: (deadline: StatusDeadline) => void
}

// Composant pour les actions
function StatusDeadlineActions({ deadline, onView, onEdit, onDelete, onEnable, onDisable }: StatusDeadlineActionsProps) {
  const isDisabled = deadline.status?.code !== 'active'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onView(deadline)}>
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(deadline)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isDisabled ? (
          <DropdownMenuItem onClick={() => onEnable(deadline)}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Activer
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onDisable(deadline)}>
            <XCircle className="mr-2 h-4 w-4" />
            Désactiver
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(deadline)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Props pour les colonnes
interface ColumnsProps {
  onView: (deadline: StatusDeadline) => void
  onEdit: (deadline: StatusDeadline) => void
  onDelete: (deadline: StatusDeadline) => void
  onEnable: (deadline: StatusDeadline) => void
  onDisable: (deadline: StatusDeadline) => void
}

export const createColumns = ({ onView, onEdit, onDelete, onEnable, onDisable }: ColumnsProps): ColumnDef<StatusDeadline>[] => [
  {
    accessorKey: 'id',
    header: 'N°',
    cell: ({ row }) => {
      return (
        <div className="font-medium">#{row.index + 1}</div>
      )
    },
  },
  {
    accessorKey: 'time_limit',
    header: 'Délai (heures)',
    cell: ({ row }) => {
      const timeLimit = row.getValue('time_limit') as number
      return (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{timeLimit}h</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'general_status_deadline',
    header: 'Délai de statut général',
    accessorFn: (row) => row.general_status_deadline?.label || '',
    cell: ({ row }) => {
      const generalDeadline = row.original.general_status_deadline
      return (
        <div className="flex flex-col">
          <span className="font-medium">{generalDeadline?.label}</span>
          {generalDeadline?.description && (
            <span className="text-xs text-muted-foreground truncate max-w-[300px]">
              {generalDeadline.description}
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'État',
    cell: ({ row }) => {
      const status = row.original.status
      const isActive = status?.code === 'active'
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {status?.label || 'Inconnu'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'deleted_at',
    header: 'Statut',
    cell: ({ row }) => {
      const deletedAt = row.getValue('deleted_at') as string | null
      return (
        <Badge variant={deletedAt ? 'destructive' : 'default'}>
          {deletedAt ? 'Supprimé' : 'Actif'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <StatusDeadlineActions 
          deadline={row.original} 
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onEnable={onEnable}
          onDisable={onDisable}
        />
      )
    },
  },
]
