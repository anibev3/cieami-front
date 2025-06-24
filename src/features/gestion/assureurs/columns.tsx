import { ColumnDef } from '@tanstack/react-table'
import { Assureur } from './types'

export const assureurColumns: ColumnDef<Assureur>[] = [
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
          Assureur
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
] 