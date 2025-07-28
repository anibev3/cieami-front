/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Vehicle } from '@/types/vehicles'
import { createColumns } from '../columns'
import { VehicleMutateDialog } from './vehicle-mutate-dialog'
import { ViewVehicleDialog } from './view-vehicle-dialog'
import { DeleteVehicleDialog } from './delete-vehicle-dialog'
import { useVehiclesStore } from '@/stores/vehicles'
import { toast } from 'sonner'

export function DataTable() {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const { vehicles, loading, deleteVehicle } = useVehiclesStore()

  const handleCreate = () => {
    setSelectedVehicle(null)
    setIsCreateDialogOpen(true)
  }

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (vehicle: Vehicle) => {
    // eslint-disable-next-line no-console
    console.log('handleEdit called with vehicle:', vehicle)
    navigate({ to: `/administration/vehicle/${vehicle.id}/edit` })
  }

  const handleDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedVehicle) return
    
    try {
      await deleteVehicle(selectedVehicle.id)
      toast.success('Véhicule supprimé avec succès')
      setIsDeleteDialogOpen(false)
      setSelectedVehicle(null)
    } catch (error) {
      // Error handled by store
    }
  }

  const columns = createColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  // eslint-disable-next-line no-console
  console.log('DataTable - vehicles count:', vehicles.length)
  // eslint-disable-next-line no-console
  console.log('DataTable - selectedVehicle:', selectedVehicle)

  const table = useReactTable({
    data: vehicles,
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
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Rechercher..."
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau véhicule
        </Button>
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
      <VehicleMutateDialog
        key="create-dialog"
        id={null}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      
      <ViewVehicleDialog
        vehicle={selectedVehicle}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
      

      
      <DeleteVehicleDialog
        vehicle={selectedVehicle}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
} 