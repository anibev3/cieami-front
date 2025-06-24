import { ColumnDef } from '@tanstack/react-table'
import { DocumentTransmitted } from '@/types/administration'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, FileText } from 'lucide-react'

// Props pour les actions
interface DocumentActionsProps {
  document: DocumentTransmitted
  onView: (document: DocumentTransmitted) => void
  onEdit: (document: DocumentTransmitted) => void
  onDelete: (document: DocumentTransmitted) => void
}

// Composant pour les actions
function DocumentActions({ document, onView, onEdit, onDelete }: DocumentActionsProps) {
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
        <DropdownMenuItem onClick={() => onView(document)}>
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(document)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(document)}
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
  onView: (document: DocumentTransmitted) => void
  onEdit: (document: DocumentTransmitted) => void
  onDelete: (document: DocumentTransmitted) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnsProps): ColumnDef<DocumentTransmitted>[] => [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
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
        <DocumentActions 
          document={row.original} 
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )
    },
  },
] 