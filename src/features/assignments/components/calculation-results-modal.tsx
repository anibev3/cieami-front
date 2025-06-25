import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calculator, 
  Package, 
  Users, 
  DollarSign, 
  CheckCircle,
  Eye,
  Download,
  Printer
} from 'lucide-react'

interface CalculationResult {
  shocks: any[]
  other_costs: any[]
  total_amount: number
}

interface CalculationResultsModalProps {
  isOpen: boolean
  calculationResult?: CalculationResult
  shockIndex: number
  onClose: () => void
  onApplyChanges: (data: any) => void
}

export function CalculationResultsModal({
  isOpen,
  calculationResult,
  shockIndex,
  onClose,
  onApplyChanges
}: CalculationResultsModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!calculationResult) {
    return null
  }

  const shock = calculationResult.shocks?.[shockIndex]
  const totalShockAmount = shock?.total_shock_amount || 0
  const totalWorkforceAmount = shock?.total_workforce_amount || 0
  const totalOtherCosts = calculationResult.other_costs?.reduce((sum, cost) => sum + (cost.amount || 0), 0) || 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Résultats du calcul - Point de choc {shockIndex + 1}
          </DialogTitle>
          <DialogDescription>
            Détails complets du calcul effectué
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="supplies">Fournitures</TabsTrigger>
            <TabsTrigger value="workforce">Main d'œuvre</TabsTrigger>
            <TabsTrigger value="costs">Coûts autres</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Fournitures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalShockAmount.toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {shock?.shock_works?.length || 0} article(s)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Main d'œuvre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {totalWorkforceAmount.toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {shock?.workforces?.length || 0} type(s)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Coûts autres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-600">
                    {totalOtherCosts.toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {calculationResult.other_costs?.length || 0} coût(s)
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Total général
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {calculationResult.total_amount?.toLocaleString('fr-FR')} €
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Montant total HT du dossier
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supplies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Détail des fournitures</CardTitle>
              </CardHeader>
              <CardContent>
                {shock?.shock_works?.length > 0 ? (
                  <div className="space-y-3">
                    {shock.shock_works.map((work: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{work.supply_label || `Fourniture ${index + 1}`}</p>
                            <p className="text-sm text-muted-foreground">{work.supply_code}</p>
                          </div>
                          <Badge variant="outline">
                            {work.amount?.toLocaleString('fr-FR')} €
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <input type="checkbox" checked={work.disassembly} readOnly />
                            <span>Démontage</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <input type="checkbox" checked={work.replacement} readOnly />
                            <span>Remplacement</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <input type="checkbox" checked={work.repair} readOnly />
                            <span>Réparation</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <input type="checkbox" checked={work.paint} readOnly />
                            <span>Peinture</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <input type="checkbox" checked={work.control} readOnly />
                            <span>Contrôle</span>
                          </div>
                        </div>
                        
                        {work.comment && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {work.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucune fourniture calculée</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workforce" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Détail de la main d'œuvre</CardTitle>
              </CardHeader>
              <CardContent>
                {shock?.workforces?.length > 0 ? (
                  <div className="space-y-3">
                    {shock.workforces.map((workforce: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{workforce.workforce_type_label || `Type ${index + 1}`}</p>
                            <p className="text-sm text-muted-foreground">
                              {workforce.nb_hours} heure(s) × {workforce.work_fee} €/h
                            </p>
                          </div>
                          <Badge variant="outline">
                            {workforce.amount?.toLocaleString('fr-FR')} €
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">HT :</span>
                            <span className="ml-1 font-semibold">
                              {workforce.amount_excluding_tax?.toLocaleString('fr-FR')} €
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">TVA :</span>
                            <span className="ml-1 font-semibold">
                              {workforce.amount_tax?.toLocaleString('fr-FR')} €
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Remise :</span>
                            <span className="ml-1 font-semibold">
                              {workforce.discount}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucune main d'œuvre calculée</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Détail des coûts autres</CardTitle>
              </CardHeader>
              <CardContent>
                {calculationResult.other_costs?.length > 0 ? (
                  <div className="space-y-3">
                    {calculationResult.other_costs.map((cost: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{cost.other_cost_type_label || `Coût ${index + 1}`}</p>
                            <p className="text-sm text-muted-foreground">{cost.other_cost_type_code}</p>
                          </div>
                          <Badge variant="outline">
                            {cost.amount?.toLocaleString('fr-FR')} €
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucun coût autre calculé</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={() => onApplyChanges(calculationResult)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Appliquer les changements
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 