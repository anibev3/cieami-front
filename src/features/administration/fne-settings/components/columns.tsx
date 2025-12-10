import { ColumnDef } from '@tanstack/react-table'
import { FNESetting } from '@/types/administration'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle2, XCircle, Building } from 'lucide-react'

// Props pour les actions
interface FNESettingActionsProps {
  setting: FNESetting
  onView: (setting: FNESetting) => void
  onEdit: (setting: FNESetting) => void
  onDelete: (setting: FNESetting) => void
  onEnable: (setting: FNESetting) => void
  onDisable: (setting: FNESetting) => void
}

// Composant pour les actions
function FNESettingActions({ setting, onView, onEdit, onDelete, onEnable, onDisable }: FNESettingActionsProps) {
  const isDisabled = setting.status?.code !== 'active'

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
        <DropdownMenuItem onClick={() => onView(setting)}>
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(setting)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isDisabled ? (
          <DropdownMenuItem onClick={() => onEnable(setting)}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Activer
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onDisable(setting)}>
            <XCircle className="mr-2 h-4 w-4" />
            Désactiver
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(setting)}
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
  onView: (setting: FNESetting) => void
  onEdit: (setting: FNESetting) => void
  onDelete: (setting: FNESetting) => void
  onEnable: (setting: FNESetting) => void
  onDisable: (setting: FNESetting) => void
}

export const createColumns = ({ onView, onEdit, onDelete, onEnable, onDisable }: ColumnsProps): ColumnDef<FNESetting>[] => [
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
    accessorKey: 'point_sale',
    header: 'Point de vente',
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue('point_sale') as string}</div>
      )
    },
  },
  {
    accessorKey: 'establishment',
    header: 'Établissement',
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue('establishment') as string}</div>
      )
    },
  },
  {
    accessorKey: 'entity',
    header: 'Entité',
    accessorFn: (row) => row.entity?.name || '',
    cell: ({ row }) => {
      const entity = row.original.entity
      return (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">{entity?.name}</span>
            {entity?.code && (
              <span className="text-xs text-muted-foreground">{entity.code}</span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'token',
    header: 'Token',
    cell: ({ row }) => {
      const token = row.getValue('token') as string
      return (
        <div className="font-mono text-sm">{token}</div>
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
    id: 'actions',
    cell: ({ row }) => {
      return (
        <FNESettingActions 
          setting={row.original} 
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
