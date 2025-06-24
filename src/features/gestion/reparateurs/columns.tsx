import { ColumnDef } from '@tanstack/react-table'
import { Reparateur } from './types'

export const reparateurColumns: ColumnDef<Reparateur>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'telephone',
    header: 'Téléphone',
  },
  {
    accessorKey: 'address',
    header: 'Adresse',
  },
  {
    accessorKey: 'status.label',
    header: 'Statut',
    cell: ({ row }) => row.original.status.label,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => {
      return (
        <div className="text-sm text-muted-foreground">
          Réparateur
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
] 