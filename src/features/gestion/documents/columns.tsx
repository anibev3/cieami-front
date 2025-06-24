import { ColumnDef } from '@tanstack/react-table'
import { DocumentTransmis } from './types'

export const documentTransmisColumns: ColumnDef<DocumentTransmis>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'label',
    header: 'Libellé',
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
      return (
        <div className="text-sm text-muted-foreground">
          Document
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
] 