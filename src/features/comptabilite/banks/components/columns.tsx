import { ColumnDef } from '@tanstack/react-table'
import { Bank } from '@/types/comptabilite'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, Hash, Calendar, Building2, FileText } from 'lucide-react'

// Props pour les actions
interface BankActionsProps {
  bank: Bank
  onView: (bank: Bank) => void
  onEdit: (bank: Bank) => void
  onDelete: (bank: Bank) => void
}

// Composant pour les actions
function BankActions({ bank, onView, onEdit, onDelete }: BankActionsProps) {
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
        <DropdownMenuItem onClick={() => onView(bank)}>
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(bank)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(bank)}
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
  onView: (bank: Bank) => void
  onEdit: (bank: Bank) => void
  onDelete: (bank: Bank) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnsProps): ColumnDef<Bank>[] => [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm font-medium">{row.getValue('code')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Nom de la banque',
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue('name')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string | null
      return (
        <div className="flex items-center space-x-2 max-w-xs">
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground truncate">
            {description || 'Aucune description'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.original.status
      const statusConfig = {
        active: { variant: 'default' as const, className: 'bg-green-100 text-green-800', label: 'Active' },
        inactive: { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800', label: 'Inactive' },
        pending: { variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800', label: 'En attente' }
      }
      
      const config = statusConfig[status.code as keyof typeof statusConfig] || statusConfig.inactive
      
      return (
        <Badge variant={config.variant} className={config.className}>
          {config.label}
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
    accessorKey: 'updated_at',
    header: 'Modifié le',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updated_at'))
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
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <BankActions 
          bank={row.original} 
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )
    },
  },
]
