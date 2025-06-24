import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useHourlyRatesStore } from '@/stores/hourly-rates'
import { HourlyRate } from '@/types/hourly-rates'
import { DataTable } from './data-table'
import { DataTableToolbar } from './components/data-table-toolbar'
import { HourlyRateDialogs } from './components/hourly-rate-dialogs'

export default function HorairesPeinturePage() {
  const {
    hourlyRates,
    loading,
    error,
    fetchHourlyRates,
    clearError,
  } = useHourlyRatesStore()

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedHourlyRate, setSelectedHourlyRate] = useState<HourlyRate | null>(null)

  // Search state
  const [searchValue, setSearchValue] = useState('')

  // Filtered data
  const filteredData = hourlyRates.filter((hourlyRate) =>
    hourlyRate.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    hourlyRate.description.toLowerCase().includes(searchValue.toLowerCase())
  )

  useEffect(() => {
    fetchHourlyRates()
  }, [fetchHourlyRates])

  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [error, clearError])

  const handleCreateClick = () => {
    setSelectedHourlyRate(null)
    setCreateDialogOpen(true)
  }

  const handleView = (hourlyRate: HourlyRate) => {
    setSelectedHourlyRate(hourlyRate)
    setViewDialogOpen(true)
  }

  const handleEdit = (hourlyRate: HourlyRate) => {
    setSelectedHourlyRate(hourlyRate)
    setEditDialogOpen(true)
  }

  const handleDelete = (hourlyRate: HourlyRate) => {
    setSelectedHourlyRate(hourlyRate)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Horaires Peinture</h1>
          <p className="text-muted-foreground">
            Gérez les tarifs horaires pour les travaux de peinture.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des horaires</CardTitle>
          <CardDescription>
            Consultez et gérez tous les tarifs horaires de peinture.
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

      <HourlyRateDialogs
        createDialogOpen={createDialogOpen}
        editDialogOpen={editDialogOpen}
        viewDialogOpen={viewDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        onCreateDialogChange={setCreateDialogOpen}
        onEditDialogChange={setEditDialogOpen}
        onViewDialogChange={setViewDialogOpen}
        onDeleteDialogChange={setDeleteDialogOpen}
        selectedHourlyRate={selectedHourlyRate}
      />
    </div>
  )
} 