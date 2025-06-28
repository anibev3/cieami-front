import { useState, useEffect } from 'react'
import { Package, Info, Loader2, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSuppliesStore } from '@/stores/supplies'
import { Supply } from '@/types/supplies'
import { toast } from 'sonner'

interface SupplyDetailsProps {
  supplyId: number | null
}

export function SupplyDetails({ supplyId }: SupplyDetailsProps) {
  const [currentSupply, setCurrentSupply] = useState<Supply | null>(null)
  const [loading, setLoading] = useState(false)
  const { fetchSupplyById } = useSuppliesStore()

  useEffect(() => {
    if (supplyId) {
      loadSupplyDetails(supplyId)
    } else {
      setCurrentSupply(null)
    }
  }, [supplyId])

  const loadSupplyDetails = async (id: number) => {
    setLoading(true)
    try {
      const supply = await fetchSupplyById(id)
      setCurrentSupply(supply)
    } catch (_error) {
      toast.error('Erreur lors du chargement des détails')
    } finally {
      setLoading(false)
    }
  }

  if (!supplyId) {
    return (
      <Card className="h-full shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Détails de la fourniture
          </CardTitle>
          <CardDescription>
            Sélectionnez une fourniture pour voir ses détails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune fourniture sélectionnée</p>
            <p className="text-sm">Cliquez sur un élément dans la liste</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="h-full shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Détails de la fourniture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Chargement...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Détails de la fourniture
        </CardTitle>
        <CardDescription>
          Informations détaillées de la fourniture
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {/* Fourniture actuelle */}
            {currentSupply && (
              <>
                {/* En-tête avec statut */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{currentSupply.label}</h3>
                    <p className="text-sm text-muted-foreground">{currentSupply.code || 'Aucun code'}</p>
                  </div>
                  <Badge variant={currentSupply.status.code === 'active' ? 'default' : 'secondary'}>
                    {currentSupply.status.label}
                  </Badge>
                </div>

                <Separator />

                {/* Informations de base */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Informations générales
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">ID:</span>
                      <div className="font-medium">{currentSupply.id}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Code:</span>
                      <div className="font-medium">{currentSupply.code || 'Non défini'}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Statut:</span>
                      <div className="font-medium">
                        <Badge variant={currentSupply.status.code === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {currentSupply.status.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                {currentSupply.description && (
                  <>
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {currentSupply.description}
                      </p>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Informations système */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Informations système
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Créé le:</span>
                      <div className="font-medium">
                        {new Date(currentSupply.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Modifié le:</span>
                      <div className="font-medium">
                        {new Date(currentSupply.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Supprimé:</span>
                      <div className="font-medium">
                        <Badge variant={currentSupply.deleted_at ? "destructive" : "default"} className="text-xs">
                          {currentSupply.deleted_at ? "Oui" : "Non"}
                        </Badge>
                      </div>
                    </div>
                    {currentSupply.deleted_at && (
                      <div>
                        <span className="text-muted-foreground">Date suppression:</span>
                        <div className="font-medium">
                          {new Date(currentSupply.deleted_at).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Package className="mr-2 h-4 w-4" />
                      Voir les prix associés
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Info className="mr-2 h-4 w-4" />
                      Voir l'historique
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 