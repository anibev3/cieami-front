/* eslint-disable no-console */
import { useParams, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Car, 
  Building, 
  Wrench, 
  Calendar, 
  MapPin, 
  Mail,
  Phone,
  Edit,
  AlertCircle,
  Info,
  Clock,
  Hash,
  DollarSign,
  XCircle
} from 'lucide-react'
import { Search } from '@/components/search'
import { AssignmentRequest } from '@/types/assignment-requests'
import { assignmentRequestService } from '@/services/assignmentRequestService'
import { toast } from 'sonner'
import { formatDate } from '@/utils/format-date'
import { useACL } from '@/hooks/useACL'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function AssignmentRequestDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { isAdmin, isSystemAdmin } = useACL()
  const [request, setRequest] = useState<AssignmentRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [rejecting, setRejecting] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  
  // Vérifier si l'utilisateur peut rejeter (admin ou system admin)
  const canReject = (isAdmin() || isSystemAdmin()) && request?.status.code !== 'rejected'

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true)
        const response = await assignmentRequestService.getAssignmentRequest(id)
        setRequest(response.data)
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
        toast.error('Erreur lors du chargement de la demande d\'expertise')
      } finally {
        setLoading(false)
      }
    }

    fetchRequest()
  }, [id])

  const formatCurrency = (amount: string | null | undefined) => {
    if (!amount) return '0 FCFA'
    const value = parseFloat(amount)
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(isNaN(value) ? 0 : value)
  }

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const handleReject = async () => {
    if (!request) return
    
    try {
      setRejecting(true)
      await assignmentRequestService.rejectAssignmentRequest(request.id)
      toast.success('Demande d\'expertise rejetée avec succès')
      setRejectDialogOpen(false)
      // Recharger les données
      const response = await assignmentRequestService.getAssignmentRequest(id)
      setRequest(response.data)
    } catch (error) {
      console.error('Erreur lors du rejet:', error)
      toast.error('Erreur lors du rejet de la demande d\'expertise')
    } finally {
      setRejecting(false)
    }
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
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Chargement de la demande d'expertise...</p>
            </div>
          </div>
        </Main>
      </>
    )
  }

  if (!request) {
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
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Demande d'expertise non trouvée</h3>
              <p className="text-muted-foreground mb-4">La demande d'expertise demandée n'existe pas ou a été supprimée.</p>
              <Button onClick={() => navigate({ to: '/assignment-requests' })}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux demandes
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
        <div className="w-full space-y-6 pb-6">
          {/* En-tête */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate({ to: '/assignment-requests' })}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate">
                    Demande d'expertise {request.reference}
                  </h1>
                  <p className="text-xs text-muted-foreground">Détails complets de la demande d'expertise</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(request.status.code)}>
                {request.status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {canReject && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectDialogOpen(true)}
                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: `/assignment-requests/${id}/edit` })}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations générales */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Référence</p>
                      <div className="flex items-center gap-2">
                        <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-sm font-semibold">{request.reference}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Date de création</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-sm font-semibold">{formatDate(request.created_at)}</p>
                      </div>
                    </div>
                    {request.claim_date && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Date du sinistre</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <p className="text-sm font-semibold">{formatDate(request.claim_date)}</p>
                        </div>
                      </div>
                    )}
                    {request.expertise_place && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Lieu d'expertise</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <p className="text-sm font-semibold">{request.expertise_place}</p>
                        </div>
                      </div>
                    )}
                    {request.policy_number && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Numéro de police</p>
                        <p className="text-sm font-semibold font-mono">{request.policy_number}</p>
                      </div>
                    )}
                    {request.claim_number && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Numéro de sinistre</p>
                        <p className="text-sm font-semibold font-mono">{request.claim_number}</p>
                      </div>
                    )}
                    {request.new_market_value && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Valeur neuve</p>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                          <p className="text-sm font-semibold">{formatCurrency(request.new_market_value)}</p>
                        </div>
                      </div>
                    )}
                    {request.expert_firm && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Cabinet d'expertise</p>
                        <p className="text-sm font-semibold">{request.expert_firm}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Client */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    Client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-primary">Informations personnelles</h4>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Nom complet</p>
                          <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{request.client.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Adresse email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{request.client.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary border-b pb-1">Coordonnées</h4>
                      <div className="space-y-2">
                        {request.client.phone_1 && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Téléphone principal</p>
                              <p className="text-sm font-semibold">{request.client.phone_1}</p>
                            </div>
                          </div>
                        )}
                        {request.client.phone_2 && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Téléphone secondaire</p>
                              <p className="text-sm font-semibold">{request.client.phone_2}</p>
                            </div>
                          </div>
                        )}
                        {request.client.address && (
                          <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                            <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Adresse</p>
                              <p className="text-xs whitespace-pre-line">{request.client.address}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assureur */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4" />
                    Assureur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-primary">Informations société</h4>
                        {request.insurer.code && (
                          <Badge variant="outline" className="text-xs">{request.insurer.code}</Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Nom de la société</p>
                          <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{request.insurer.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Adresse email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{request.insurer.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {(request.insurer.telephone || request.insurer.address) && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-primary border-b pb-1">Coordonnées</h4>
                        <div className="space-y-2">
                          {request.insurer.telephone && (
                            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Téléphone</p>
                                <p className="text-sm font-semibold">{request.insurer.telephone}</p>
                              </div>
                            </div>
                          )}
                          {request.insurer.address && (
                            <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                              <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Adresse</p>
                                <p className="text-xs whitespace-pre-line">{request.insurer.address}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Réparateur */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Wrench className="h-4 w-4" />
                    Réparateur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-primary">Informations garage</h4>
                        {request.repairer.code && (
                          <Badge variant="outline" className="text-xs">{request.repairer.code}</Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Nom du garage</p>
                          <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{request.repairer.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Adresse email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{request.repairer.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {(request.repairer.telephone || request.repairer.address) && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-primary border-b pb-1">Coordonnées</h4>
                        <div className="space-y-2">
                          {request.repairer.telephone && (
                            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Téléphone</p>
                                <p className="text-sm font-semibold">{request.repairer.telephone}</p>
                              </div>
                            </div>
                          )}
                          {request.repairer.address && (
                            <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                              <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Adresse</p>
                                <p className="text-xs whitespace-pre-line">{request.repairer.address}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Véhicule */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Car className="h-4 w-4" />
                    Informations du véhicule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary border-b pb-1">Identité</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Plaque d'immatriculation</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{request.vehicle.license_plate}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Numéro de série</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded font-mono">{request.vehicle.serial_number}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Kilométrage</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{request.vehicle.mileage} km</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary border-b pb-1">Caractéristiques</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Puissance fiscale</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{request.vehicle.fiscal_power} CV</p>
                        </div>
                        {request.vehicle.new_market_value && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Valeur neuve</p>
                            <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">
                              {formatCurrency(request.vehicle.new_market_value)}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Nombre de places</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{request.vehicle.nb_seats} places</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary border-b pb-1">Classification</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Type</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{request.vehicle.type}</p>
                        </div>
                        {request.vehicle.first_entry_into_circulation_date && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Date de première mise en circulation</p>
                            <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">
                              {formatDate(request.vehicle.first_entry_into_circulation_date)}
                            </p>
                          </div>
                        )}
                        {request.vehicle.technical_visit_date && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Date de visite technique</p>
                            <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">
                              {formatDate(request.vehicle.technical_visit_date)}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Options</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{request.vehicle.option}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              {/* Statut */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4" />
                    Statut
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-primary">État actuel</h4>
                        <Badge className={getStatusColor(request.status.code)}>
                          {request.status.label}
                        </Badge>
                      </div>
                      {request.status.description && (
                        <p className="text-xs text-muted-foreground mt-2">{request.status.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations système */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    Informations système
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {request.created_by && (
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-primary">Créé par</h4>
                          <Badge variant="outline" className="text-xs">{request.created_by.username}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Nom complet</p>
                            <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{request.created_by.name}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Email</p>
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{request.created_by.email}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Date de création</p>
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{formatDate(request.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {request.updated_by && (
                      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-primary">Modifié par</h4>
                          <Badge variant="outline" className="text-xs">{request.updated_by.username}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Nom complet</p>
                            <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{request.updated_by.name}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Email</p>
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{request.updated_by.email}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Date de modification</p>
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{formatDate(request.updated_at)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4" />
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs h-8" 
                    onClick={() => navigate({ to: `/assignment-requests/${id}/edit` })}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Modifier la demande
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs h-8" 
                    onClick={() => navigate({ to: '/assignment-requests' })}
                  >
                    <ArrowLeft className="h-3 w-3 mr-2" />
                    Retour à la liste
                  </Button>
                  {canReject && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-xs h-8 text-orange-600 border-orange-200 hover:bg-orange-50" 
                      onClick={() => setRejectDialogOpen(true)}
                    >
                      <XCircle className="h-3 w-3 mr-2" />
                      Rejeter la demande
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Dialog de confirmation de rejet */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rejeter la demande d'expertise</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir rejeter la demande d'expertise{' '}
                <strong>{request?.reference}</strong> ? Cette action changera le statut de la demande.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={rejecting}>
                {rejecting ? 'Rejet en cours...' : 'Rejeter'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Main>
    </>
  )
}

