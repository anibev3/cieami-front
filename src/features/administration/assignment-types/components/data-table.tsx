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
import { AssignmentType } from '@/types/assignment-types'
import { createColumns } from '../columns'
import { AssignmentTypeMutateDialog } from './assignment-type-mutate-dialog'
import { ViewAssignmentTypeDialog } from './view-assignment-type-dialog'
import { DeleteAssignmentTypeDialog } from './delete-assignment-type-dialog'
import { useAssignmentTypesStore } from '@/stores/assignmentTypes'
import { toast } from 'sonner'

export function DataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  
  const [selectedAssignmentType, setSelectedAssignmentType] = useState<AssignmentType | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const { assignmentTypes, loading, deleteAssignmentType } = useAssignmentTypesStore()

  const handleView = (assignmentType: AssignmentType) => {
    setSelectedAssignmentType(assignmentType)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (assignmentType: AssignmentType) => {
    setSelectedAssignmentType(assignmentType)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (assignmentType: AssignmentType) => {
    setSelectedAssignmentType(assignmentType)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedAssignmentType) return
    
    try {
      await deleteAssignmentType(selectedAssignmentType.id)
      toast.success('Type d\'affectation supprimé avec succès')
      setIsDeleteDialogOpen(false)
      setSelectedAssignmentType(null)
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
    data: assignmentTypes,
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
      <ViewAssignmentTypeDialog
        assignmentType={selectedAssignmentType}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
      
      <AssignmentTypeMutateDialog
        id={selectedAssignmentType?.id || null}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      
      <DeleteAssignmentTypeDialog
        assignmentType={selectedAssignmentType}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
} 