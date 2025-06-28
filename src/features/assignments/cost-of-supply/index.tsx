import { useState, useEffect } from 'react'
import { useSupplyPricesStore, useSuppliesStore } from '@/stores/supplies'
import { SupplyPrice, SupplyPriceRequest } from '@/types/supplies'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Car, 
  Package, 
  Calendar, 
  Calculator, 
  Eye, 
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { DatePicker } from '@/features/comptabilite/payments/components/date-picker'
import { toast } from 'sonner'

export default function CostOfSupplyPage() {
  const { supplyPrices, loading, fetchSupplyPrices } = useSupplyPricesStore()
  const { fetchSupplies } = useSuppliesStore()
  
  const [formData, setFormData] = useState<SupplyPriceRequest>({
    vehicle_model_id: '',
    supply_id: null,
    date: null
  })

  const [selectedResult, setSelectedResult] = useState<SupplyPrice | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    fetchSupplies()
  }, [fetchSupplies])

  const handleSearch = async () => {
    if (!formData.vehicle_model_id) {
      toast.error('Veuillez sélectionner un modèle de véhicule')
      return
    }
    await fetchSupplyPrices(formData)
  }

  const handleResultClick = (supplyPrice: SupplyPrice) => {
    setSelectedResult(supplyPrice)
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
    const hasRecovery = parseFloat(supplyPrice.recovery_rate) > 0

    if (hasNewPrice) return <Badge className="bg-green-100 text-green-800">Nouveau</Badge>
    if (hasObsolescence) return <Badge className="bg-red-100 text-red-800">Obsolète</Badge>
    if (hasRecovery) return <Badge className="bg-blue-100 text-blue-800">Récupération</Badge>
    return <Badge variant="secondary">Standard</Badge>
  }

  const getOperationIcons = (supplyPrice: SupplyPrice) => {
    const operations = []
    if (supplyPrice.disassembly) operations.push('Démontage')
    if (supplyPrice.replacement) operations.push('Remplacement')
    if (supplyPrice.repair) operations.push('Réparation')
    if (supplyPrice.paint) operations.push('Peinture')
    if (supplyPrice.control) operations.push('Contrôle')
    return operations
  }

  return (
    <div className="h-full flex gap-6 p-6">
      {/* Colonne 1: Formulaire */}
      <div className="w-80 flex-shrink-0">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Recherche de prix
            </CardTitle>
            <CardDescription>
              Configurez les paramètres de recherche
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle_model_id" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Modèle de véhicule *
              </Label>
              <Input
                id="vehicle_model_id"
                value={formData.vehicle_model_id}
                onChange={(e) => setFormData({ ...formData, vehicle_model_id: e.target.value })}
                placeholder="Ex: 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supply_id" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Fourniture (optionnel)
              </Label>
              <Input
                id="supply_id"
                type="number"
                value={formData.supply_id || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  supply_id: e.target.value ? parseInt(e.target.value) : null 
                })}
                placeholder="Ex: 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date (optionnel)
              </Label>
              <DatePicker
                value={formData.date || ''}
                onValueChange={(date: string) => 
                  setFormData({ 
                    ...formData, 
                    date: date
                  })
                }
                placeholder="Sélectionnez une date..."
              />
            </div>

            <Button 
              onClick={handleSearch} 
              disabled={loading || !formData.vehicle_model_id}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recherche...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Colonne 2: Résultats */}
      <div className="flex-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Résultats ({supplyPrices.length})
              </div>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription>
              Cliquez sur un résultat pour voir les détails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {supplyPrices.map((supplyPrice) => (
                  <Card 
                    key={supplyPrice.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedResult?.id === supplyPrice.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleResultClick(supplyPrice)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{supplyPrice.supply.label}</span>
                        </div>
                        {getStatusBadge(supplyPrice)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Prix neuf:</span>
                          <div className="font-semibold text-green-600">
                            {formatCurrency(supplyPrice.new_amount)}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Taux obsolescence:</span>
                          <div className="font-semibold text-red-600">
                            {parseFloat(supplyPrice.obsolescence_rate)}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {getOperationIcons(supplyPrice).map((op, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {op}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {supplyPrices.length === 0 && !loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun résultat trouvé</p>
                    <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Colonne 3: Détails */}
      <div className="w-96 flex-shrink-0">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Détails
            </CardTitle>
            <CardDescription>
              Informations détaillées du prix sélectionné
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedResult ? (
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-4">
                  {/* Informations de base */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Fourniture
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nom:</span>
                        <span className="font-medium">{selectedResult.supply.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span>{selectedResult.supply.id}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Opérations */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Opérations
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        {selectedResult.disassembly ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Démontage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedResult.replacement ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Remplacement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedResult.repair ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Réparation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedResult.paint ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Peinture</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedResult.control ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Contrôle</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Prix neuf */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Prix neuf
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">HT:</span>
                        <span className="font-medium">{formatCurrency(selectedResult.new_amount_excluding_tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">TVA:</span>
                        <span className="font-medium">{formatCurrency(selectedResult.new_amount_tax)}</span>
                      </div>
                      <div className="flex justify-between text-base font-semibold text-green-600">
                        <span>TTC:</span>
                        <span>{formatCurrency(selectedResult.new_amount)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Obsolescence */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      Obsolescence
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taux:</span>
                        <span className="font-medium text-red-600">{selectedResult.obsolescence_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Montant HT:</span>
                        <span>{formatCurrency(selectedResult.obsolescence_amount_excluding_tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Montant TTC:</span>
                        <span>{formatCurrency(selectedResult.obsolescence_amount)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Récupération */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      Récupération
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taux:</span>
                        <span className="font-medium text-blue-600">{selectedResult.recovery_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Montant HT:</span>
                        <span>{formatCurrency(selectedResult.recovery_amount_excluding_tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Montant TTC:</span>
                        <span>{formatCurrency(selectedResult.recovery_amount)}</span>
                      </div>
                    </div>
                  </div>

                  {selectedResult.comment && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Commentaire
                        </h4>
                        <p className="text-sm text-muted-foreground">{selectedResult.comment}</p>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Informations système */}
                  <div>
                    <h4 className="font-semibold mb-2">Informations système</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Créé le:</span>
                        <span>{new Date(selectedResult.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Modifié le:</span>
                        <span>{new Date(selectedResult.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bouton pour voir plus de détails */}
                  <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        Voir tous les détails
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Détails complets - {selectedResult.supply.label}</DialogTitle>
                        <DialogDescription>
                          Toutes les informations détaillées du prix de fourniture
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Contenu détaillé du modal */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-semibold mb-2">Informations de base</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">ID:</span>
                                <span>{selectedResult.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Fourniture:</span>
                                <span>{selectedResult.supply.label}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">ID Fourniture:</span>
                                <span>{selectedResult.supply.id}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold mb-2">Opérations</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Démontage:</span>
                                <Badge variant={selectedResult.disassembly ? "default" : "secondary"}>
                                  {selectedResult.disassembly ? "Oui" : "Non"}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Remplacement:</span>
                                <Badge variant={selectedResult.replacement ? "default" : "secondary"}>
                                  {selectedResult.replacement ? "Oui" : "Non"}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Réparation:</span>
                                <Badge variant={selectedResult.repair ? "default" : "secondary"}>
                                  {selectedResult.repair ? "Oui" : "Non"}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Peinture:</span>
                                <Badge variant={selectedResult.paint ? "default" : "secondary"}>
                                  {selectedResult.paint ? "Oui" : "Non"}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Contrôle:</span>
                                <Badge variant={selectedResult.control ? "default" : "secondary"}>
                                  {selectedResult.control ? "Oui" : "Non"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <h5 className="font-semibold mb-2 text-green-600">Prix neuf</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>HT:</span>
                                <span className="font-medium">{formatCurrency(selectedResult.new_amount_excluding_tax)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>TVA:</span>
                                <span className="font-medium">{formatCurrency(selectedResult.new_amount_tax)}</span>
                              </div>
                              <div className="flex justify-between font-semibold">
                                <span>TTC:</span>
                                <span>{formatCurrency(selectedResult.new_amount)}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold mb-2 text-red-600">Obsolescence</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Taux:</span>
                                <span className="font-medium">{selectedResult.obsolescence_rate}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>HT:</span>
                                <span>{formatCurrency(selectedResult.obsolescence_amount_excluding_tax)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>TTC:</span>
                                <span>{formatCurrency(selectedResult.obsolescence_amount)}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold mb-2 text-blue-600">Récupération</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Taux:</span>
                                <span className="font-medium">{selectedResult.recovery_rate}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>HT:</span>
                                <span>{formatCurrency(selectedResult.recovery_amount_excluding_tax)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>TTC:</span>
                                <span>{formatCurrency(selectedResult.recovery_amount)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {selectedResult.comment && (
                          <>
                            <Separator />
                            <div>
                              <h5 className="font-semibold mb-2">Commentaire</h5>
                              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                                {selectedResult.comment}
                              </p>
                            </div>
                          </>
                        )}

                        <Separator />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <h5 className="font-semibold mb-2">Dates</h5>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Créé le:</span>
                                <span>{new Date(selectedResult.created_at).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Modifié le:</span>
                                <span>{new Date(selectedResult.updated_at).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold mb-2">Statut</h5>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Supprimé:</span>
                                <Badge variant={selectedResult.deleted_at ? "destructive" : "default"}>
                                  {selectedResult.deleted_at ? "Oui" : "Non"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Sélectionnez un résultat</p>
                <p className="text-sm">pour voir les détails</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}