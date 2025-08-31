import { useState, useEffect } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Payment } from '@/types/comptabilite'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent } from '@/components/ui/card'
import { Settings2, ChevronDown, Search, RefreshCw } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

interface PaymentDataTableProps {
  data: Payment[]
  columns: ColumnDef<Payment>[]
  onEdit: (payment: Payment) => void
  onDelete: (id: number) => void
  onRefresh?: () => void
  loading?: boolean
  onSearch?: (searchQuery: string) => void
  totalAmount: string
  totalItems: number
  exportUrl: string | null
}

export function PaymentDataTable({
  data,
  columns,
  onEdit: _onEdit,
  onDelete: _onDelete,
  onRefresh,
  loading,
  onSearch,
  totalAmount,
  totalItems,
  exportUrl
}: PaymentDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  
  // Debounce la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Effect pour déclencher la recherche quand la requête debounced change
  useEffect(() => {
    if (onSearch && debouncedSearchQuery !== undefined) {
      onSearch(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, onSearch])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })



  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchQuery(value)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <div className="space-y-4">
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total des paiements</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">P</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Montant total</p>
              <p className="text-2xl font-bold">
                {parseFloat(totalAmount).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-sm font-bold">€</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Paiements actifs</p>
              <p className="text-2xl font-bold">
                {data.filter(p => p.status?.code === 'active').length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-sm font-bold">✓</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Actions</p>
              <div className="flex gap-2">
                {exportUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(exportUrl, '_blank')}
                    className="text-xs"
                  >
                                        📊 Exporter
                   </Button>
                  )}
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 text-sm font-bold">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un paiement..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8 w-[300px]"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onClick={handleClearSearch}
              >
                ×
              </Button>
            )}
          </div>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
          )}
          
          
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(exportUrl ?? '', '_blank')}
            className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            disabled={!exportUrl}
            >
              📊 Exporter
            </Button>
          
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Colonnes
              <ChevronDown className="h-4 w-4" />
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
                    {column.id === 'reference' && 'Référence'}
                    {column.id === 'assignment.reference' && 'Dossier'}
                    {column.id === 'amount' && 'Montant'}
                    {column.id === 'date' && 'Date'}
                    {column.id === 'payment_type.label' && 'Type de paiement'}
                    {column.id === 'payment_method.label' && 'Méthode'}
                    {column.id === 'status.code' && 'Statut'}
                    {column.id === 'created_at' && 'Créé le'}
                    {column.id === 'actions' && 'Actions'}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* État de chargement */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Chargement des paiements...
            </div>
          </CardContent>
        </Card>
      )}

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
                  className="hover:bg-muted/50"
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
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="text-muted-foreground">
                      {searchQuery ? 'Aucun paiement trouvé pour cette recherche' : 'Aucun paiement trouvé'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {searchQuery ? 'Essayez de modifier vos critères de recherche' : 'Commencez par créer un nouveau paiement'}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 