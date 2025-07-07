import { SupplyPrice } from "@/types/supplies"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Info 
} from "lucide-react"

interface SupplyPriceDetailModalProps {
  supplyPrice: SupplyPrice | null
  isOpen: boolean
  onClose: () => void
}

export const formatCurrency = (amount: string) => {
  return parseFloat(amount).toLocaleString('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

export function SupplyPriceDetailModal({ 
  supplyPrice, 
  isOpen, 
  onClose 
}: SupplyPriceDetailModalProps) {
  if (!supplyPrice) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {supplyPrice.supply.label}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Détails complets du prix de fourniture
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Informations de base */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="h-4 w-4" />
                Informations de base
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-medium">{supplyPrice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fourniture:</span>
                  <span className="font-medium">{supplyPrice.supply.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Fourniture:</span>
                  <span>{supplyPrice.supply.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description:</span>
                  <span>{supplyPrice.supply.description || 'Aucune'}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Opérations */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Opérations
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  {supplyPrice.disassembly ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>Démontage</span>
                </div>
                <div className="flex items-center gap-2">
                  {supplyPrice.replacement ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>Remplacement</span>
                </div>
                <div className="flex items-center gap-2">
                  {supplyPrice.repair ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>Réparation</span>
                </div>
                <div className="flex items-center gap-2">
                  {supplyPrice.paint ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>Peinture</span>
                </div>
                <div className="flex items-center gap-2">
                  {supplyPrice.control ? (
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
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Prix neuf
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">HT:</span>
                  <span className="font-medium">{formatCurrency(supplyPrice.new_amount_excluding_tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVA:</span>
                  <span className="font-medium">{formatCurrency(supplyPrice.new_amount_tax)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-green-600">
                  <span>TTC:</span>
                  <span>{formatCurrency(supplyPrice.new_amount)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Obsolescence */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                Vetusté
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taux:</span>
                  <span className="font-medium text-red-600">{supplyPrice.obsolescence_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant HT:</span>
                  <span>{formatCurrency(supplyPrice.obsolescence_amount_excluding_tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant TTC:</span>
                  <span>{formatCurrency(supplyPrice.obsolescence_amount)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Récupération */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Récupération
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taux:</span>
                  <span className="font-medium text-blue-600">{supplyPrice.recovery_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant HT:</span>
                  <span>{formatCurrency(supplyPrice.recovery_amount_excluding_tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant TTC:</span>
                  <span>{formatCurrency(supplyPrice.recovery_amount)}</span>
                </div>
              </div>
            </div>

            {supplyPrice.comment && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Commentaire
                  </h3>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {supplyPrice.comment}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Informations système */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Informations système</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Dates</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Créé le:</span>
                      <span>{new Date(supplyPrice.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modifié le:</span>
                      <span>{new Date(supplyPrice.updated_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Statut</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Supprimé:</span>
                      <Badge variant={supplyPrice.deleted_at ? "destructive" : "default"}>
                        {supplyPrice.deleted_at ? "Oui" : "Non"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 