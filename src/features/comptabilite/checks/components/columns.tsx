import { ColumnDef } from '@tanstack/react-table'
import { Check } from '@/types/comptabilite'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash2, Hash, Calendar, Building2, Activity, Image, CheckSquare, EyeOff } from 'lucide-react'
import { useCheckStore } from '@/stores/checkStore'
import { useNavigate } from '@tanstack/react-router'

interface CheckActionsProps {
  check: Check
  onView: (check: Check) => void
  onEdit: (check: Check) => void
  onDelete: (check: Check) => void
}

function CheckActions({ check, onView, onDelete: _onDelete }: CheckActionsProps) {
  const { deleteCheck, loading } = useCheckStore()
  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      await deleteCheck(check.id)
    } catch (_error) {
      // Error handled by store
    }
  }

  const handleViewDetail = () => {
    navigate({ to: `/comptabilite/checks/detail/${check.id}` })
  }

  const handleEdit = () => {
    navigate({ to: `/comptabilite/checks/edit/${check.id}` })
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
        <DropdownMenuItem onClick={handleViewDetail}>
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onView(check)}>
          <Eye className="mr-2 h-4 w-4" />
          Aperçu rapide
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ColumnsProps {
  onView: (check: Check) => void
  onEdit: (check: Check) => void
  onDelete: (check: Check) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnsProps): ColumnDef<Check>[] => [
  {
    accessorKey: 'reference',
    header: 'Référence',
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{row.getValue('reference')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'))
      return (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {/* <Calendar className="h-4 w-4" /> */}
          <span>{date.toLocaleDateString('fr-FR')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'Montant',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      return (
        <div className="text-sm font-medium">
          {amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
        </div>
      )
    },
  },
  {
    accessorKey: 'bank',
    header: 'Banque',
    cell: ({ row }) => {
      const bank = row.original.bank
      return (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{bank?.name || 'Non renseigné'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'payment',
    header: 'Paiement',
    cell: ({ row }) => {
      const payment = row.original.payment
      return (
        <div className="text-sm">
          {payment?.reference || 'Non renseigné'}
        </div>
      )
    },
  },
  {
    accessorKey: 'photo',
    header: 'Photo',
    cell: ({ row }) => {
      const photo = row.getValue('photo') as string | null
      return (
        <div className="flex items-center">
          {photo ? (
            <Badge variant="outline" className="text-xs">
              <Image className="mr-1 h-3 w-3" />
              Disponible
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Aucune
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.original.status
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
      let label = "Inconnu"
      let icon = Activity

      if (status) {
        switch (status.code) {
          case 'active':
            variant = 'default'
            label = 'Encaissé'
            icon = CheckSquare
            break
          case 'pending':
            variant = 'secondary'
            label = 'En attente'
            icon = EyeOff
            break
          default:
            variant = 'outline'
            label = status.label || 'Inconnu'
        }
      }
      
      const IconComponent = icon
      return (
        <Badge variant={variant} className="flex items-center gap-1">
          <IconComponent className="h-3 w-3" />
          {label}
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
        <CheckActions 
          check={row.original} 
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )
    },
  },
]
