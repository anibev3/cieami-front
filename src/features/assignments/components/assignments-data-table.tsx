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
import { Loader2, Database, Clock } from 'lucide-react'

interface AssignmentsDataTableProps {
  data: Assignment[]
  loading?: boolean
}

export function AssignmentsDataTable({ data, loading = false }: AssignmentsDataTableProps) {
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
            {loading ? (
              // Loading state with skeleton rows
              <>
                {Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={`loading-${index}`} className="animate-pulse">
                    {Array.from({ length: columns.length }).map((_, cellIndex) => (
                      <TableCell key={`loading-cell-${index}-${cellIndex}`} className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          {cellIndex === 0 && (
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {/* Loading indicator row */}
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-8">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="relative">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping"></div>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium text-gray-700 flex items-center justify-center gap-2">
                          <Database className="h-4 w-4 text-blue-500" />
                          Chargement des dossiers...
                        </p>
                        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" />
                          Veuillez patienter
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </>
            ) : table.getRowModel().rows?.length ? (
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