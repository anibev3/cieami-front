import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaintingPricesStore } from '@/stores/painting-prices'
import { PaintingPrice } from '@/types/painting-prices'
import { DataTable } from './data-table'
import { DataTableToolbar } from './components/data-table-toolbar'
import { PaintingPriceDialogs } from './components/painting-price-dialogs'
import { Skeleton } from '@/components/ui/skeleton'

export default function PaintingPricesPage() {
  const {
    paintingPrices,
    loading,
    fetchPaintingPrices,
  } = usePaintingPricesStore()

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPaintingPrice, setSelectedPaintingPrice] = useState<PaintingPrice | null>(null)

  // Load data on component mount
  useEffect(() => {
    fetchPaintingPrices(1)
  }, [fetchPaintingPrices])

  // Handle create
  const handleCreateClick = () => {
    setSelectedPaintingPrice(null)
    setCreateDialogOpen(true)
  }

  // Handle view
  const handleView = (paintingPrice: PaintingPrice) => {
    setSelectedPaintingPrice(paintingPrice)
    setViewDialogOpen(true)
  }

  // Handle edit
  const handleEdit = (paintingPrice: PaintingPrice) => {
    setSelectedPaintingPrice(paintingPrice)
    setEditDialogOpen(true)
  }

  // Handle delete
  const handleDelete = (paintingPrice: PaintingPrice) => {
    setSelectedPaintingPrice(paintingPrice)
    setDeleteDialogOpen(true)
  }

  // Handle dialog changes
  const handleCreateDialogChange = (open: boolean) => {
    setCreateDialogOpen(open)
    if (!open) {
      setSelectedPaintingPrice(null)
    }
  }

  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open)
    if (!open) {
      setSelectedPaintingPrice(null)
    }
  }

  const handleViewDialogChange = (open: boolean) => {
    setViewDialogOpen(open)
    if (!open) {
      setSelectedPaintingPrice(null)
    }
  }

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open)
    if (!open) {
      setSelectedPaintingPrice(null)
    }
  }

  if (loading && paintingPrices.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Prix de peinture</CardTitle>
          <CardDescription>
            Gérez les prix de peinture avec leurs paramètres et relations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <DataTableToolbar onCreateClick={handleCreateClick} />
            <DataTable
              data={paintingPrices}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </CardContent>
      </Card>

      <PaintingPriceDialogs
        createDialogOpen={createDialogOpen}
        editDialogOpen={editDialogOpen}
        viewDialogOpen={viewDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        onCreateDialogChange={handleCreateDialogChange}
        onEditDialogChange={handleEditDialogChange}
        onViewDialogChange={handleViewDialogChange}
        onDeleteDialogChange={handleDeleteDialogChange}
        selectedPaintingPrice={selectedPaintingPrice}
      />
    </div>
  )
} 