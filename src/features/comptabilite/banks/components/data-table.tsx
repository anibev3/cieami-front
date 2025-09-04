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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  ChevronDown, 
  Search, 
  Settings2, 
  Loader2,
  Building2,
  Activity,
  EyeOff,
  MapPin
} from 'lucide-react'
import { Bank } from '@/types/comptabilite'

interface DataTableProps {
  columns: ColumnDef<Bank>[]
  data: Bank[]
  loading?: boolean
  onView: (bank: Bank) => void
  onEdit: (bank: Bank) => void
  onDelete: (bank: Bank) => void
}

export function DataTable({
  columns,
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // Calcul des statistiques
  const stats = React.useMemo(() => ({
    total: data.length,
    active: data.filter(b => b.status.code === 'active').length,
    inactive: data.filter(b => b.status.code === 'inactive').length,
    pending: data.filter(b => b.status.code === 'pending').length
  }), [data])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Chargement des banques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center space-x-2 p-4 bg-white rounded-lg border">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-4 bg-white rounded-lg border">
          <Activity className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-sm font-medium">Actives</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-4 bg-white rounded-lg border">
          <EyeOff className="h-4 w-4 text-gray-600" />
          <div>
            <p className="text-sm font-medium">Inactives</p>
            <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-4 bg-white rounded-lg border">
          <MapPin className="h-4 w-4 text-yellow-600" />
          <div>
            <p className="text-sm font-medium">En attente</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une banque..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="mr-2 h-4 w-4" />
                Colonnes
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  className="h-24 text-center"
                >
                  Aucune banque trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} sur{" "}
          {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Lignes par page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} sur{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Aller à la première page</span>
              {"<<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Aller à la page précédente</span>
              {"<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Aller à la page suivante</span>
              {">"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Aller à la dernière page</span>
              {">>"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
