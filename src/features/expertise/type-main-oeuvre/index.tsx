import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWorkforceTypesStore } from '@/stores/workforce-types'
import { WorkforceType } from '@/types/workforce-types'
import { DataTable } from './data-table'
import { DataTableToolbar } from './components/data-table-toolbar'
import { WorkforceTypeDialogs } from './components/workforce-type-dialogs'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { Calculator } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function WorkforceTypesPageContent() {
  const {
    workforceTypes,
    loading,
    fetchWorkforceTypes,
  } = useWorkforceTypesStore()

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedWorkforceType, setSelectedWorkforceType] = useState<WorkforceType | null>(null)

  // Search state
  const [searchValue, setSearchValue] = useState('')

  // Load data on component mount
  useEffect(() => {
    fetchWorkforceTypes(1)
  }, [fetchWorkforceTypes])

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  // Handle create
  const handleCreateClick = () => {
    setSelectedWorkforceType(null)
    setCreateDialogOpen(true)
  }

  // Handle view
  const handleView = (workforceType: WorkforceType) => {
    setSelectedWorkforceType(workforceType)
    setViewDialogOpen(true)
  }

  // Handle edit
  const handleEdit = (workforceType: WorkforceType) => {
    setSelectedWorkforceType(workforceType)
    setEditDialogOpen(true)
  }

  // Handle delete
  const handleDelete = (workforceType: WorkforceType) => {
    setSelectedWorkforceType(workforceType)
    setDeleteDialogOpen(true)
  }

  // Handle dialog changes
  const handleCreateDialogChange = (open: boolean) => {
    setCreateDialogOpen(open)
    if (!open) {
      setSelectedWorkforceType(null)
    }
  }

  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open)
    if (!open) {
      setSelectedWorkforceType(null)
    }
  }

  const handleViewDialogChange = (open: boolean) => {
    setViewDialogOpen(open)
    if (!open) {
      setSelectedWorkforceType(null)
    }
  }

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open)
    if (!open) {
      setSelectedWorkforceType(null)
    }
  }

  if (loading && workforceTypes.length === 0) {
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
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
    <div className="space-y-4">
      <div>
        <div>
          <h4 className="font-semibold text-base flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Types main d'oeuvre
        </h4>
        </div>
        <div>
          <div className="space-y-4">
            <DataTableToolbar
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
              onCreateClick={handleCreateClick}
            />
            <DataTable
              data={workforceTypes}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      <WorkforceTypeDialogs
        createDialogOpen={createDialogOpen}
        editDialogOpen={editDialogOpen}
        viewDialogOpen={viewDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        onCreateDialogChange={handleCreateDialogChange}
        onEditDialogChange={handleEditDialogChange}
        onViewDialogChange={handleViewDialogChange}
        onDeleteDialogChange={handleDeleteDialogChange}
        selectedWorkforceType={selectedWorkforceType}
      />
        </div>
        </Main>
        </>
  )
}

export default function WorkforceTypesPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_WORKFORCE_TYPE}>
      <WorkforceTypesPageContent />
    </ProtectedRoute>
  )
} 