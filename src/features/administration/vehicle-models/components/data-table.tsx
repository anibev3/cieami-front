import { useState, useCallback, useEffect } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
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
import { Pagination } from '@/components/ui/pagination'
import { VehicleModel } from '@/types/vehicle-models'
import { createColumns } from '../columns'
import { VehicleModelMutateDialog } from './vehicle-model-mutate-dialog'
import { ViewVehicleModelDialog } from './view-vehicle-model-dialog'
import { DeleteVehicleModelDialog } from './delete-vehicle-model-dialog'
import { useVehicleModelsStore } from '@/stores/vehicle-models'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from 'sonner'

interface DataTableProps {
  data: VehicleModel[]
  loading?: boolean
  onSearch?: (search: string) => void
  onPageChange?: (page: number) => void
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    perPage: number
  }
  searchValue?: string
}

export function DataTable({ 
  data, 
  loading, 
  onSearch, 
  onPageChange, 
  pagination,
  searchValue = ''
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [localSearchValue, setLocalSearchValue] = useState(searchValue)
  
  const [selectedVehicleModel, setSelectedVehicleModel] = useState<VehicleModel | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const { deleteVehicleModel } = useVehicleModelsStore()

  // Debounce pour la recherche
  const debouncedSearch = useDebounce(localSearchValue, 500)

  // Appeler onSearch quand la recherche debounced change
  useEffect(() => {
    if (onSearch && debouncedSearch !== searchValue) {
      onSearch(debouncedSearch)
    }
  }, [debouncedSearch, onSearch, searchValue])

  const handleView = (vehicleModel: VehicleModel) => {
    setSelectedVehicleModel(vehicleModel)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (vehicleModel: VehicleModel) => {
    setSelectedVehicleModel(vehicleModel)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (vehicleModel: VehicleModel) => {
    setSelectedVehicleModel(vehicleModel)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedVehicleModel) return
    
    try {
      await deleteVehicleModel(selectedVehicleModel.id)
      toast.success('Modèle de véhicule supprimé avec succès')
      setIsDeleteDialogOpen(false)
      setSelectedVehicleModel(null)
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
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    manualPagination: true, // Pagination côté serveur
    manualFiltering: true,  // Filtrage côté serveur
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
          value={localSearchValue}
          onChange={(event) => setLocalSearchValue(event.target.value)}
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

      {/* Pagination */}
      {pagination && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            perPage={pagination.perPage}
            onPageChange={onPageChange || (() => {})}
            loading={loading}
          />
        </div>
      )}

      {/* Dialogs */}
      <ViewVehicleModelDialog
        vehicleModel={selectedVehicleModel}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
      
      <VehicleModelMutateDialog
        id={selectedVehicleModel?.id || null}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      
      <DeleteVehicleModelDialog
        vehicleModel={selectedVehicleModel}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
} 