import { ColumnDef } from '@tanstack/react-table'
import { Client } from './types'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/utils/format-date'

interface CreateColumnsProps {
  onView: (client: Client) => void
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
}

export function createColumns({ onView, onEdit, onDelete }: CreateColumnsProps): ColumnDef<Client>[] {
  return [
    {
      accessorKey: 'id',
      header: 'ID',
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
      accessorKey: 'phone_1',
      header: 'Téléphone 1',
    },
    {
      accessorKey: 'phone_2',
      header: 'Téléphone 2',
    },
    {
      accessorKey: 'address',
      header: 'Adresse',
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
      accessorKey: 'created_by.name',
      header: 'Créé par',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onView(row.original)}>Voir</Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>Éditer</Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(row.original)}>Supprimer</Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]
} 