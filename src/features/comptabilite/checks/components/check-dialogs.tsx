import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from '@/types/comptabilite'
import { Hash, Calendar, Building2, CheckSquare, EyeOff, Image, User, Activity } from 'lucide-react'

interface CheckDialogsProps {
  isViewOpen: boolean
  selectedCheck: Check | null
  onCloseView: () => void
}

export function CheckDialogs({
  isViewOpen,
  selectedCheck,
  onCloseView,
}: CheckDialogsProps) {
  if (!selectedCheck) return null

  const getStatusBadge = (status: Check['status']) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
    let label = "Inconnu"
    let icon = Activity

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
    
    const IconComponent = icon
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  return (
    <>
      {/* Dialogue de visualisation */}
      <Dialog open={isViewOpen} onOpenChange={onCloseView}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails du chèque</DialogTitle>
            <DialogDescription>
              Informations complètes sur le chèque
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Référence</span>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <span className="font-mono text-sm">{selectedCheck.reference}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Date</span>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-sm">{new Date(selectedCheck.date).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>

            {/* Montant et statut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm font-medium">Montant</span>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-lg font-bold">
                    {parseFloat(selectedCheck.amount).toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'XOF' 
                    })}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm font-medium">Statut</span>
                <div className="p-3 bg-muted rounded-md">
                  {getStatusBadge(selectedCheck.status)}
                </div>
              </div>
            </div>

            {/* Banque et paiement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Banque</span>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-sm">
                    {selectedCheck.bank?.name || 'Non renseigné'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm font-medium">Paiement associé</span>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-sm">
                    {selectedCheck.payment?.reference || 'Non renseigné'}
                  </span>
                </div>
              </div>
            </div>

            {/* Photo */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Photo du chèque</span>
              </div>
              <div className="p-3 bg-muted rounded-md">
                {selectedCheck.photo ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Image className="mr-1 h-3 w-3" />
                      Disponible
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedCheck.photo, '_blank')}
                    >
                      Voir la photo
                    </Button>
                  </div>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Aucune photo
                  </Badge>
                )}
              </div>
            </div>

            {/* Informations de création */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Créé par</span>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-sm">{selectedCheck.created_by.name}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Date de création</span>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-sm">
                    {new Date(selectedCheck.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={onCloseView}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
