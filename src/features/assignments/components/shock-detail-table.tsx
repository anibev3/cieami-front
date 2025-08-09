import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { formatCurrency, formatCurrencyWithoutCurrencySymbol } from '@/utils/format-currency'
import { 
  Wrench, 
  Paintbrush, 
  Settings, 
  RotateCcw, 
  Package,
  Pencil,
  Users,
  ChevronLeft,
  ChevronRight,
  MapPin,
  List,
  Eye
} from 'lucide-react'
import { useRouter } from '@tanstack/react-router'

interface ShockWork {
  id: number
  disassembly: boolean
  replacement: boolean
  repair: boolean
  paint: boolean
  obsolescence: boolean
  control: boolean
  comment: string | null
  amount: string
  obsolescence_rate: string
  obsolescence_amount_excluding_tax: string
  obsolescence_amount_tax: string
  obsolescence_amount: string
  recovery_amount_excluding_tax: string
  recovery_amount_tax: string
  recovery_amount: string
  discount: string
  discount_amount_excluding_tax: string
  discount_amount_tax: string
  discount_amount: string
  new_amount_excluding_tax: string
  new_amount_tax: string
  new_amount: string
  supply: {
    id: number
    label: string
    description: string
  }
}

interface Workforce {
  id: number
  nb_hours: string
  work_fee: string
  with_tax: number
  discount: string
  amount_excluding_tax: string
  amount_tax: string
  amount: string
  workforce_type: {
    id: number
    code: string
    label: string
    description: string
  }
}

interface Shock {
  id: number
  shock_point: {
    id: number
    code: string
    label: string
    description: string
  }
  shock_works: ShockWork[]
  workforces: Workforce[]
  amount_excluding_tax: string
  amount_tax: string
  amount: string
}

interface ShockDetailTableProps {
  shocks: Shock[],
  assignment_status: string,
  assignment_id: string
}

export function ShockDetailTable({ shocks, assignment_status, assignment_id }: ShockDetailTableProps) {
  const [activeShockIndex, setActiveShockIndex] = useState(0)
  const [isNavigationMode, setIsNavigationMode] = useState(true)
  
  if (!shocks || shocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-semibold">Points de choc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8 text-[10px]">
            Aucun point de choc enregistré
          </div>
        </CardContent>
      </Card>
    )
  }

  // Si il n'y a qu'un seul choc, pas besoin de navigation
  if (shocks.length === 1) {
    return (
      <div className="space-y-3">
        {shocks.map((shock) => (
          <ShockContent 
            key={shock.id} 
            shock={shock} 
            assignment_status={assignment_status} 
            assignment_id={assignment_id} 
          />
        ))}
      </div>
    )
  }

  // Mode liste complète
  if (!isNavigationMode) {
    return (
      <div className="space-y-4">
        {/* Header avec toggle */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <List className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-sm text-green-900">Vue complète des chocs</h3>
                <p className="text-xs text-green-700">
                  Affichage de tous les {shocks.length} chocs
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-600" />
                <Label htmlFor="navigation-mode" className="text-sm font-medium text-green-900">
                  Mode navigation
                </Label>
                <Switch
                  id="navigation-mode"
                  checked={isNavigationMode}
                  onCheckedChange={setIsNavigationMode}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Liste complète de tous les chocs */}
        <div className="space-y-6">
          {shocks.map((shock, index) => (
            <div key={shock.id} className="space-y-3">
              {/* Séparateur avec numéro */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 h-px bg-green-200"></div>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                  Choc {index + 1} sur {shocks.length}
                </Badge>
              </div>
              
              <ShockContent 
                shock={shock} 
                assignment_status={assignment_status} 
                assignment_id={assignment_id} 
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Mode navigation
  const currentShock = shocks[activeShockIndex]
  
  const goToPrevious = () => {
    setActiveShockIndex(prev => prev > 0 ? prev - 1 : shocks.length - 1)
  }
  
  const goToNext = () => {
    setActiveShockIndex(prev => prev < shocks.length - 1 ? prev + 1 : 0)
  }

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-sm text-blue-900">Navigation entre les chocs</h3>
              <p className="text-xs text-blue-700">
                Choc {activeShockIndex + 1} sur {shocks.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              
              <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-md border">
                <span className="text-sm font-medium text-blue-900">
                  {currentShock.shock_point.code}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {activeShockIndex + 1}/{shocks.length}
                </Badge>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                className="flex items-center gap-1"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 text-blue-600" />
              <Label htmlFor="navigation-mode" className="text-sm font-medium text-blue-900">
                Vue complète
              </Label>
              <Switch
                id="navigation-mode"
                checked={isNavigationMode}
                onCheckedChange={setIsNavigationMode}
              />
            </div>
          </div>
        </div>
        
        {/* Indicateurs de progression */}
        <div className="mt-3 flex gap-1">
          {shocks.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                index === activeShockIndex
                  ? 'bg-blue-600 flex-1'
                  : 'bg-blue-200 flex-1 hover:bg-blue-300'
              }`}
              onClick={() => setActiveShockIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Contenu du choc actuel */}
      <ShockContent 
        shock={currentShock} 
        assignment_status={assignment_status} 
        assignment_id={assignment_id} 
      />
    </div>
  )
}

// Composant pour afficher le contenu d'un choc
function ShockContent({ 
  shock, 
  assignment_status, 
  assignment_id 
}: { 
  shock: Shock
  assignment_status: string
  assignment_id: string 
}) {
  const router = useRouter()
  
  return (
    <div className="space-y-3">
      {/* Header with shock point info */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-[15px] flex items-center gap-2">
          <Wrench className="h-4 w-4 text-blue-600" />
          {shock.shock_point.label}
          <Badge variant="outline" className="text-[10px]">
            {shock.shock_point.code}
          </Badge>
        </h4>
        {assignment_status === 'edited' && (
          <Badge variant="outline" className="text-[10px] bg-primary text-white cursor-pointer" onClick={() => {
            router.navigate({
              to: `/assignments/edit-report/${assignment_id}?tab=shocks&info=edit-shocks&shock_id=${shock.id}`,
            })
          }}>
            <Pencil className="h-2 w-2" />
            Modifier le choc
          </Badge>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-[10px]">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="border px-3 py-2 text-left font-medium text-[10px]">
                Fournitures
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                D/p
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Remp
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Rep
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Peint
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Vétusté
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Montant HT
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Remise
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Remise Calculé
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Vétuste (%)
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Vétuste calculée
              </th>
              <th className="border px-2 py-2 text-center font-medium text-purple-600 text-[10px]">
                Montant TTC
              </th>
            </tr>
          </thead>
          <tbody>
            {shock.shock_works.length === 0 && (
              <tr>
                <td colSpan={12} className="text-center text-muted-foreground py-8 text-[10px]">
                  Aucune fourniture enregistrée
                </td>
              </tr>
            )}
            {shock.shock_works.map((work) => (
              <tr key={work.id} className="hover:bg-gray-50 transition-colors">
                {/* Fournitures */}
                <td className="border px-3 py-2 text-[10px]">
                  <div>
                    <div className="font-medium text-[10px]">{work.supply.label}</div>
                  </div>
                </td>
                {/* D/p */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  {work.disassembly ? (
                    <Badge variant="secondary" className="text-[10px]">
                      <Settings className="h-2 w-2" />
                    </Badge>
                  ) : '-'}
                </td>
                {/* Remp */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  {work.replacement ? (
                    <Badge variant="default" className="text-[10px]">
                      <Package className="h-2 w-2" />
                    </Badge>
                  ) : '-'}
                </td>
                {/* Rep */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  {work.repair ? (
                    <Badge variant="outline" className="text-[10px]">
                      <Wrench className="h-2 w-2" />
                    </Badge>
                  ) : '-'}
                </td>
                {/* Peint */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  {work.paint ? (
                    <Badge variant="secondary" className="text-[10px]">
                      <Paintbrush className="h-2 w-2" />
                    </Badge>
                  ) : '-'}
                </td>
                {/* Vétusté */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  {work.obsolescence ? (
                    <Badge variant="destructive" className="text-[10px]">
                      <RotateCcw className="h-2 w-2" />
                    </Badge>
                  ) : '-'}
                </td>
                {/* Montant HT */}
                <td className="border px-2 text-[10px]">
                  {formatCurrencyWithoutCurrencySymbol(parseFloat(work.new_amount_excluding_tax))}
                </td>
                {/* Remise */}
                <td className="border px-2 py-2 text-[10px]">
                  {formatCurrencyWithoutCurrencySymbol(parseFloat(work.discount_amount_excluding_tax || '0'))}
                </td>
                {/* Remise Calculé */}
                <td className="border px-2 py-2 text-[10px]">
                  <div className={`font-bold ${(parseFloat(work.new_amount_excluding_tax) - parseFloat(work.discount_amount_excluding_tax || '0')) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                    {formatCurrencyWithoutCurrencySymbol(parseFloat(work.new_amount_excluding_tax) - parseFloat(work.discount_amount_excluding_tax || '0'))}
                  </div>
                </td>
                {/* Vétuste (%) */}
                <td className="border px-2 text-[10px]">
                  {work.obsolescence_rate}%
                </td>
                {/* Vétuste calculée */}
                <td className="border px-2 text-[10px]">
                  {formatCurrencyWithoutCurrencySymbol(parseFloat(work.obsolescence_amount_excluding_tax))}
                </td>
                {/* Montant TTC */}
                <td className="border px-2 py-2 text-[10px] w-35">
                  <div className={`font-bold ${parseFloat(work.new_amount) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                    {formatCurrencyWithoutCurrencySymbol(parseFloat(work.new_amount))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Récapitulatif moderne */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4">
        <div className="text-[10px] text-center items-center flex justify-around">
          <div className="text-center">
            <div className="text-gray-600 font-medium">Total lignes</div>
            <div className="text-lg font-bold text-gray-800">{shock.shock_works.length}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-medium">Vetusté TTC</div>
            <div className="text-base font-bold text-blue-700">
              {formatCurrency(shock.shock_works.reduce((sum, work) => sum + parseFloat(work.obsolescence_amount), 0))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-medium">Remise TTC</div>
            <div className="text-base font-bold text-blue-700">
              {formatCurrency(shock.shock_works.reduce((sum, work) => sum + parseFloat(work.discount_amount || '0'), 0))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-medium">Récupération TTC</div>
            <div className="text-base font-bold text-green-700">
              {formatCurrency(shock.shock_works.reduce((sum, work) => sum + parseFloat(work.recovery_amount), 0))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-medium">Montant Final HT</div>
            <div className={`text-base font-bold ${parseFloat(shock.amount_excluding_tax) >= 0 ? 'text-purple-700' : 'text-red-600'}`}>
              {formatCurrency(parseFloat(shock.amount_excluding_tax))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-medium">Montant Final TTC</div>
            <div className={`text-base font-bold ${parseFloat(shock.amount) >= 0 ? 'text-purple-700' : 'text-red-600'}`}>
              {formatCurrency(parseFloat(shock.amount))}
            </div>
          </div>
        </div>
      </div>

      {/* Main d'œuvre */}
      {shock.workforces && shock.workforces.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-600" />
            <h5 className="font-semibold text-[10px] text-orange-600">Main d'œuvre</h5>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border text-[10px]">
              <thead>
                <tr className="bg-orange-50 border-b">
                  <th className="border px-3 py-2 text-left font-medium text-[10px]">
                    Type de main d'œuvre
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Heures
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Tarif horaire
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Remise
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Montant HT
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    TVA
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-orange-600 text-[10px]">
                    Montant TTC
                  </th>
                </tr>
              </thead>
              <tbody>
                {shock.workforces.map((workforce) => (
                  <tr key={workforce.id} className="hover:bg-orange-50 transition-colors">
                    <td className="border px-3 py-2 text-[10px]">
                      <div>
                        <div className="font-medium text-[10px]">{workforce.workforce_type.label}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {workforce.workforce_type.description}
                        </div>
                      </div>
                    </td>
                    <td className="border px-2 py-2 text-center text-[10px]">
                      {workforce.nb_hours} h
                    </td>
                    <td className="border px-2 py-2 text-center text-[10px]">
                      {formatCurrencyWithoutCurrencySymbol(parseFloat(workforce.work_fee))}
                    </td>
                    <td className="border px-2 py-2 text-center text-[10px]">
                      {formatCurrencyWithoutCurrencySymbol(parseFloat(workforce.discount))}
                    </td>
                    <td className="border px-2 py-2 text-center text-[10px]">
                      {formatCurrencyWithoutCurrencySymbol(parseFloat(workforce.amount_excluding_tax))}
                    </td>
                    <td className="border px-2 py-2 text-center text-[10px]">
                      {formatCurrencyWithoutCurrencySymbol(parseFloat(workforce.amount_tax))}
                    </td>
                    <td className="border px-2 py-2 text-center text-[10px] w-35">
                      <div className="font-bold text-orange-600">
                        {formatCurrencyWithoutCurrencySymbol(parseFloat(workforce.amount))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Récapitulatif main d'œuvre */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3">
            <div className="text-[10px] text-center items-center flex justify-around">
              <div className="text-center">
                <div className="text-gray-600 font-medium">Total main d'œuvre</div>
                <div className="text-lg font-bold text-gray-800">{shock.workforces.length}</div>
              </div>
              <div className="text-center">
                <div className="text-orange-600 font-medium">Total heures</div>
                <div className="text-base font-bold text-orange-700">
                  {shock.workforces.reduce((sum, workforce) => sum + parseFloat(workforce.nb_hours), 0).toFixed(2)} h
                </div>
              </div>
              <div className="text-center">
                <div className="text-orange-600 font-medium">Main d'œuvre HT</div>
                <div className="text-base font-bold text-orange-700">
                  {formatCurrency(shock.workforces.reduce((sum, workforce) => sum + parseFloat(workforce.amount_excluding_tax), 0))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-orange-600 font-medium">Main d'œuvre TTC</div>
                <div className="text-base font-bold text-orange-700">
                  {formatCurrency(shock.workforces.reduce((sum, workforce) => sum + parseFloat(workforce.amount), 0))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 