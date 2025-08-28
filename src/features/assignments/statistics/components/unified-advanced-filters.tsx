/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { X, Filter, Download, Search, User, Building, Car, FileText, CreditCard, Banknote } from 'lucide-react'
import { StatisticsType, StatisticsFilters } from '@/types/statistics'
import { AssignmentTypeSelect } from '@/features/widgets/assignment-type-select'
import { ExpertiseTypeSelect } from '@/features/widgets/expertise-type-select'
import { VehicleSelect } from '@/features/widgets/vehicle-select'
import { RepairerSelect } from '@/features/widgets/repairer-select'
import { ClientSelect } from '@/features/widgets/client-select'
import { InsurerSelect } from '@/features/widgets/insurer-select'
import { UserSelect } from '@/features/widgets/user-select'
import { ClaimNatureSelect } from '@/features/widgets/claim-nature-select'
import { StatusSelect } from '@/features/widgets/status-select'

interface UnifiedAdvancedFiltersProps {
  type: StatisticsType
  filters: StatisticsFilters
  onFiltersChange: (filters: StatisticsFilters) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  onDownloadExport?: (exportUrl: string) => void
  exportUrl?: string
  loading?: boolean
}

interface FilterField {
  key: string
  label: string
  type: 'input' | 'select' | 'custom'
  placeholder?: string
  component?: React.ComponentType<any>
  props?: Record<string, any>
}

interface FilterSection {
  section: string
  icon: React.ReactNode
  fields: FilterField[]
}

export function UnifiedAdvancedFilters({
  type,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  onDownloadExport,
  exportUrl,
  loading = false
}: UnifiedAdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getFilterFields = (): FilterSection[] => {
    switch (type) {
      case 'assignments':
        return [
          {
            section: 'Informations générales',
            icon: <FileText className="h-4 w-4" />,
            fields: [
              { 
                key: 'assignment_id', 
                label: 'Dossier spécifique', 
                type: 'input', 
                placeholder: 'ID du dossier' 
              },
              { 
                key: 'status_id', 
                label: 'Statut', 
                type: 'custom',
                component: StatusSelect,
                props: { placeholder: 'Sélectionner un statut' }
              },
            ]
          },
          {
            section: 'Véhicule et expertise',
            icon: <Car className="h-4 w-4" />,
            fields: [
              { 
                key: 'vehicle_id', 
                label: 'Véhicule', 
                type: 'custom',
                component: VehicleSelect,
                props: { placeholder: 'Sélectionner un véhicule' }
              },
              { 
                key: 'assignment_type_id', 
                label: 'Type d\'assignation', 
                type: 'custom',
                component: AssignmentTypeSelect,
                props: { placeholder: 'Sélectionner un type' }
              },
              { 
                key: 'expertise_type_id', 
                label: 'Type d\'expertise', 
                type: 'custom',
                component: ExpertiseTypeSelect,
                props: { placeholder: 'Sélectionner un type d\'expertise' }
              },
              { 
                key: 'claim_nature_id', 
                label: 'Nature du sinistre', 
                type: 'custom',
                component: ClaimNatureSelect,
                props: { placeholder: 'Sélectionner une nature' }
              },
            ]
          },
          {
            section: 'Intervenants',
            icon: <User className="h-4 w-4" />,
            fields: [
              { 
                key: 'repairer_id', 
                label: 'Réparateur', 
                type: 'custom',
                component: RepairerSelect,
                props: { placeholder: 'Sélectionner un réparateur' }
              },
              { 
                key: 'insurer_id', 
                label: 'Assureur', 
                type: 'custom',
                component: InsurerSelect,
                props: { placeholder: 'Sélectionner un assureur' }
              },
              { 
                key: 'opened_by', 
                label: 'Créé par', 
                type: 'custom',
                component: UserSelect,
                props: { placeholder: 'Sélectionner un utilisateur' }
              },
              { 
                key: 'edited_by', 
                label: 'Modifié par', 
                type: 'custom',
                component: UserSelect,
                props: { placeholder: 'Sélectionner un utilisateur' }
              },
              { 
                key: 'realized_by', 
                label: 'Réalisé par', 
                type: 'custom',
                component: UserSelect,
                props: { placeholder: 'Sélectionner un utilisateur' }
              },
              { 
                key: 'validated_by', 
                label: 'Validé par', 
                type: 'custom',
                component: UserSelect,
                props: { placeholder: 'Sélectionner un utilisateur' }
              },
              { 
                key: 'directed_by', 
                label: 'Dirigé par', 
                type: 'custom',
                component: UserSelect,
                props: { placeholder: 'Sélectionner un utilisateur' }
              },
            ]
          }
        ]
      
      case 'payments':
        return [
          {
            section: 'Informations générales',
            icon: <CreditCard className="h-4 w-4" />,
            fields: [
              { 
                key: 'payment_id', 
                label: 'Paiement spécifique', 
                type: 'input', 
                placeholder: 'ID du paiement' 
              },
              { 
                key: 'status_id', 
                label: 'Statut', 
                type: 'custom',
                component: StatusSelect,
                props: { placeholder: 'Sélectionner un statut' }
              },
            ]
          },
          {
            section: 'Méthodes et types',
            icon: <Banknote className="h-4 w-4" />,
            fields: [
              { 
                key: 'payment_method_id', 
                label: 'Méthode de paiement', 
                type: 'select' 
              },
              { 
                key: 'payment_type_id', 
                label: 'Type de paiement', 
                type: 'select' 
              },
            ]
          },
          {
            section: 'Intervenants et références',
            icon: <Building className="h-4 w-4" />,
            fields: [
              { 
                key: 'bank_id', 
                label: 'Banque', 
                type: 'select' 
              },
              { 
                key: 'client_id', 
                label: 'Client', 
                type: 'custom',
                component: ClientSelect,
                props: { placeholder: 'Sélectionner un client' }
              },
              { 
                key: 'assignment_id', 
                label: 'Dossier', 
                type: 'input',
                placeholder: 'ID du dossier'
              },
              { 
                key: 'opened_by', 
                label: 'Créé par', 
                type: 'custom',
                component: UserSelect,
                props: { placeholder: 'Sélectionner un utilisateur' }
              },
            ]
          }
        ]
      
      case 'invoices':
        return [
          {
            section: 'Informations générales',
            icon: <FileText className="h-4 w-4" />,
            fields: [
              { 
                key: 'invoice_id', 
                label: 'Facture spécifique', 
                type: 'input', 
                placeholder: 'ID de la facture' 
              },
              { 
                key: 'status_id', 
                label: 'Statut', 
                type: 'custom',
                component: StatusSelect,
                props: { placeholder: 'Sélectionner un statut' }
              },
            ]
          },
          {
            section: 'Références et statuts',
            icon: <Building className="h-4 w-4" />,
            fields: [
              { 
                key: 'client_id', 
                label: 'Client', 
                type: 'custom',
                component: ClientSelect,
                props: { placeholder: 'Sélectionner un client' }
              },
              { 
                key: 'assignment_id', 
                label: 'Dossier', 
                type: 'input',
                placeholder: 'ID du dossier'
              },
              { 
                key: 'payment_status_id', 
                label: 'Statut de paiement', 
                type: 'select' 
              },
            ]
          },
          {
            section: 'Création',
            icon: <User className="h-4 w-4" />,
            fields: [
              { 
                key: 'opened_by', 
                label: 'Créé par', 
                type: 'custom',
                component: UserSelect,
                props: { placeholder: 'Sélectionner un utilisateur' }
              },
            ]
          }
        ]
      
      default:
        return []
    }
  }

  const getActiveFiltersCount = () => {
    const baseFilters = ['start_date', 'end_date']
    const allKeys = Object.keys(filters)
    return allKeys.filter(key => 
      !baseFilters.includes(key) && 
      filters[key as keyof StatisticsFilters] !== undefined &&
      filters[key as keyof StatisticsFilters] !== null
    ).length
  }

  const hasActiveFilters = getActiveFiltersCount() > 0

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    // Convertir "all" en undefined pour effacer le filtre
    let finalValue: string | number | undefined = value
    
    if (value === 'all') {
      finalValue = undefined
    } else if (value && typeof value === 'string' && !isNaN(Number(value))) {
      // Si c'est un input numérique, convertir en number
      finalValue = Number(value)
    }
    
    const newFilters = { ...filters, [key]: finalValue }
    onFiltersChange(newFilters)
  }

  const handleClearFilters = () => {
    onClearFilters()
    setIsOpen(false)
  }

  const handleApplyFilters = () => {
    onApplyFilters()
    setIsOpen(false)
  }

  const renderFilterField = (field: FilterField) => {
    const value = filters[field.key as keyof StatisticsFilters]
    
    switch (field.type) {
      case 'input':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              placeholder={field.placeholder}
              value={value?.toString() || ''}
              onChange={(e) => handleFilterChange(field.key, e.target.value || undefined)}
              className="w-full"
            />
          </div>
        )
      
      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Select
              value={value?.toString() || 'all'}
              onValueChange={(val) => handleFilterChange(field.key, val)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Sélectionner ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="1">Option 1</SelectItem>
                <SelectItem value="2">Option 2</SelectItem>
                <SelectItem value="3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case 'custom': {
        if (!field.component) return null
        
        const CustomComponent = field.component
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <CustomComponent
              value={value}
              onValueChange={(val: any) => handleFilterChange(field.key, val || undefined)}
              placeholder={field.props?.placeholder}
              disabled={loading}
              {...field.props}
            />
          </div>
        )
      }
      
      default:
        return null
    }
  }

  const renderFilterSection = (section: FilterSection, index: number) => (
    <div key={index} className="space-y-4">
      <div className="flex items-center gap-2">
        {section.icon}
        <h3 className="font-semibold text-sm">{section.section}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 pb-6">
        {section.fields.map(renderFilterField)}
      </div>
      {index < getFilterFields().length - 1 && <Separator className="my-4" />}
    </div>
  )

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtres avancés
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="!w-[600px] !max-w-[600px] sm:!w-[700px] sm:!max-w-[700px] overflow-y-auto" style={{ width: '600px', maxWidth: '600px' }}>
        <SheetHeader className="sticky top-0 bg-background pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres avancés - {type}
          </SheetTitle>
          <SheetDescription>
            Configurez les filtres spécifiques pour les statistiques de {type}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Filtres organisés par sections */}
          <div className="space-y-6 pb-6 px-6">
            {getFilterFields().map(renderFilterSection)}
          </div>
          
          {/* Actions */}
          <div className="sticky bottom-0 bg-background pt-4 border-t space-y-4">
            <div className="px-6 pb-4">
              <div className="flex gap-2 mb-4">
                <Button 
                  onClick={handleApplyFilters} 
                  disabled={loading}
                  className="flex-1 gap-2"
                >
                  <Search className="h-4 w-4" />
                  Appliquer les filtres
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClearFilters}
                  disabled={loading}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Effacer tout
                </Button>
              </div>
              
              {exportUrl && onDownloadExport && (
                <Button 
                  variant="outline" 
                  onClick={() => onDownloadExport(exportUrl)}
                  disabled={loading}
                  className="w-full gap-2 px-6"
                >
                  <Download className="h-4 w-4" />
                  Télécharger l'export Excel
                </Button>
              )}
            </div>
           
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
