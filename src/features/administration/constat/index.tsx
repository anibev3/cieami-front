import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AscertainmentDataTable } from './components/data-table'
import {
  CreateAscertainmentDialog,
  EditAscertainmentDialog,
  ViewAscertainmentDialog,
  DeleteAscertainmentDialog
} from './components/ascertainment-dialogs'
import { Ascertainment } from '@/services/ascertainmentService'
import { useNavigate } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function ConstatPageContent() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedAscertainment, setSelectedAscertainment] = useState<Ascertainment | null>(null)
    const navigate = useNavigate()

  const handleCreate = () => {
    //   setCreateDialogOpen(true)
      navigate({ to: '/administration/constat/create' })
  }

  const handleView = (ascertainment: Ascertainment) => {
    setSelectedAscertainment(ascertainment)
      // setViewDialogOpen(true)
      navigate({ to: '/administration/constat/details/$id', params: { id: ascertainment.id.toString() } })
  }

  const handleEdit = (ascertainment: Ascertainment) => {
    setSelectedAscertainment(ascertainment)
    setEditDialogOpen(true)
  }

  const handleDelete = (ascertainment: Ascertainment) => {
    setSelectedAscertainment(ascertainment)
    setDeleteDialogOpen(true)
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
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Constats</h1>
            <p className="text-muted-foreground">
              Gérez les constats d'expertise automobile.
            </p>
          </div>

          <AscertainmentDataTable
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />
        </div>

        {/* Dialogues */}
        <CreateAscertainmentDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />

        <EditAscertainmentDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          ascertainment={selectedAscertainment}
        />

        <ViewAscertainmentDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          ascertainment={selectedAscertainment}
        />

        <DeleteAscertainmentDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          ascertainment={selectedAscertainment}
        />
      </Main>
    </>
  )
}

export default function ConstatPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_ASCERTAINMENT}>
      <ConstatPageContent />
    </ProtectedRoute>
  )
} 