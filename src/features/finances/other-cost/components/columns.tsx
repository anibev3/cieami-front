import { ColumnDef } from '@tanstack/react-table'
import { OtherCost } from '@/types/administration'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, DollarSign, Calendar, Tag } from 'lucide-react'
import { formatCurrency } from '@/utils/format-currency'

interface OtherCostActionsProps {
  otherCost: OtherCost
  onView: (otherCost: OtherCost) => void
  onEdit: (otherCost: OtherCost) => void
  onDelete: (otherCost: OtherCost) => void
}

function OtherCostActions({ otherCost, onView, onEdit, onDelete }: OtherCostActionsProps) {
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
        <DropdownMenuItem onClick={() => onView(otherCost)}>
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => onEdit(otherCost)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(otherCost)} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ColumnsProps {
  onView: (otherCost: OtherCost) => void
  onEdit: (otherCost: OtherCost) => void
  onDelete: (otherCost: OtherCost) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnsProps): ColumnDef<OtherCost>[] => [
  {
    accessorKey: 'other_cost_type_label',
    header: 'Type de coût',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        {/* <Tag className="h-4 w-4 text-muted-foreground" /> */}
        <span className="font-medium">{row.getValue('other_cost_type_label')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'amount_excluding_tax',
    header: 'Montant HT',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount_excluding_tax'))
      return (
        <div className="flex items-center space-x-2">
          {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
          <span className="font-mono text-sm">{formatCurrency(amount)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'amount_tax',
    header: 'TVA',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount_tax'))
      return (
        <div className="flex items-center space-x-2">
          {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
          <span className="font-mono text-sm">{formatCurrency(amount)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'Montant TTC',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      return (
        <div className="flex items-center space-x-2">
          {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
          <span className="font-mono text-sm font-semibold">{formatCurrency(amount)}</span>
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
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {/* <Calendar className="h-4 w-4" /> */}
          <span>{date.toLocaleDateString('fr-FR')}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <OtherCostActions
        otherCost={row.original}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
]
