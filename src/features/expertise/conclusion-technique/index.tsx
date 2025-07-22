import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTechnicalConclusionsStore } from '@/stores/technical-conclusions'
import { TechnicalConclusionMutateDialog } from './components/technical-conclusion-mutate-dialog'
import { DataTable } from './components/data-table'
import { createColumns } from './components/columns'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function ConclusionTechniquePage() {
  const { 
    technicalConclusions, 
    loading, 
    error, 
    fetchTechnicalConclusions, 
    deleteTechnicalConclusion 
  } = useTechnicalConclusionsStore()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingConclusion, setEditingConclusion] = useState<number | null>(null)
  const [viewingConclusion, setViewingConclusion] = useState<number | null>(null)

  useEffect(() => {
    fetchTechnicalConclusions()
  }, [fetchTechnicalConclusions])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette conclusion technique ?')) {
      const success = await deleteTechnicalConclusion(id)
      if (success) {
        toast.success('Conclusion technique supprimée avec succès')
      }
    }
  }

  const handleCreateSuccess = () => {
    setShowCreateDialog(false)
    fetchTechnicalConclusions()
  }

  const columns = createColumns({
    onView: (id) => setViewingConclusion(id),
    onEdit: (id) => setEditingConclusion(id),
    onDelete: handleDelete,
  })

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Conclusions Techniques</h1>
          <p className="text-muted-foreground">
            Gérez les conclusions techniques pour les expertises
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une conclusion
        </Button>
      </div>

      {/* DataTable */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Conclusions Techniques ({technicalConclusions.length})
          </CardTitle>
          <CardDescription>
            Liste de toutes les conclusions techniques disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Chargement...</p>
            </div>
          ) : (
            <DataTable columns={columns} data={technicalConclusions} />
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <TechnicalConclusionMutateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Dialog */}
      <TechnicalConclusionMutateDialog
        id={editingConclusion}
        open={!!editingConclusion}
        onOpenChange={(open) => !open && setEditingConclusion(null)}
        onSuccess={() => {
          setEditingConclusion(null)
          fetchTechnicalConclusions()
        }}
      />

      {/* View Dialog */}
      {viewingConclusion && (
        <TechnicalConclusionMutateDialog
          id={viewingConclusion}
          open={!!viewingConclusion}
          onOpenChange={(open) => !open && setViewingConclusion(null)}
        />
      )}
    </div>
  )
} 



