import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/features/administration/documents/components/data-table-pagination'
import { DataTableToolbar } from './components/data-table-toolbar'
import { WorkFee } from './types'

interface TarificationHonoraireDataTableProps {
  data: WorkFee[]
  loading?: boolean
  onView: (workFee: WorkFee) => void
  onEdit: (workFee: WorkFee) => void
  onDelete: (workFee: WorkFee) => void
}

export function TarificationHonoraireDataTable({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: TarificationHonoraireDataTableProps) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const columns: ColumnDef<WorkFee>[] = React.useMemo(
    () => [
      {
        accessorKey: 'param_1',
        header: 'Paramètre 1',
        cell: ({ row }) => <div className="font-medium">{row.getValue('param_1')}</div>,
      },
      {
        accessorKey: 'param_2',
        header: 'Paramètre 2',
        cell: ({ row }) => <div>{row.getValue('param_2')}</div>,
      },
      {
        accessorKey: 'param_3',
        header: 'Paramètre 3',
        cell: ({ row }) => <div>{row.getValue('param_3')}</div>,
      },
      {
        accessorKey: 'param_4',
        header: 'Paramètre 4',
        cell: ({ row }) => <div>{row.getValue('param_4')}</div>,
      },
      {
        accessorKey: 'status',
        header: 'Statut',
        cell: ({ row }) => {
          const status = row.getValue('status') as { label: string; value: string }
          return (
            <div className="flex items-center">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                status.value === 'active' ? 'bg-green-100 text-green-800' :
                status.value === 'inactive' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {status.label}
              </span>
            </div>
          )
        },
        filterFn: (row, id, value) => {
          const status = row.getValue(id) as { label: string; value: string }
          return value.includes(status.value)
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const workFee = row.original
          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onView(workFee)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Voir
              </button>
              <button
                onClick={() => onEdit(workFee)}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Éditer
              </button>
              <button
                onClick={() => onDelete(workFee)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Supprimer
              </button>
            </div>
          )
        },
      },
    ],
    [onView, onEdit, onDelete]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-[250px] bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-[100px] bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="rounded-md border">
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Chargement des tarifications...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Aucune tarification trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
} 