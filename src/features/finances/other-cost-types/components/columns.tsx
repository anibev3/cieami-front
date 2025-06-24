import { ColumnDef } from '@tanstack/react-table'
import { OtherCostType } from '@/types/administration'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, Hash, Calendar } from 'lucide-react'

interface OtherCostTypeActionsProps {
  otherCostType: OtherCostType
  onView: (otherCostType: OtherCostType) => void
  onEdit: (otherCostType: OtherCostType) => void
  onDelete: (otherCostType: OtherCostType) => void
}

function OtherCostTypeActions({ otherCostType, onView, onEdit, onDelete }: OtherCostTypeActionsProps) {
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
        <DropdownMenuItem onClick={() => onView(otherCostType)}>
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(otherCostType)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(otherCostType)} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ColumnsProps {
  onView: (otherCostType: OtherCostType) => void
  onEdit: (otherCostType: OtherCostType) => void
  onDelete: (otherCostType: OtherCostType) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnsProps): ColumnDef<OtherCostType>[] => [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Hash className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-sm">{row.getValue('code')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'label',
    header: 'Libellé',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('label')}</div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue('description')}</span>
    ),
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
      <OtherCostTypeActions
        otherCostType={row.original}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
] 