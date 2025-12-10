import { ColumnDef } from '@tanstack/react-table'
import { GeneralStatusDeadline } from '@/types/administration'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react'

// Props pour les actions
interface GeneralStatusDeadlineActionsProps {
  deadline: GeneralStatusDeadline
  onView: (deadline: GeneralStatusDeadline) => void
  onEdit: (deadline: GeneralStatusDeadline) => void
  onDelete: (deadline: GeneralStatusDeadline) => void
  onEnable: (deadline: GeneralStatusDeadline) => void
  onDisable: (deadline: GeneralStatusDeadline) => void
}

// Composant pour les actions
function GeneralStatusDeadlineActions({ deadline, onView, onEdit, onDelete, onEnable, onDisable }: GeneralStatusDeadlineActionsProps) {
  // const isActive = !deadline.deleted_at
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
  onView: (deadline: GeneralStatusDeadline) => void
  onEdit: (deadline: GeneralStatusDeadline) => void
  onDelete: (deadline: GeneralStatusDeadline) => void
  onEnable: (deadline: GeneralStatusDeadline) => void
  onDisable: (deadline: GeneralStatusDeadline) => void
}

export const createColumns = ({ onView, onEdit, onDelete, onEnable, onDisable }: ColumnsProps): ColumnDef<GeneralStatusDeadline>[] => [
  {
    accessorKey: 'id',
    header: 'N°',
    cell: ({ row }) => {
      return (
        <>
          <div className="font-medium ">#{row.index + 1}</div>
        </>
      )
    },
  },
  {
    accessorKey: 'label',
    header: 'Libellé',
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue('label')}
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return (
        <div className="max-w-[300px] truncate text-sm text-muted-foreground">
          {description}
        </div>
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
    accessorKey: 'target_status',
    header: 'Statut cible',
    cell: ({ row }) => {
      const targetStatus = row.original.target_status
      return (
        <Badge variant="outline">
          {targetStatus?.label || targetStatus?.code}
        </Badge>
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
        <GeneralStatusDeadlineActions 
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
