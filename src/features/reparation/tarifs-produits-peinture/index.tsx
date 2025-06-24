import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaintProductPricesStore } from '@/stores/paint-product-prices'
import { PaintProductPrice } from '@/types/paint-product-prices'
import { DataTable } from './data-table'
import { DataTableToolbar } from './components/data-table-toolbar'
import { PaintProductPriceDialogs } from './components/paint-product-price-dialogs'

export default function TarifsProduitsPeinturePage() {
  const {
    paintProductPrices,
    loading,
    error,
    fetchPaintProductPrices,
    clearError,
  } = usePaintProductPricesStore()

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPaintProductPrice, setSelectedPaintProductPrice] = useState<PaintProductPrice | null>(null)

  // Search state
  const [searchValue, setSearchValue] = useState('')

  // Filtered data
  const filteredData = paintProductPrices.filter((paintProductPrice) =>
    paintProductPrice.paint_type.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    paintProductPrice.number_paint_element.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  useEffect(() => {
    fetchPaintProductPrices()
  }, [fetchPaintProductPrices])

  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [error, clearError])

  const handleCreateClick = () => {
    setSelectedPaintProductPrice(null)
    setCreateDialogOpen(true)
  }

  const handleView = (paintProductPrice: PaintProductPrice) => {
    setSelectedPaintProductPrice(paintProductPrice)
    setViewDialogOpen(true)
  }

  const handleEdit = (paintProductPrice: PaintProductPrice) => {
    setSelectedPaintProductPrice(paintProductPrice)
    setEditDialogOpen(true)
  }

  const handleDelete = (paintProductPrice: PaintProductPrice) => {
    setSelectedPaintProductPrice(paintProductPrice)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tarifs Produits Peinture</h1>
          <p className="text-muted-foreground">
            Gérez les tarifs pour les produits de peinture selon le type et le nombre d'éléments.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des tarifs</CardTitle>
          <CardDescription>
            Consultez et gérez tous les tarifs de produits peinture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onCreateClick={handleCreateClick}
          />
          
          <div className="mt-4">
            <DataTable
              data={filteredData}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {loading && (
            <div className="mt-4 text-center text-muted-foreground">
              Chargement...
            </div>
          )}

          {error && (
            <div className="mt-4 text-center text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <PaintProductPriceDialogs
        createDialogOpen={createDialogOpen}
        editDialogOpen={editDialogOpen}
        viewDialogOpen={viewDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        onCreateDialogChange={setCreateDialogOpen}
        onEditDialogChange={setEditDialogOpen}
        onViewDialogChange={setViewDialogOpen}
        onDeleteDialogChange={setDeleteDialogOpen}
        selectedPaintProductPrice={selectedPaintProductPrice}
      />
    </div>
  )
} 