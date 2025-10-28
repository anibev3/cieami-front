import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaintTypesStore } from '@/stores/paint-types'
import { PaintType } from '@/types/paint-types'
import { DataTable } from './data-table'
import { DataTableToolbar } from './components/data-table-toolbar'
import { PaintTypeDialogs } from './components/paint-type-dialogs'
import { Skeleton } from '@/components/ui/skeleton'
import { Search } from '@/components/search'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export default function PaintTypesPage() {
  const { 
    paintTypes, 
    loading, 
    fetchPaintTypes 
  } = usePaintTypesStore()

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPaintType, setSelectedPaintType] = useState<PaintType | null>(null)

  // Search state
  const [searchValue, setSearchValue] = useState('')

  // Load data on component mount
  useEffect(() => {
    fetchPaintTypes(1, searchValue)
  }, [fetchPaintTypes, searchValue])

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  // Handle create
  const handleCreateClick = () => {
    setSelectedPaintType(null)
    setCreateDialogOpen(true)
  }

  // Handle view
  const handleView = (paintType: PaintType) => {
    setSelectedPaintType(paintType)
    setViewDialogOpen(true)
  }

  // Handle edit
  const handleEdit = (paintType: PaintType) => {
    setSelectedPaintType(paintType)
    setEditDialogOpen(true)
  }

  // Handle delete
  const handleDelete = (paintType: PaintType) => {
    setSelectedPaintType(paintType)
    setDeleteDialogOpen(true)
  }

  // Handle dialog changes
  const handleCreateDialogChange = (open: boolean) => {
    setCreateDialogOpen(open)
    if (!open) {
      setSelectedPaintType(null)
    }
  }

  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open)
    if (!open) {
      setSelectedPaintType(null)
    }
  }

  const handleViewDialogChange = (open: boolean) => {
    setViewDialogOpen(open)
    if (!open) {
      setSelectedPaintType(null)
    }
  }

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open)
    if (!open) {
      setSelectedPaintType(null)
    }
  }

  if (loading && paintTypes.length === 0) {
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
        <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
    <div className="space-y-4">
      <Card className='p-0 shadow-none border-0'>
        <CardHeader className='p-0'>
          <CardTitle>Types de peinture</CardTitle>
          <CardDescription>
            Gérez les différents types de peinture disponibles dans le système.
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <div className="space-y-4">
            {/* <DataTableToolbar
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
              onCreateClick={handleCreateClick}
            /> */}
            <DataTable
              data={paintTypes}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreateClick={handleCreateClick}
            />
          </div>
        </CardContent>
      </Card>

      <PaintTypeDialogs
        createDialogOpen={createDialogOpen}
        editDialogOpen={editDialogOpen}
        viewDialogOpen={viewDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        onCreateDialogChange={handleCreateDialogChange}
        onEditDialogChange={handleEditDialogChange}
        onViewDialogChange={handleViewDialogChange}
        onDeleteDialogChange={handleDeleteDialogChange}
        selectedPaintType={selectedPaintType}
      />
        </div>
      </Main>
      </>
  )
} 