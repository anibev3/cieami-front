import { ColumnDef } from '@tanstack/react-table'
import { GeneralState } from '@/types/administration'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, Hash } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Props pour les actions
interface GeneralStateActionsProps {
  generalState: GeneralState
  onView: (generalState: GeneralState) => void
  onEdit: (generalState: GeneralState) => void
  onDelete: (generalState: GeneralState) => void
}

// Composant pour les actions
function GeneralStateActions({ generalState, onView, onEdit, onDelete }: GeneralStateActionsProps) {
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
        <DropdownMenuItem onClick={() => onView(generalState)}>
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(generalState)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(generalState)}
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
  onView: (generalState: GeneralState) => void
  onEdit: (generalState: GeneralState) => void
  onDelete: (generalState: GeneralState) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnsProps): ColumnDef<GeneralState>[] => [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{row.getValue('code')}</span>
        </div>
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
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant={status.code === 'active' ? 'default' : 'secondary'}>
          {status.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_by',
    header: 'Créé par',
    cell: ({ row }) => {
      const createdBy = row.original.created_by
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={createdBy.photo_url} alt={createdBy.name} />
            <AvatarFallback className="text-xs">
              {createdBy.first_name.charAt(0)}{createdBy.last_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{createdBy.name}</span>
            <span className="text-xs text-muted-foreground">{createdBy.username}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Créé le',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString('fr-FR')}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <GeneralStateActions 
          generalState={row.original} 
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )
    },
  },
] 