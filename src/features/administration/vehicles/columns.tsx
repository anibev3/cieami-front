import { ColumnDef } from '@tanstack/react-table'
import { Vehicle } from '@/types/vehicles'
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
  onView: (vehicle: Vehicle) => void
  onEdit: (vehicle: Vehicle) => void
  onDelete: (vehicle: Vehicle) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnsProps): ColumnDef<Vehicle>[] => [
  {
    accessorKey: 'license_plate',
    header: 'Plaque d\'immatriculation',
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue('license_plate')}
        </div>
      )
    },
  },
  {
    accessorKey: 'brand',
    header: 'Marque',
    cell: ({ row }) => {
      const brand = row.getValue('brand') as Vehicle['brand']
      return (
        <div className="font-medium">
          {brand.label}
        </div>
      )
    },
  },
  {
    accessorKey: 'vehicle_model',
    header: 'Modèle',
    cell: ({ row }) => {
      const vehicleModel = row.getValue('vehicle_model') as Vehicle['vehicle_model']
      return (
        <div className="font-medium">
          {vehicleModel.label}
        </div>
      )
    },
  },
  {
    accessorKey: 'color',
    header: 'Couleur',
    cell: ({ row }) => {
      const color = row.getValue('color') as Vehicle['color']
      return (
        <div className="font-medium">
          {color.label}
        </div>
      )
    },
  },
  {
    accessorKey: 'bodywork',
    header: 'Carrosserie',
    cell: ({ row }) => {
      const bodywork = row.getValue('bodywork') as Vehicle['bodywork']
      return (
        <div className="font-medium">
          {bodywork.label}
        </div>
      )
    },
  },
  {
    accessorKey: 'mileage',
    header: 'Kilométrage',
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {row.getValue('mileage')} km
        </div>
      )
    },
  },
  {
    accessorKey: 'fiscal_power',
    header: 'Puissance fiscale',
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {row.getValue('fiscal_power')} CV
        </div>
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
      const vehicle = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(vehicle)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(vehicle)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(vehicle)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 