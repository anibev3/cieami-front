import React, { useState, useMemo } from 'react'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronDown, 
  Settings2, 
  Download,
  BarChart3,
  Eye,
  EyeOff
} from 'lucide-react'
import { AssignmentStatistics } from '@/types/assignments'
import { createStatisticsColumns, StatisticsData } from './statistics-columns'
import { formatCurrency } from '@/utils/format-currency'

interface StatisticsDataTableProps {
  statistics: AssignmentStatistics
}

export function StatisticsDataTable({ statistics }: StatisticsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('')

  // Transformer les données pour le DataTable
  const data = useMemo(() => {
    const countMap = new Map()
    const amountMap = new Map()

    // Créer des maps pour les données de comptage
    statistics.assignments_by_year_and_month_count?.forEach(item => {
      const key = `${item.year}-${item.month}`
      const { count, ...filterData } = item
      countMap.set(key, {
        count,
        ...filterData // Inclure toutes les propriétés des filtres
      })
    })

    // Créer des maps pour les données de montant
    statistics.assignments_by_year_and_month_amount?.forEach(item => {
      const key = `${item.year}-${item.month}`
      const { amount, ...filterData } = item
      amountMap.set(key, {
        amount: parseFloat(amount),
        ...filterData // Inclure toutes les propriétés des filtres
      })
    })

    // Calculer les totaux pour les pourcentages
    const totalCount = statistics.assignments_by_year_and_month_count?.reduce((total, item) => total + item.count, 0) || 0
    const totalAmount = statistics.assignments_by_year_and_month_amount?.reduce((total, item) => total + parseFloat(item.amount), 0) || 0

    // Combiner toutes les clés uniques
    const allKeys = new Set([...countMap.keys(), ...amountMap.keys()])
    
    return Array.from(allKeys).map(key => {
      const [year, month] = key.split('-').map(Number)
      const countData = countMap.get(key) || { count: 0 }
      const amountData = amountMap.get(key) || { amount: 0 }
      
      return {
        year,
        month,
        count: countData.count,
        amount: amountData.amount,
        countPercentage: totalCount > 0 ? (countData.count / totalCount) * 100 : 0,
        amountPercentage: totalAmount > 0 ? (amountData.amount / totalAmount) * 100 : 0,
        // Fusionner les données des filtres
        assignment_type: countData.assignment_type || amountData.assignment_type,
        expertise_type: countData.expertise_type || amountData.expertise_type,
        vehicle: countData.vehicle || amountData.vehicle,
        repairer: countData.repairer || amountData.repairer,
        client: countData.client || amountData.client,
        insurer: countData.insurer || amountData.insurer,
        status: countData.status || amountData.status,
        created_by: countData.created_by || amountData.created_by,
        realized_by: countData.realized_by || amountData.realized_by,
        edited_by: countData.edited_by || amountData.edited_by,
        validated_by: countData.validated_by || amountData.validated_by,
        directed_by: countData.directed_by || amountData.directed_by,
        claim_nature: countData.claim_nature || amountData.claim_nature,
      } as StatisticsData
    }).sort((a, b) => {
      // Trier par année puis par mois
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })
  }, [statistics])

  const columns = useMemo(() => createStatisticsColumns(), [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  })

  // Calculer les totaux
  const totalCount = data.reduce((total, item) => total + item.count, 0)
  const totalAmount = data.reduce((total, item) => total + item.amount, 0)

  return (
    <div className="w-full space-y-4">
      {/* En-tête avec résumé et contrôles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Statistiques détaillées</h3>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              {totalCount} dossiers total
            </Badge>
            <Badge variant="secondary">
              {formatCurrency(totalAmount)} montant total
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Bouton d'export */}
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          
          {/* Menu des colonnes */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="mr-2 h-4 w-4" />
                Colonnes
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
                      <div className="flex items-center gap-2">
                        {column.getIsVisible() ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                        {column.id}
                      </div>
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Barre de recherche globale */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Rechercher dans toutes les colonnes..."
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tableau */}
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
                  Aucune donnée disponible pour cette période
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
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
} 