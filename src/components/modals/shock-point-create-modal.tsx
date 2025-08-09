/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MapPin, Plus } from 'lucide-react'
import { ShockPointSelect } from '@/features/widgets/shock-point-select'

interface ShockPoint {
  id: number
  code: string
  label: string
  description?: string
}

interface Shock {
  id?: number
  shock_point_id: number
  [key: string]: any
}

interface ShockPointCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedShockPointId: number
  onSelectedShockPointIdChange: (id: number) => void
  shockPoints: ShockPoint[]
  shocks: Shock[]
  onCreateShockPoint: () => void
  onAddShock: (shockPointId: number) => void
}

export function ShockPointCreateModal({
  open,
  onOpenChange,
  selectedShockPointId,
  onSelectedShockPointIdChange,
  shockPoints,
  shocks,
  onCreateShockPoint,
  onAddShock,
}: ShockPointCreateModalProps) {
  const handleClose = () => {
    onOpenChange(false)
    onSelectedShockPointIdChange(0)
  }

  const handleAdd = () => {
    onAddShock(selectedShockPointId)
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-1/3">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-6 w-6 text-blue-600" />
            Ajouter un point de choc
          </DialogTitle>
          <DialogDescription className="text-sm">
            Sélectionnez un point de choc à ajouter au dossier pour commencer l'expertise
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Section de sélection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  Point de choc à ajouter
                </div>
              </div>
              <div>
                <Button variant="outline" onClick={onCreateShockPoint}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un nouveau point de choc
                </Button>
              </div>
            </div>
            
            <ShockPointSelect
              value={selectedShockPointId}
              onValueChange={onSelectedShockPointIdChange}
              shockPoints={shockPoints}
              showSelectedInfo={true}
              onCreateNew={onCreateShockPoint}
            />
          </div>

          {/* Statistiques */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-blue-600">{shockPoints.length}</div>
                <div className="text-xs text-gray-600">Points disponibles</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">{shocks.length}</div>
                <div className="text-xs text-gray-600">Points ajoutés</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="px-6"
          >
            Annuler
          </Button>
          <Button 
            disabled={!selectedShockPointId} 
            onClick={handleAdd}
            className="px-6 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter le point
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}