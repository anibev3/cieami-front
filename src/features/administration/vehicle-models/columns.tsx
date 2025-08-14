import { ColumnDef } from '@tanstack/react-table'
import { VehicleModel } from '@/types/vehicle-models'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/utils/format-date'

interface ColumnsProps {
  onView: (vehicleModel: VehicleModel) => void
  onEdit: (vehicleModel: VehicleModel) => void
  onDelete: (vehicleModel: VehicleModel) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnsProps): ColumnDef<VehicleModel>[] => [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue('code')}
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
      return (
        <div className="max-w-[300px] truncate">
          {row.getValue('description')}
        </div>
      )
    },
  },
  {
    accessorKey: 'brand',
    header: 'Marque',
    cell: ({ row }) => {
      const brand = row.getValue('brand') as VehicleModel['brand']
      return (
        <div className="font-medium">
          {brand.label}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.getValue('status') as VehicleModel['status']
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
      return (
        <div className="text-sm text-muted-foreground">
          {formatDate(row.getValue('created_at'))}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const vehicleModel = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(vehicleModel)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(vehicleModel)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => onDelete(vehicleModel)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 