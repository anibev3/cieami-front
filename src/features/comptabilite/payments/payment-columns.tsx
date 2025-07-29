import { ColumnDef } from '@tanstack/react-table'
import { Payment } from '@/types/comptabilite'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Edit, Trash2, MoreHorizontal, Eye, EyeOff, Calendar } from 'lucide-react'
import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'

interface PaymentColumnsProps {
  onEdit: (payment: Payment) => void
  onDelete: (id: number) => void
}

export const createPaymentColumns = ({ onEdit, onDelete }: PaymentColumnsProps): ColumnDef<Payment>[] => [
  {
    accessorKey: 'reference',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 flex items-center gap-1"
        >
          {/* <FileText className="h-4 w-4" /> */}
          Référence
        </Button>
      )
    },
    cell: ({ row }) => {
      const reference = row.getValue('reference') as string
      return (
        <div className="font-medium">
          {reference.length > 20 ? `${reference.slice(0, 20)}...` : reference}
        </div>
      )
    },
  },
  {
    accessorKey: 'assignment.reference',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 flex items-center gap-1"
        >
          {/* <FileText className="h-4 w-4" /> */}
          Dossier
        </Button>
      )
    },
    cell: ({ row }) => {
      const assignment = row.original.assignment
      return (
        <div className="text-sm">
          {assignment?.reference || 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 flex items-center gap-1"
        >
          {/* <Euro className="h-4 w-4" /> */}
          Montant
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      return (
        <div className="font-semibold text-green-600">
          {formatCurrency(amount)}
        </div>
      )
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 flex items-center gap-1"
        >
          {/* <Calendar className="h-4 w-4" /> */}
          Date
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('date') as string
      return (
        <div className="text-sm">
          {formatDate(date)}
        </div>
      )
    },
  },
  {
    accessorKey: 'payment_type.label',
    header: 'Type de paiement',
    cell: ({ row }) => {
      const paymentType = row.original.payment_type
      return (
        <div className="text-sm">
          {paymentType?.label || 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'payment_method.label',
    header: 'Méthode',
    cell: ({ row }) => {
      const paymentMethod = row.original.payment_method
      return (
        <div className="text-sm">
          {paymentMethod?.label || 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'status.code',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.original.status
      const isActive = status?.code === 'active'
      
      return (
        <Badge 
          variant={isActive ? "default" : "secondary"}
          className={isActive ? "bg-green-100 text-green-800" : ""}
        >
          {isActive ? (
            <>
              <Eye className="mr-1 h-3 w-3" />
              Validé
            </>
          ) : (
            <>
              <EyeOff className="mr-1 h-3 w-3" />
              En attente
            </>
          )}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 flex items-center gap-1"
        >
          <Calendar className="h-4 w-4" />
          Créé le
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at') as string
      return (
        <div className="text-sm text-muted-foreground">
          {formatDate(createdAt)}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(payment)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Cela supprimera définitivement le paiement "{payment.reference}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(payment.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 