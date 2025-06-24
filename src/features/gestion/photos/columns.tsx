import { ColumnDef } from '@tanstack/react-table'
import { Photo } from './types'

export const photoColumns: ColumnDef<Photo>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'label',
    header: 'Libellé',
  },
  {
    accessorKey: 'url',
    header: 'Aperçu',
    cell: ({ row }) => (
      <img src={row.original.url} alt={row.original.label} className="h-12 w-12 object-cover rounded" />
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
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
      // Les boutons d'action seront branchés dans la page principale
      return null
    },
    enableSorting: false,
    enableHiding: false,
  },
] 