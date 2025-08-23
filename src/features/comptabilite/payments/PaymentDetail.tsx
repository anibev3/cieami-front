/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { usePaymentStore } from '@/stores/paymentStore'
import { Payment } from '@/types/comptabilite'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  FileText, 
  Calendar, 
  DollarSign, 
  User, 
  Building,
  Car,
  Receipt,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'

export default function PaymentDetail() {
  const { id } = useParams({ strict: false }) as { id: string }
    
  const navigate = useNavigate()
  const { 
    selectedPayment, 
    loading, 
    error, 
    fetchPaymentById, 
    deletePayment 
  } = usePaymentStore()

  useEffect(() => {
    if (id) {
      fetchPaymentById(parseInt(id))
    }
  }, [id, fetchPaymentById])

  const handleBack = () => {
    navigate({ to: '/comptabilite/payments' })
  }

  const handleEdit = () => {
    navigate({ to: `/comptabilite/payment/edit/${id}` })
  }

  const handleDelete = async () => {
    if (selectedPayment && confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      try {
        await deletePayment(selectedPayment.id)
        navigate({ to: '/comptabilite/payments' })
      } catch (error) {
        // Error handled by store
      }
    }
  }

  if (loading) {
    return (
      <>
        {/* <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header> */}
        <Main>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Chargement du paiement...
            </div>
          </div>
        </Main>
      </>
    )
  }

  if (error || !selectedPayment) {
    return (
      <>
        {/* <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header> */}
        {/* <Main> */}
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Erreur</h2>
              <p className="text-muted-foreground mb-4">
                {error || 'Paiement non trouvé'}
              </p>
              <Button onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux paiements
              </Button>
            </div>
          </div>
        {/* </Main> */}
      </>
    )
  }

  const payment = selectedPayment

  return (
    <>
      {/* <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header> */}

      <Main>
        <div className="space-y-6 h-full w-full overflow-y-auto pb-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Détails du Paiement
                </h1>
                <p className="text-muted-foreground">
                  Référence: {payment.reference}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* <Button onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button> */}
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-4 w-4" />
                  Montant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(parseFloat(payment.amount))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Montant du paiement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4" />
                  Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {formatDate(payment.date)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Date du paiement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle className="h-4 w-4" />
                  Statut
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant={payment.status?.code === 'active' ? 'default' : 'secondary'}
                  className="text-sm"
                >
                  {payment.status?.label}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Statut actuel
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations du paiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Informations du Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Référence</label>
                    <p className="text-sm font-medium">{payment.reference}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type de paiement</label>
                    <p className="text-sm font-medium">{payment.payment_type?.label}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Méthode de paiement</label>
                    <p className="text-sm font-medium">
                      {payment.payment_method?.label || 'Non spécifiée'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Créé le</label>
                    <p className="text-sm font-medium">
                      {formatDate(payment.created_at)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Modifié le</label>
                    <p className="text-sm font-medium">
                      {formatDate(payment.updated_at)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Annulé le</label>
                    <p className="text-sm font-medium">
                      {payment.cancelled_at ? formatDate(payment.cancelled_at) : 'Non annulé'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations du dossier */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informations du Dossier
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Référence dossier</label>
                    <p className="text-sm font-medium">{payment.assignment?.reference}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Numéro de police</label>
                    <p className="text-sm font-medium">
                      {payment.assignment?.policy_number || 'Non spécifié'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Lieu d'expertise</label>
                    <p className="text-sm font-medium">
                      {payment.assignment?.expertise_place || 'Non spécifié'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date d'expertise</label>
                    <p className="text-sm font-medium">
                      {payment.assignment?.expertise_date ? formatDate(payment.assignment.expertise_date) : 'Non spécifiée'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Durée des travaux</label>
                    <p className="text-sm font-medium">
                      {payment.assignment?.work_duration || 'Non spécifiée'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Validé</label>
                    <Badge variant={payment.assignment?.is_validated ? 'default' : 'secondary'}>
                      {payment.assignment?.is_validated ? 'Oui' : 'Non'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Montants détaillés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Montants Détaillés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Montant des chocs HT</label>
                  <p className="text-lg font-semibold">
                    {payment.assignment?.shock_amount_excluding_tax 
                      ? formatCurrency(parseFloat(payment.assignment.shock_amount_excluding_tax))
                      : '0 €'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">TVA chocs</label>
                  <p className="text-lg font-semibold">
                    {payment.assignment?.shock_amount_tax 
                      ? formatCurrency(parseFloat(payment.assignment.shock_amount_tax))
                      : '0 €'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Montant des fournitures HT</label>
                  <p className="text-lg font-semibold">
                    {payment.assignment?.receipt_amount_excluding_tax 
                      ? formatCurrency(parseFloat(payment.assignment.receipt_amount_excluding_tax))
                      : '0 €'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">TVA fournitures</label>
                  <p className="text-lg font-semibold">
                    {payment.assignment?.receipt_amount_tax 
                      ? formatCurrency(parseFloat(payment.assignment.receipt_amount_tax))
                      : '0 €'
                    }
                  </p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Total HT</label>
                  <p className="text-xl font-bold">
                    {payment.assignment?.total_amount_excluding_tax 
                      ? formatCurrency(parseFloat(payment.assignment.total_amount_excluding_tax))
                      : '0 €'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Total TTC</label>
                  <p className="text-xl font-bold text-green-600">
                    {payment.assignment?.total_amount 
                      ? formatCurrency(parseFloat(payment.assignment.total_amount))
                      : '0 €'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Montant reçu</label>
                  <p className="text-xl font-bold text-blue-600">
                    {payment.assignment?.payment_received 
                      ? formatCurrency(parseFloat(payment.assignment.payment_received))
                      : '0 €'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations des utilisateurs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Créé par
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{payment.created_by?.name}</p>
                    <p className="text-sm text-muted-foreground">{payment.created_by?.email}</p>
                    <p className="text-sm text-muted-foreground">Code: {payment.created_by?.code}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Modifié par
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{payment.updated_by?.name}</p>
                    <p className="text-sm text-muted-foreground">{payment.updated_by?.email}</p>
                    <p className="text-sm text-muted-foreground">Code: {payment.updated_by?.code}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Évaluations du véhicule */}
          {payment.assignment?.evaluations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Évaluations du Véhicule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Âge du véhicule</label>
                    <p className="text-sm font-medium">{payment.assignment.evaluations.vehicle_age} mois</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Taux de dépréciation</label>
                    <p className="text-sm font-medium">{payment.assignment.evaluations.theorical_depreciation_rate}%</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Valeur théorique</label>
                    <p className="text-sm font-medium">
                      {payment.assignment.evaluations.theorical_vehicle_market_value 
                        ? formatCurrency(payment.assignment.evaluations.theorical_vehicle_market_value)
                        : 'Non calculée'
                      }
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Kilométrage</label>
                    <p className="text-sm font-medium">
                      {payment.assignment.evaluations.kilometric_incidence?.toLocaleString('fr-FR')} km
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Valeur marchande</label>
                    <p className="text-sm font-medium">
                      {payment.assignment.evaluations.vehicle_market_value 
                        ? formatCurrency(payment.assignment.evaluations.vehicle_market_value)
                        : 'Non calculée'
                      }
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Moins-value travaux</label>
                    <p className="text-sm font-medium">
                      {payment.assignment.evaluations.less_value_work 
                        ? formatCurrency(parseFloat(payment.assignment.evaluations.less_value_work))
                        : 'Non calculée'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statuts et dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Statuts et Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Statut édition</label>
                  <Badge variant="outline">{payment.assignment?.edition_status}</Badge>
                  <p className="text-sm text-muted-foreground">
                    Progression: {payment.assignment?.edition_per_cent}%
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Statut récupération</label>
                  <Badge variant="outline">{payment.assignment?.recovery_status}</Badge>
                  <p className="text-sm text-muted-foreground">
                    Progression: {payment.assignment?.recovery_per_cent}%
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Expiration édition</label>
                  <p className="text-sm font-medium">
                    {payment.assignment?.edition_time_expire_at 
                      ? formatDate(payment.assignment.edition_time_expire_at)
                      : 'Non définie'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Expiration récupération</label>
                  <p className="text-sm font-medium">
                    {payment.assignment?.recovery_time_expire_at 
                      ? formatDate(payment.assignment.recovery_time_expire_at)
                      : 'Non définie'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Réalisé le</label>
                  <p className="text-sm font-medium">
                    {payment.assignment?.realized_at 
                      ? formatDate(payment.assignment.realized_at)
                      : 'Non réalisé'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Validé le</label>
                  <p className="text-sm font-medium">
                    {payment.assignment?.validated_at 
                      ? formatDate(payment.assignment.validated_at)
                      : 'Non validé'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
