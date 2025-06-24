import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Brand } from '@/types/brands'
import { createColumns } from '../columns'
import { BrandMutateDialog } from './brand-mutate-dialog'
import { ViewBrandDialog } from './view-brand-dialog'
import { DeleteBrandDialog } from './delete-brand-dialog'
import { useBrandsStore } from '@/stores/brands'
import { toast } from 'sonner'

interface DataTableProps {
  data: Brand[]
  loading?: boolean
}

export function DataTable({ data, loading }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const { deleteBrand } = useBrandsStore()

  const handleView = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedBrand) return
    
    try {
      await deleteBrand(selectedBrand.id)
      toast.success('Marque supprimée avec succès')
      setIsDeleteDialogOpen(false)
      setSelectedBrand(null)
    } catch (error) {
      // Error handled by store
    }
  }

  const columns = createColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Rechercher..."
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <ViewBrandDialog
        brand={selectedBrand}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
      
      <BrandMutateDialog
        id={selectedBrand?.id || null}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      
      <DeleteBrandDialog
        brand={selectedBrand}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
} 