import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ClientsDataTable } from './data-table'
import { ClientsDialogs } from './clients-dialogs'
import { useClientsStore } from './store'
import { Client } from './types'

export default function ClientsPage() {
  const navigate = useNavigate()
  const { fetchClients } = useClientsStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const handleCreate = () => {
    setSelectedClient(null)
    setIsCreateOpen(true)
  }

  const handleView = (client: Client) => {
    navigate({ to: `/gestion/client/${client.id}` })
  }

  const handleEdit = (client: Client) => {
    setSelectedClient(client)
    setIsEditOpen(true)
  }

  const handleDelete = (client: Client) => {
    setSelectedClient(client)
    setIsDeleteOpen(true)
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
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Clients</h2>
            <p className='text-muted-foreground'>Gérez les clients du système</p>
          </div>
          <button className='btn btn-primary' onClick={handleCreate}>Nouveau client</button>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <ClientsDataTable
            data={useClientsStore.getState().clients}
            loading={useClientsStore.getState().loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Main>
      <ClientsDialogs
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={false}
        isDeleteOpen={isDeleteOpen}
        selectedClient={selectedClient}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => {}}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
} 