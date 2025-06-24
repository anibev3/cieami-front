import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useBodyworksStore } from '@/stores/bodyworks'
import { Bodywork } from '@/types/bodyworks'
import { DataTable } from './data-table'
import { DataTableToolbar } from './components/data-table-toolbar'
import { BodyworkDialogs } from './components/bodywork-dialogs'
import { Skeleton } from '@/components/ui/skeleton'

export default function BodyworksPage() {
  const {
    bodyworks,
    loading,
    fetchBodyworks,
  } = useBodyworksStore()

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBodywork, setSelectedBodywork] = useState<Bodywork | null>(null)

  // Search state
  const [searchValue, setSearchValue] = useState('')

  // Load data on component mount
  useEffect(() => {
    fetchBodyworks(1)
  }, [fetchBodyworks])

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  // Handle create
  const handleCreateClick = () => {
    setSelectedBodywork(null)
    setCreateDialogOpen(true)
  }

  // Handle view
  const handleView = (bodywork: Bodywork) => {
    setSelectedBodywork(bodywork)
    setViewDialogOpen(true)
  }

  // Handle edit
  const handleEdit = (bodywork: Bodywork) => {
    setSelectedBodywork(bodywork)
    setEditDialogOpen(true)
  }

  // Handle delete
  const handleDelete = (bodywork: Bodywork) => {
    setSelectedBodywork(bodywork)
    setDeleteDialogOpen(true)
  }

  // Handle dialog changes
  const handleCreateDialogChange = (open: boolean) => {
    setCreateDialogOpen(open)
    if (!open) {
      setSelectedBodywork(null)
    }
  }

  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open)
    if (!open) {
      setSelectedBodywork(null)
    }
  }

  const handleViewDialogChange = (open: boolean) => {
    setViewDialogOpen(open)
    if (!open) {
      setSelectedBodywork(null)
    }
  }

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open)
    if (!open) {
      setSelectedBodywork(null)
    }
  }

  if (loading && bodyworks.length === 0) {
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
          <CardTitle>Carrosseries</CardTitle>
          <CardDescription>
            Gérez les différents types de carrosseries disponibles dans le système.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <DataTableToolbar
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
              onCreateClick={handleCreateClick}
            />
            <DataTable
              data={bodyworks}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </CardContent>
      </Card>

      <BodyworkDialogs
        createDialogOpen={createDialogOpen}
        editDialogOpen={editDialogOpen}
        viewDialogOpen={viewDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        onCreateDialogChange={handleCreateDialogChange}
        onEditDialogChange={handleEditDialogChange}
        onViewDialogChange={handleViewDialogChange}
        onDeleteDialogChange={handleDeleteDialogChange}
        selectedBodywork={selectedBodywork}
      />
    </div>
  )
} 