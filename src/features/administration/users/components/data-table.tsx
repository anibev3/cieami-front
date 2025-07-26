import { useState } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender, SortingState, ColumnFiltersState } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useUsersStore } from '@/stores/usersStore'
import { createColumns } from './columns'
import { User } from '@/types/administration'

interface DataTableProps {
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onEnable: (user: User) => Promise<void>
  onDisable: (user: User) => Promise<void>
  onReset: (user: User) => Promise<void>
  onSearch: (search: string) => void
  onPageChange: (page: number) => void
  onEntityFilter: (entity: string) => void
  onRoleFilter: (role: string) => void
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
    from: number
    to: number
  }
  filters: {
    search: string
    entity: string
    role: string
  }
}

export function DataTable({ 
  onView, 
  onEdit, 
  onDelete, 
  onEnable, 
  onDisable, 
  onReset,
  onSearch,
  onPageChange,
  onEntityFilter,
  onRoleFilter,
  pagination,
  filters
}: DataTableProps) {
  const { users, loading } = useUsersStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  const columns = createColumns({ onView, onEdit, onDelete, onEnable, onDisable, onReset })

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des utilisateurs..."
                value={filters.search}
                onChange={(event) => onSearch(event.target.value)}
                className="h-8 w-[150px] lg:w-[250px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Filtrer par entité..."
                value={filters.entity}
                onChange={(event) => onEntityFilter(event.target.value)}
                className="h-8 w-[120px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Filtrer par rôle..."
                value={filters.role}
                onChange={(event) => onRoleFilter(event.target.value)}
                className="h-8 w-[120px]"
              />
            </div>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: columns.length }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des utilisateurs..."
              value={filters.search}
              onChange={(event) => onSearch(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Filtrer par entité..."
              value={filters.entity}
              onChange={(event) => onEntityFilter(event.target.value)}
              className="h-8 w-[120px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Filtrer par rôle..."
              value={filters.role}
              onChange={(event) => onRoleFilter(event.target.value)}
              className="h-8 w-[120px]"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun utilisateur trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Affichage de {pagination.from} à {pagination.to} sur {pagination.total} utilisateur(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.currentPage} sur {pagination.lastPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.lastPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 