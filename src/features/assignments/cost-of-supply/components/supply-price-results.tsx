import { useState, useEffect } from 'react'
import { Package, Loader2, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useSupplyPricesStore } from '@/stores/supplies'
import { SupplyPrice } from '@/types/supplies'
import { toast } from 'sonner'

interface SupplyPriceResultsProps {
  supplyId: number | null
  vehicleModelId: string
  onSelectPrice?: (price: SupplyPrice) => void
}

export function SupplyPriceResults({ supplyId, vehicleModelId, onSelectPrice }: SupplyPriceResultsProps) {
  const [selectedPrice, setSelectedPrice] = useState<SupplyPrice | null>(null)
  const { supplyPrices, loading, fetchSupplyPrices } = useSupplyPricesStore()

  useEffect(() => {
    if (supplyId && vehicleModelId) {
      loadSupplyPriceResults()
    } else {
      setSelectedPrice(null)
    }
  }, [supplyId, vehicleModelId])

  const loadSupplyPriceResults = async () => {
    if (!supplyId || !vehicleModelId) return

    try {
      await fetchSupplyPrices({
        vehicle_model_id: vehicleModelId,
        supply_id: supplyId,
        date: null
      })
      setSelectedPrice(null)
    } catch (_error) {
      toast.error('Erreur lors du chargement des prix')
    }
  }

  const handlePriceClick = (price: SupplyPrice) => {
    setSelectedPrice(price)
    if (onSelectPrice) {
      onSelectPrice(price)
    }
  }

  const formatCurrency = (amount: string) => {
    return parseFloat(amount).toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  const getStatusBadge = (supplyPrice: SupplyPrice) => {
    const hasNewPrice = parseFloat(supplyPrice.new_amount) > 0
    const hasObsolescence = parseFloat(supplyPrice.obsolescence_rate) > 0
    const hasRecovery = parseFloat(supplyPrice.recovery_amoun) > 0

    if (hasNewPrice) return <Badge className="bg-green-100 text-green-800">Nouveau</Badge>
    if (hasObsolescence) return <Badge className="bg-red-100 text-red-800">Obsolète</Badge>
    if (hasRecovery) return <Badge className="bg-blue-100 text-blue-800">Récupération</Badge>
    return <Badge variant="secondary">Standard</Badge>
  }

  if (!supplyId) {
    return (
      <Card className="h-full shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Prix de la fourniture
          </CardTitle>
          <CardDescription>
            Sélectionnez une fourniture pour voir ses prix
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
            Prix de la fourniture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Chargement des prix...</span>
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
          Prix de la fourniture
        </CardTitle>
        <CardDescription>
          {supplyPrices.length > 0 ? `${supplyPrices.length} prix trouvé(s)` : 'Aucun prix trouvé'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {supplyPrices.length > 0 ? (
              supplyPrices.map((price) => (
                <Card 
                  key={price.id} 
                  className={`cursor-pointer transition-all hover:shadow-md shadow-none ${
                    selectedPrice?.id === price.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handlePriceClick(price)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">Prix #{price.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(price.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(price)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Prix neuf:</span>
                        <div className="font-semibold text-green-600">
                          {formatCurrency(price.new_amount)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vetusté:</span>
                        <div className="font-semibold text-red-600">
                          {parseFloat(price.obsolescence_rate)}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {price.disassembly && <Badge variant="outline" className="text-xs">Démontage</Badge>}
                        {price.replacement && <Badge variant="outline" className="text-xs">Remplacement</Badge>}
                        {price.repair && <Badge variant="outline" className="text-xs">Réparation</Badge>}
                        {price.paint && <Badge variant="outline" className="text-xs">Peinture</Badge>}
                        {price.control && <Badge variant="outline" className="text-xs">Contrôle</Badge>}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun prix trouvé</p>
                <p className="text-sm">Aucun prix disponible pour cette fourniture</p>
              </div>
            )}

            {/* Détails du prix sélectionné */}
            {selectedPrice && (
              <>
                <Separator />
                <div className="mt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Détails du prix sélectionné
                  </h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground">Prix neuf HT:</span>
                        <div className="font-medium">{formatCurrency(selectedPrice.new_amount_excluding_tax)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Prix neuf TTC:</span>
                        <div className="font-medium text-green-600">{formatCurrency(selectedPrice.new_amount)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground">Vetusté:</span>
                        <div className="font-medium text-red-600">{selectedPrice.obsolescence_rate}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Récupération:</span>
                        <div className="font-medium text-blue-600">{selectedPrice.recovery_amoun}%</div>
                      </div>
                    </div>

                    {selectedPrice.comment && (
                      <div>
                        <span className="text-muted-foreground">Commentaire:</span>
                        <div className="font-medium bg-muted p-2 rounded mt-1">
                          {selectedPrice.comment}
                        </div>
                      </div>
                    )}
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