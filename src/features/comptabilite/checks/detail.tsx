import { useState, useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useCheckStore } from '@/stores/checkStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Hash, 
  Calendar, 
  Building2, 
  CheckSquare, 
  EyeOff, 
  Activity, 
  Image, 
  User, 
  Edit,
  Trash2,
  Download,
  Eye
} from 'lucide-react'
import { Check } from '@/types/comptabilite'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export default function CheckDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { deleteCheck, fetchCheckById, loading, error } = useCheckStore()
  
  const [check, setCheck] = useState<Check | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchCheckDetail = async () => {
      try {
        const checkData = await fetchCheckById(id)
        setCheck(checkData)
      } catch (_error) {
        // Error handled by store
      }
    }

    if (id) {
      fetchCheckDetail()
    }
  }, [id, fetchCheckById])

  const handleDelete = async () => {
    if (!check) return
    
    try {
      setDeleting(true)
      await deleteCheck(check.id)
      toast.success('Chèque supprimé avec succès')
      navigate({ to: '/comptabilite/checks' })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      toast.error(errorMessage)
    } finally {
      setDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const getStatusBadge = (status: Check['status'] | null | undefined) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
    let label = "Inconnu"
    let icon = Activity

    if (status) {
      switch (status.code) {
        case 'active':
          variant = 'default'
          label = 'Encaissé'
          icon = CheckSquare
          break
        case 'pending':
          variant = 'secondary'
          label = 'En attente'
          icon = EyeOff
          break
        default:
          variant = 'outline'
          label = status.label || 'Inconnu'
      }
    }
    
    const IconComponent = icon
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Chargement des détails du chèque...</p>
        </div>
      </div>
    )
  }

  if (error || !check) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="text-destructive">
            <Activity className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Erreur de chargement</h3>
            <p className="text-muted-foreground">{error || 'Chèque non trouvé'}</p>
          </div>
          <Button onClick={() => navigate({ to: '/comptabilite/checks' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: '/comptabilite/checks' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Détails du chèque</h1>
            <p className="text-muted-foreground">Informations complètes sur le chèque {check.reference}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate({ to: `/comptabilite/check/edit/${check.id}` })}
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations du chèque */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Informations du chèque
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Référence</label>
                  <div className="p-3 bg-muted rounded-md">
                    <span className="font-mono text-sm">{check.reference}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{new Date(check.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Montant</label>
                  <div className="p-3 bg-muted rounded-md">
                    <span className="text-lg font-bold">
                      {parseFloat(check.amount).toLocaleString('fr-FR', { 
                        style: 'currency', 
                        currency: 'XOF' 
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Statut</label>
                  <div className="p-3 bg-muted rounded-md">
                    {getStatusBadge(check.status)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations bancaires et paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations bancaires et paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Banque</label>
                  <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {check.bank?.name || 'Non renseigné'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Paiement associé</label>
                  <div className="p-3 bg-muted rounded-md">
                    <span className="text-sm">
                      {check.payment?.reference || 'Non renseigné'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo du chèque */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Photo du chèque
              </CardTitle>
            </CardHeader>
            <CardContent>
              {check.photo ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Image className="mr-1 h-3 w-3" />
                      Photo disponible
                    </Badge>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <img 
                      src={check.photo} 
                      alt={`Photo du chèque ${check.reference}`}
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => check.photo && window.open(check.photo, '_blank')}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Voir en plein écran
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (check.photo) {
                          const link = document.createElement('a')
                          link.href = check.photo
                          link.download = `cheque-${check.reference}.jpg`
                          link.click()
                        }
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucune photo disponible</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informations de création */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations de création
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Créé par</label>
                <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{check.created_by.name}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Date de création</label>
                <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(check.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Dernière modification</label>
                <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(check.updated_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Modifié par</label>
                <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{check.updated_by.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate({ to: `/comptabilite/check/edit/${check.id}` })}
              >
                <Edit className="mr-2 h-4 w-4" />
                Modifier le chèque
              </Button>
              
              {check.photo && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => check.photo && window.open(check.photo, '_blank')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir la photo
                </Button>
              )}
              
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le chèque "{check.reference}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
