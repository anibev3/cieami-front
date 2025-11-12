import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AssignmentRequest } from '@/types/assignment-requests'
import { createAssignmentRequestColumns } from '../columns'
import { Loader2, Database, Clock } from 'lucide-react'

interface AssignmentRequestsDataTableProps {
  data: AssignmentRequest[]
  loading?: boolean
  onViewDetail: (id: string) => void
  onOpenFolder: (id: string) => void
  onReject?: (id: string) => void
  canReject?: boolean
}

export function AssignmentRequestsDataTable({ 
  data, 
  loading = false,
  onViewDetail,
  onOpenFolder,
  onReject,
  canReject = false,
}: AssignmentRequestsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns = createAssignmentRequestColumns({
    onViewDetail,
    onOpenFolder,
    onReject,
    canReject,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
          {loading ? (
            <>
              {Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={`loading-${index}`} className="animate-pulse">
                  {Array.from({ length: columns.length }).map((_, cellIndex) => (
                    <TableCell key={`loading-cell-${index}-${cellIndex}`} className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        {cellIndex === 0 && (
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={columns.length} className="py-8">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="relative">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping"></div>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium text-gray-700 flex items-center justify-center gap-2">
                        <Database className="h-4 w-4 text-blue-500" />
                        Chargement des demandes d'expertise...
                      </p>
                      <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        Veuillez patienter
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucune demande d'expertise trouvée.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

