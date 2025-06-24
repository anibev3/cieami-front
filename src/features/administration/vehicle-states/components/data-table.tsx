import { useState } from 'react'
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
import { VehicleState } from '@/types/vehicle-states'
import { createColumns } from '../columns'
import { VehicleStateMutateDialog } from './vehicle-state-mutate-dialog'
import { ViewVehicleStateDialog } from './view-vehicle-state-dialog'
import { DeleteVehicleStateDialog } from './delete-vehicle-state-dialog'
import { useVehicleStatesStore } from '@/stores/vehicle-states'
import { toast } from 'sonner'

interface DataTableProps {
  data: VehicleState[]
  loading?: boolean
}

export function DataTable({ data, loading }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  
  const [selectedVehicleState, setSelectedVehicleState] = useState<VehicleState | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const { deleteVehicleState } = useVehicleStatesStore()

  const handleView = (vehicleState: VehicleState) => {
    setSelectedVehicleState(vehicleState)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (vehicleState: VehicleState) => {
    setSelectedVehicleState(vehicleState)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (vehicleState: VehicleState) => {
    setSelectedVehicleState(vehicleState)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedVehicleState) return
    
    try {
      await deleteVehicleState(selectedVehicleState.id)
      toast.success('État de véhicule supprimé avec succès')
      setIsDeleteDialogOpen(false)
      setSelectedVehicleState(null)
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
      <ViewVehicleStateDialog
        vehicleState={selectedVehicleState}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
      
      <VehicleStateMutateDialog
        id={selectedVehicleState?.id || null}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      
      <DeleteVehicleStateDialog
        vehicleState={selectedVehicleState}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
} 