/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, User, Building, Wrench, Car, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectionDetailsCardProps {
  type: 'client' | 'insurer-relationship' | 'additional-insurer' | 'repairer-relationship' | 'vehicle'
  data: any
  className?: string
}

export function SelectionDetailsCard({ type, data, className }: SelectionDetailsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!data) return null

  const getIcon = () => {
    switch (type) {
      case 'client':
        return <User className="h-5 w-5 text-blue-600" />
      case 'insurer-relationship':
      case 'additional-insurer':
        return <Shield className="h-5 w-5 text-green-600" />
      case 'repairer-relationship':
        return <Wrench className="h-5 w-5 text-orange-600" />
      case 'vehicle':
        return <Car className="h-5 w-5 text-purple-600" />
      default:
        return <Building className="h-5 w-5 text-gray-600" />
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'client':
        return 'Détails du client'
      case 'insurer-relationship':
        return 'Détails du rattachement assureur'
      case 'additional-insurer':
        return 'Détails de l\'assureur additionnel'
      case 'repairer-relationship':
        return 'Détails du rattachement réparateur'
      case 'vehicle':
        return 'Détails du véhicule'
      default:
        return 'Détails'
    }
  }

  const getSubtitle = () => {
    switch (type) {
      case 'client':
        return 'Informations complètes sur le client sélectionné'
      case 'insurer-relationship':
        return 'Informations sur le rattachement assureur sélectionné'
      case 'additional-insurer':
        return 'Informations sur l\'assureur additionnel sélectionné'
      case 'repairer-relationship':
        return 'Informations sur le rattachement réparateur sélectionné'
      case 'vehicle':
        return 'Informations complètes sur le véhicule sélectionné'
      default:
        return 'Informations détaillées'
    }
  }

  const renderClientDetails = () => (
    <div className="space-y-4">
      {/* Section principale */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-lg">
              {data.name?.charAt(0) || 'C'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{data.name}</h3>
            <p className="text-xs text-gray-600">Email: {data.email}</p>
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-xs">Informations personnelles</h4>
          <div className="space-y-2">
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Nom complet</span>
              <span className="text-xs font-medium">{data.name || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Email</span>
              <span className="text-xs font-medium">{data.email || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Téléphone</span>
              <span className="text-xs font-medium">{data.phone_1 || 'Non renseigné'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-xs">Informations de contact</h4>
          <div className="space-y-2">
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Téléphone 2</span>
              <span className="text-xs font-medium">{data.phone_2 || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Adresse</span>
              <span className="text-xs font-medium">{data.address || 'Non renseignée'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">N° contribuable</span>
              <span className="text-xs font-medium">{data.taxpayer_account_number || 'Non renseigné'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Créé le</span>
          <span className="font-medium">{data.created_at ? new Date(data.created_at).toLocaleDateString('fr-FR') : 'Non renseigné'}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-600">Dernière mise à jour</span>
          <span className="font-medium">{data.updated_at ? new Date(data.updated_at).toLocaleDateString('fr-FR') : 'Non renseigné'}</span>
        </div>
      </div>
    </div>
  )

  const renderInsurerRelationshipDetails = () => (
    <div className="space-y-4">
      {/* Section principale */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{data.insurer?.name}</h3>
            <p className="text-xs text-gray-600">Rattachement: {data.insurer?.name} - {data.expert_firm?.name}</p>
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-xs">Informations assureur</h4>
          <div className="space-y-2">
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Nom</span>
              <span className="text-xs font-medium">{data.insurer?.name || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Code</span>
              <span className="text-xs font-medium">{data.insurer?.code || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Email</span>
              <span className="text-xs font-medium">{data.insurer?.email || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Téléphone</span>
              <span className="text-xs font-medium">{data.insurer?.telephone || 'Non renseigné'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
              <h4 className="font-medium text-gray-700 text-xs">Informations cabinet</h4>
          <div className="space-y-2">
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Nom du cabinet</span>
              <span className="text-xs font-medium">{data.expert_firm?.name || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Code cabinet</span>
              <span className="text-xs font-medium">{data.expert_firm?.code || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Statut</span>
              <Badge 
                variant={data.status?.code === 'active' ? 'default' : 'secondary'}
                className={cn(
                  "text-xs",
                  data.status?.code === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                )}
              >
                {data.status?.label || 'Inconnu'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Créé le</span>
          <span className="font-medium">{data.created_at ? new Date(data.created_at).toLocaleDateString('fr-FR') : 'Non renseigné'}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-600">Dernière mise à jour</span>
          <span className="font-medium">{data.updated_at ? new Date(data.updated_at).toLocaleDateString('fr-FR') : 'Non renseigné'}</span>
        </div>
      </div>
    </div>
  )

  const renderRepairerRelationshipDetails = () => (
    <div className="space-y-4">
      {/* Section principale */}
      <div className="bg-orange-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <Wrench className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{data.repairer?.name}</h3>
            <p className="text-xs text-gray-600">Rattachement: {data.repairer?.name} - {data.expert_firm?.name}</p>
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-xs">Informations réparateur</h4>
          <div className="space-y-2">
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Nom</span>
              <span className="text-xs font-medium">{data.repairer?.name || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Code</span>
              <span className="text-xs font-medium">{data.repairer?.code || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Email</span>
              <span className="text-xs font-medium">{data.repairer?.email || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Téléphone</span>
              <span className="text-xs font-medium">{data.repairer?.telephone || 'Non renseigné'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-xs">Informations cabinet</h4>
          <div className="space-y-2">
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Nom du cabinet</span>
              <span className="text-xs font-medium">{data.expert_firm?.name || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Code cabinet</span>
              <span className="text-xs font-medium">{data.expert_firm?.code || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5">
              <span className="text-xs text-gray-600">Statut</span>
              <Badge 
                variant={data.status?.code === 'active' ? 'default' : 'secondary'}
                className={cn(
                  "text-xs",
                  data.status?.code === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                )}
              >
                {data.status?.label || 'Inconnu'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-orange-50 rounded-lg p-4">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Créé le</span>
          <span className="font-medium">{data.created_at ? new Date(data.created_at).toLocaleDateString('fr-FR') : 'Non renseigné'}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-600">Dernière mise à jour</span>
          <span className="font-medium">{data.updated_at ? new Date(data.updated_at).toLocaleDateString('fr-FR') : 'Non renseigné'}</span>
        </div>
      </div>
    </div>
  )

  const renderVehicleDetails = () => (
    <div className="space-y-4">
      {/* Section principale */}
      <div className="bg-purple-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Car className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {data.brand?.name} {data.model?.name}
            </h3>
            <p className="text-xs text-gray-600">Véhicule ID: {data.id}</p>
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-xs">Informations véhicule</h4>
          <div className="space-y-2">
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5 text-xs">
              <span className="text-xs text-gray-600">Marque</span>
              <span className="text-xs font-medium">{data.brand?.name || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5 text-xs">
              <span className="text-xs text-gray-600">Modèle</span>
              <span className="text-xs font-medium">{data.model?.name || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5 text-xs">
              <span className="text-xs text-gray-600">Immatriculation</span>
              <span className="text-xs font-medium">{data.registration_number || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5 text-xs">
              <span className="text-xs text-gray-600">Kilométrage</span>
              <span className="text-xs font-medium">{data.mileage ? `${data.mileage.toLocaleString()} km` : 'Non renseigné'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-xs">Caractéristiques</h4>
          <div className="space-y-2">
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5 text-xs">
              <span className="text-xs text-gray-600">Couleur</span>
              <span className="text-xs font-medium">{data.color?.name || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5 text-xs">
              <span className="text-xs text-gray-600">Carrosserie</span>
              <span className="text-xs font-medium">{data.bodywork?.name || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5 text-xs">
              <span className="text-xs text-gray-600">Année</span>
              <span className="text-xs font-medium">{data.year || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between bg-gray-100 rounded-xs p-1.5 text-xs">
              <span className="text-xs text-gray-600">État</span>
              <Badge 
                variant={data.state?.code === 'active' ? 'default' : 'secondary'}
                className={cn(
                  "text-xs",
                  data.state?.code === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                )}
              >
                {data.state?.label || 'Inconnu'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-purple-50 rounded-lg p-4">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Créé le</span>
          <span className="font-medium">{data.created_at ? new Date(data.created_at).toLocaleDateString('fr-FR') : 'Non renseigné'}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-600">Dernière mise à jour</span>
          <span className="font-medium">{data.updated_at ? new Date(data.updated_at).toLocaleDateString('fr-FR') : 'Non renseigné'}</span>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (type) {
      case 'client':
        return renderClientDetails()
      case 'insurer-relationship':
      case 'additional-insurer':
        return renderInsurerRelationshipDetails()
      case 'repairer-relationship':
        return renderRepairerRelationshipDetails()
      case 'vehicle':
        return renderVehicleDetails()
      default:
        return null
    }
  }

  return (
    <Card className={cn("w-full shadow-none border cursor-pointer p-0", className)}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b" onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}>
          <div className="flex items-center gap-3" >
            {getIcon()}
            <div>
              <h3 className="font-semibold text-gray-900 text-sm  ">{getTitle()}</h3>
              <p className="text-xs text-gray-600">{getSubtitle()}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-2">
            {renderContent()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
