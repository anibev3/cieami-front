import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useClientsStore } from '@/features/gestion/clients/store'
import { Client } from '@/features/gestion/clients/types'
import { ArrowLeft, Edit, Trash2, User, Mail, Phone, MapPin, Calendar, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function ClientDetailsPageContent() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { fetchClient, updateClient, deleteClient, selectedClient, loading, error } = useClientsStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editedClient, setEditedClient] = useState<Partial<Client>>({})

  useEffect(() => {
    if (id) {
      fetchClient(id)
    }
  }, [id, fetchClient])

  useEffect(() => {
    if (selectedClient) {
      setEditedClient(selectedClient)
    }
  }, [selectedClient])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!selectedClient) return
    
    try {
      await updateClient(selectedClient.id, editedClient)
      setIsEditing(false)
      toast.success('Client modifié avec succès')
    } catch (_error) {
      toast.error('Erreur lors de la modification du client')
    }
  }

  const handleCancel = () => {
    setEditedClient(selectedClient || {})
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!selectedClient) return
    
    try {
      await deleteClient(selectedClient.id)
      toast.success('Client supprimé avec succès')
      navigate({ to: '/gestion/clients' })
    } catch (_error) {
      toast.error('Erreur lors de la suppression du client')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
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
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Main>
      </>
    )
  }

  if (error || !selectedClient) {
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
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-muted-foreground">Client non trouvé</p>
              <Button onClick={() => navigate({ to: '/gestion/clients' })} className="mt-4">
                Retour à la liste
              </Button>
            </div>
          </div>
        </Main>
      </>
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
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/gestion/clients' })}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Détails du client</h1>
                <p className="text-muted-foreground">Informations complètes du client</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <>
                  <Button onClick={handleEdit} className="flex items-center space-x-2">
                    <Edit className="h-4 w-4" />
                    <span>Modifier</span>
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleSave} className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Enregistrer</span>
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2">
                    <X className="h-4 w-4" />
                    <span>Annuler</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Client Information */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informations personnelles</span>
                </CardTitle>
                <CardDescription>Détails de base du client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedClient.name || ''}
                      onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-medium">{selectedClient.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedClient.email || ''}
                      onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{selectedClient.email}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone_1">Téléphone 1</Label>
                    {isEditing ? (
                      <Input
                        id="phone_1"
                        value={editedClient.phone_1 || ''}
                        onChange={(e) => setEditedClient({ ...editedClient, phone_1: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{selectedClient.phone_1 || 'Non renseigné'}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone_2">Téléphone 2</Label>
                    {isEditing ? (
                      <Input
                        id="phone_2"
                        value={editedClient.phone_2 || ''}
                        onChange={(e) => setEditedClient({ ...editedClient, phone_2: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{selectedClient.phone_2 || 'Non renseigné'}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={editedClient.address || ''}
                      onChange={(e) => setEditedClient({ ...editedClient, address: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm whitespace-pre-line">{selectedClient.address || 'Non renseignée'}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Métadonnées</span>
                </CardTitle>
                <CardDescription>Informations système</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ID Client</Label>
                  <Badge variant="secondary">{selectedClient.id}</Badge>
                </div>
                
                <div className="space-y-2">
                  <Label>Date de création</Label>
                  <p className="text-sm">{formatDate(selectedClient.created_at)}</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Dernière modification</Label>
                  <p className="text-sm">{formatDate(selectedClient.updated_at)}</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Badge variant={selectedClient.deleted_at ? "destructive" : "default"}>
                    {selectedClient.deleted_at ? "Supprimé" : "Actif"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le client
              <strong> {selectedClient.name}</strong> de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function ClientDetailsPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_CLIENT}>
      <ClientDetailsPageContent />
    </ProtectedRoute>
  )
} 