import { ColumnDef } from '@tanstack/react-table'
import { EntityType } from '@/types/administration'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, Hash, Calendar, Power, PowerOff } from 'lucide-react'
import { useEntityTypesStore } from '@/stores/entityTypesStore'

// Props pour les actions
interface EntityTypeActionsProps {
  entityType: EntityType
  onView: (entityType: EntityType) => void
  onEdit: (entityType: EntityType) => void
  onDelete: (entityType: EntityType) => void
}

// Composant pour les actions
function EntityTypeActions({ entityType, onView, onEdit, onDelete }: EntityTypeActionsProps) {
  const { enableEntityType, disableEntityType, loading } = useEntityTypesStore()
  const isActive = !entityType.deleted_at

  const handleToggleStatus = async () => {
    try {
      if (isActive) {
        await disableEntityType(entityType.id)
      } else {
        await enableEntityType(entityType.id)
      }
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

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
        <DropdownMenuItem onClick={() => onView(entityType)}>
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(entityType)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleToggleStatus}
          disabled={loading}
          className={isActive ? "text-orange-600" : "text-green-600"}
        >
          {isActive ? (
            <>
              <PowerOff className="mr-2 h-4 w-4" />
              Désactiver
            </>
          ) : (
            <>
              <Power className="mr-2 h-4 w-4" />
              Activer
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem 
          onClick={() => onDelete(entityType)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Props pour les colonnes
interface ColumnsProps {
  onView: (entityType: EntityType) => void
  onEdit: (entityType: EntityType) => void
  onDelete: (entityType: EntityType) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnsProps): ColumnDef<EntityType>[] => [
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
    accessorKey: 'deleted_at',
    header: 'Statut',
    cell: ({ row }) => {
      const deletedAt = row.getValue('deleted_at') as string | null
      return (
        <Badge variant={deletedAt ? 'destructive' : 'default'}>
          {deletedAt ? 'Inactif' : 'Actif'}
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
    id: 'actions',
    cell: ({ row }) => {
      return (
        <EntityTypeActions 
          entityType={row.original} 
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )
    },
  },
] 