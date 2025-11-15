import { ColumnDef } from '@tanstack/react-table'
import { Entity } from '@/types/administration'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, Hash, Power, PowerOff } from 'lucide-react'
import { useEntitiesStore } from '@/stores/entitiesStore'

// Props pour les actions
interface EntityActionsProps {
  entity: Entity
  onView: (entity: Entity) => void
  onEdit: (entity: Entity) => void
  onDelete: (entity: Entity) => void
}

// Composant pour les actions
function EntityActions({ entity, onView, onEdit, onDelete }: EntityActionsProps) {
  const { enableEntity, disableEntity, loading } = useEntitiesStore()
  const isActive = !entity?.status?.deleted_at

  const handleToggleStatus = async () => {
    try {
      if (isActive) {
        await disableEntity(entity?.id)
      } else {
        await enableEntity(entity?.id)
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
        <DropdownMenuItem onClick={() => onView(entity as Entity)}>
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(entity as Entity)}>
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
        <DropdownMenuItem 
          onClick={() => onDelete(entity as Entity)}
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
  onView: (entity: Entity) => void
  onEdit: (entity: Entity) => void
  onDelete: (entity: Entity) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnsProps): ColumnDef<Entity>[] => [
  // {
  //   accessorKey: 'code',
  //   header: 'Code',
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex items-center space-x-2">
  //         <Hash className="h-4 w-4 text-muted-foreground" />
  //         <span className="font-mono text-sm">{row.getValue('code')}</span>
  //       </div>
  //     )
  //   },
  // },
  {
    accessorKey: 'logo',
    header: 'Logo',
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <img src={row.original.logo || ''} alt="Logo" className="w-20 h-16 object-contain rounded-md border-1 border-border" />
        </div>
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Nom',
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue('name')}
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.getValue('email') as string
      return (
        <div className="flex items-center space-x-2">
          {/* <Mail className="h-4 w-4 text-muted-foreground" /> */}
          <span className="text-sm">{email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'telephone',
    header: 'Téléphone',
    cell: ({ row }) => {
      const telephone = row.getValue('telephone') as string | null
      return (
        <div className="flex items-center space-x-2">
          {/* <Phone className="h-4 w-4 text-muted-foreground" /> */}
          <span className="text-sm">{telephone || '-'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'entity_type',
    header: 'Type d\'entité',
    cell: ({ row }) => {
      const entityType = row.original.entity_type
      return (
        <div className="flex items-center space-x-2">
          {/* <Building className="h-4 w-4 text-muted-foreground" /> */}
          <Badge variant="outline">
            {entityType?.label || ''}
          </Badge>
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
        <Badge variant={status?.deleted_at ? 'destructive' : 'default'}>
          {status?.deleted_at ? 'Inactif' : 'Actif'}
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
          {/* <Calendar className="h-4 w-4" /> */}
          <span>{date.toLocaleDateString('fr-FR')}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <EntityActions 
          entity={row.original} 
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )
    },
  },
] 