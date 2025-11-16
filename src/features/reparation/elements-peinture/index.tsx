import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNumberPaintElementsStore } from '@/stores/number-paint-elements'
import { NumberPaintElement } from '@/types/number-paint-elements'
import { DataTable } from './data-table'
import { DataTableToolbar } from './components/data-table-toolbar'
import { NumberPaintElementDialogs } from './components/number-paint-element-dialogs'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function ElementsPeinturePageContent() {
  const {
    numberPaintElements,
    loading,
    error,
    fetchNumberPaintElements,
    clearError,
  } = useNumberPaintElementsStore()

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedNumberPaintElement, setSelectedNumberPaintElement] = useState<NumberPaintElement | null>(null)

  // Search state
  const [searchValue, setSearchValue] = useState('')

  // Filtered data
  const filteredData = numberPaintElements.filter((numberPaintElement) =>
    numberPaintElement.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    numberPaintElement.description.toLowerCase().includes(searchValue.toLowerCase())
  )

  useEffect(() => {
    fetchNumberPaintElements()
  }, [fetchNumberPaintElements])

  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [error, clearError])

  const handleCreateClick = () => {
    setSelectedNumberPaintElement(null)
    setCreateDialogOpen(true)
  }

  const handleView = (numberPaintElement: NumberPaintElement) => {
    setSelectedNumberPaintElement(numberPaintElement)
    setViewDialogOpen(true)
  }

  const handleEdit = (numberPaintElement: NumberPaintElement) => {
    setSelectedNumberPaintElement(numberPaintElement)
    setEditDialogOpen(true)
  }

  const handleDelete = (numberPaintElement: NumberPaintElement) => {
    setSelectedNumberPaintElement(numberPaintElement)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Éléments de Peinture</h1>
          <p className="text-muted-foreground">
            Gérez les éléments de peinture et leurs valeurs numériques.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des éléments</CardTitle>
          <CardDescription>
            Consultez et gérez tous les éléments de peinture.
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

      <NumberPaintElementDialogs
        createDialogOpen={createDialogOpen}
        editDialogOpen={editDialogOpen}
        viewDialogOpen={viewDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        onCreateDialogChange={setCreateDialogOpen}
        onEditDialogChange={setEditDialogOpen}
        onViewDialogChange={setViewDialogOpen}
        onDeleteDialogChange={setDeleteDialogOpen}
        selectedNumberPaintElement={selectedNumberPaintElement}
      />
    </div>
  )
}

export default function ElementsPeinturePage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_NUMBER_PAINT_ELEMENT}>
      <ElementsPeinturePageContent />
    </ProtectedRoute>
  )
} 