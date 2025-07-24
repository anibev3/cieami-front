/* eslint-disable no-console */
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Filter, 
  X, 
  Search,
  Building,
  User,
  FileText,
  Shield
} from 'lucide-react'
import {
  InsurerSelect,
  RepairerSelect,
  UserSelect,
  StatusSelect,
  ClaimNatureSelect
} from '@/features/widgets'

interface AdvancedFilters {
  // Entités
  repairerId?: number | null
  insurerId?: number | null
  
  // Types
  claimNatureId?: number | null
  
  // États
  statusId?: number | null
  
  // Utilisateurs
  createdById?: number | null
  editedById?: number | null
  realizedById?: number | null
  validatedById?: number | null
  directedById?: number | null
}

interface AdvancedFiltersDialogProps {
  filters: AdvancedFilters
  onFiltersChange: (filters: AdvancedFilters) => void
  onApplyFilters: () => void
  onClearFilters: () => void
}

export function AdvancedFiltersDialog({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters
}: AdvancedFiltersDialogProps) {
  const [open, setOpen] = useState(false)

  const handleFilterChange = (key: keyof AdvancedFilters, value: Date | number | null | undefined) => {
    console.log('handleFilterChange called:', key, value)
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handleClearFilters = () => {
    onClearFilters()
    setOpen(false)
  }

  const handleApplyFilters = () => {
    onApplyFilters()
    setOpen(false)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== undefined && value !== null).length
  }

  const hasActiveFilters = getActiveFiltersCount() > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtres avancés
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres avancés
          </DialogTitle>
          <DialogDescription>
            Configurez des filtres détaillés pour affiner vos statistiques. 
            Ces filtres s'ajoutent aux critères de base (période et dossier) définis dans la recherche principale.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Entités */}
          <Card className='shadow-none'>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building className="h-4 w-4" />
                Entités
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 justify-between flex gap-4">
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Assureur</label>
                <InsurerSelect
                  value={filters.insurerId}
                  onValueChange={(value) => handleFilterChange('insurerId', value)}
                  placeholder="Tous les assureurs"
                />
              </div>

              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Réparateur</label>
                <RepairerSelect
                  value={filters.repairerId}
                  onValueChange={(value) => handleFilterChange('repairerId', value)}
                  placeholder="Tous les réparateurs"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 w-full">
            {/* Types */}
            <Card className='shadow-none w-full'>
                <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4" />
                    Types
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Nature du sinistre</label>
                    <ClaimNatureSelect
                    value={filters.claimNatureId}
                    onValueChange={(value) => handleFilterChange('claimNatureId', value)}
                    placeholder="Toutes les natures"
                    />
                </div>
                </CardContent>
            </Card>

            {/* États */}
            <Card className='shadow-none w-full'>
                <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="h-4 w-4" />
                    États
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Statut</label>
                    <StatusSelect
                    value={filters.statusId}
                    onValueChange={(value) => handleFilterChange('statusId', value)}
                    placeholder="Tous les statuts"
                    />
                </div>
                </CardContent>
            </Card> 
          </div>

          {/* Utilisateurs */}
          <Card className='shadow-none'>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 justify-between flex gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Créé par</label>
                <UserSelect
                  value={filters.createdById}
                  onValueChange={(value) => handleFilterChange('createdById', value)}
                  placeholder="Tous les créateurs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Modifié par</label>
                <UserSelect
                  value={filters.editedById}
                  onValueChange={(value) => handleFilterChange('editedById', value)}
                  placeholder="Tous les modificateurs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Réalisé par</label>
                <UserSelect
                  value={filters.realizedById}
                  onValueChange={(value) => handleFilterChange('realizedById', value)}
                  placeholder="Tous les réalisateurs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Validé par</label>
                <UserSelect
                  value={filters.validatedById}
                  onValueChange={(value) => handleFilterChange('validatedById', value)}
                  placeholder="Tous les validateurs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Dirigé par</label>
                <UserSelect
                  value={filters.directedById}
                  onValueChange={(value) => handleFilterChange('directedById', value)}
                  placeholder="Tous les directeurs"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
            className="flex-1"
          >
            <X className="mr-2 h-4 w-4" />
            Effacer
          </Button>
          <Button 
            onClick={handleApplyFilters}
            className="flex-1"
          >
            <Search className="mr-2 h-4 w-4" />
            Appliquer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 