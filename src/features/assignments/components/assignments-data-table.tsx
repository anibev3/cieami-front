/* eslint-disable no-console */
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
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
import { Assignment } from '@/types/assignments'
import { createColumns } from '../columns'
import { AssignmentMutateDialog } from './assignment-mutate-dialog'
import { ViewAssignmentDialog } from './view-assignment-dialog'
import { DeleteAssignmentDialog } from './delete-assignment-dialog'
import { ReceiptModal } from './receipt-modal'
import { useAssignmentsStore } from '@/stores/assignments'
import { toast } from 'sonner'

interface AssignmentsDataTableProps {
  data: Assignment[]
}

export function AssignmentsDataTable({ data }: AssignmentsDataTableProps) {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null)
  
  const { deleteAssignment } = useAssignmentsStore()

  const handleViewDetail = (assignmentId: number) => {
    navigate({ to: `/assignments/${assignmentId}` })
  }

  const handleDelete = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedAssignment) return
    
    try {
      await deleteAssignment(selectedAssignment.id)
      toast.success('Assignation supprimée avec succès')
      setIsDeleteDialogOpen(false)
      setSelectedAssignment(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleOpenReceiptModal = async (assignmentId: number, _amount: number) => {
    console.log('handleOpenReceiptModal appelé avec:', { assignmentId })
    setSelectedAssignmentId(assignmentId)
    setIsReceiptModalOpen(true)
  }

  const handleReceiptSave = (_receipts: any[]) => {
    toast.success('Quittances sauvegardées avec succès')
    setIsReceiptModalOpen(false)
  }

  const handleReceiptClose = () => {
    setIsReceiptModalOpen(false)
    setSelectedAssignmentId(null)
  }

  const columns = createColumns({
    onDelete: handleDelete,
    onOpenReceiptModal: handleOpenReceiptModal,
    onViewDetail: handleViewDetail,
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
    <>
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
      <ViewAssignmentDialog
        assignment={selectedAssignment}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
      
      <AssignmentMutateDialog
        id={selectedAssignment?.id || null}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      
      <DeleteAssignmentDialog
        assignment={selectedAssignment}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />

      {/* Modal de quittances */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        assignmentId={selectedAssignmentId || 0}
        onSave={handleReceiptSave}
        onClose={handleReceiptClose}
      />
    </>
  )
} 