import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AscertainmentTypeDataTable } from './components/data-table'
import {
  CreateAscertainmentTypeDialog,
  EditAscertainmentTypeDialog,
  ViewAscertainmentTypeDialog,
  DeleteAscertainmentTypeDialog
} from './components/ascertainment-type-dialogs'
import { AscertainmentType } from '@/services/ascertainmentTypeService'

export default function ConstatTypePage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAscertainmentType, setSelectedAscertainmentType] = useState<AscertainmentType | null>(null)

  const handleCreate = () => {
    setCreateDialogOpen(true)
  }

  const handleView = (ascertainmentType: AscertainmentType) => {
    setSelectedAscertainmentType(ascertainmentType)
    setViewDialogOpen(true)
  }

  const handleEdit = (ascertainmentType: AscertainmentType) => {
    setSelectedAscertainmentType(ascertainmentType)
    setEditDialogOpen(true)
  }

  const handleDelete = (ascertainmentType: AscertainmentType) => {
    setSelectedAscertainmentType(ascertainmentType)
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
            <h1 className="text-3xl font-bold tracking-tight">Types de constat</h1>
            <p className="text-muted-foreground">
              Gérez les différents types de constat utilisés dans le système.
            </p>
          </div>

          <AscertainmentTypeDataTable
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />
        </div>

        {/* Dialogues */}
        <CreateAscertainmentTypeDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />

        <EditAscertainmentTypeDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          ascertainmentType={selectedAscertainmentType}
        />

        <ViewAscertainmentTypeDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          ascertainmentType={selectedAscertainmentType}
        />

        <DeleteAscertainmentTypeDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          ascertainmentType={selectedAscertainmentType}
        />
      </Main>
    </>
  )
} 