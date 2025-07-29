/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Loader2, Receipt, Wrench, Car, Eye, DollarSign} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAssignmentsStore } from '@/stores/assignments'
import { formatDate } from '@/utils/format-date'
import { formatCurrency } from '@/utils/format-currency'

interface AssignmentSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  showReceipts?: boolean
  showShocks?: boolean
  showWorkforces?: boolean
  showOtherCosts?: boolean
  showDetails?: boolean
}

export function AssignmentSelect({
  value,
  onValueChange,
  placeholder = "Sélectionnez un dossier...",
  disabled = false,
  showReceipts = false,
  showShocks = false,
  showWorkforces = false,
  showOtherCosts = false,
  showDetails = false
}: AssignmentSelectProps) {
  const [open, setOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedAssignmentForDetails, setSelectedAssignmentForDetails] = useState<any>(null)
  const { assignments, loading, fetchAssignments } = useAssignmentsStore()

  // Filtrer les dossiers avec le statut "edited"
  const editedAssignments = assignments

  useEffect(() => {
    if (assignments.length === 0) {
      fetchAssignments( 1, {
        is_selected: true,
        // status_code: 'edited'
      })
    }
  }, [fetchAssignments, assignments.length])

  const selectedAssignment = editedAssignments.find(
    assignment => assignment.id.toString() === value
  )

  const handleShowDetails = (assignment: any) => {
    setSelectedAssignmentForDetails(assignment)
    setDetailsModalOpen(true)
  }

  const handleSelectFromDetails = (assignmentId: string) => {
    onValueChange(assignmentId)
    setDetailsModalOpen(false)
  }

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'edited':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'validated':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'realized':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const renderAssignmentInfo = (assignment: any) => {
    return (
      <div className="flex flex-col items-start text-left">
        <div className="flex items-center justify-between w-full">
          <span className="font-medium mr-30">{assignment.reference}</span>
          <Badge className={cn(getStatusColor(assignment.status.code), "text-xs")}>
            {assignment.status.label}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {assignment.client.name} - {assignment.vehicle.license_plate}
        </span>
        {showReceipts && assignment.receipts && assignment.receipts.length > 0 && (
          <div className="flex items-center gap-1 mt-1 p-1 w-full bg-grey-500 border-2 border-white-500 rounded-md justify-center">
            <Receipt className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600 font-medium">
              {assignment.receipts.length} quittance{assignment.receipts.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
        {showShocks && assignment.shocks && assignment.shocks.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Car className="h-3 w-3 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">
              {assignment.shocks.length} choc{assignment.shocks.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
        {showWorkforces && assignment.shocks && assignment.shocks.some((shock: any) => shock.workforces && shock.workforces.length > 0) && (
          <div className="flex items-center gap-1 mt-1">
            <Wrench className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">
              Main d'œuvre
            </span>
          </div>
        )}
        {showOtherCosts && assignment.other_costs && assignment.other_costs.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <DollarSign className="h-3 w-3 text-red-600" />
            <span className="text-xs text-red-600 font-medium">
              {assignment.other_costs.length} autre{assignment.other_costs.length > 1 ? 's' : ''} coût{assignment.other_costs.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-26"
            disabled={disabled || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : selectedAssignment ? (
                renderAssignmentInfo(selectedAssignment)
                // <div>
                //   <span className="font-medium">{selectedAssignment.reference}</span>
                //   <Badge className={cn(getStatusColor(selectedAssignment.status.code), "text-xs ml-2")}>
                //     {selectedAssignment.status.label}
                //   </Badge>
                // </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[400px] max-h-[400px] overflow-hidden" align="start">
          <Command className="max-h-[400px] overflow-hidden">
            <CommandInput placeholder="Rechercher un dossier..." />
            <CommandList className="h-[300px] overflow-y-auto" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Chargement des dossiers...
                </div>
              ) : editedAssignments.length === 0 ? (
                <CommandEmpty>Aucun dossier édité trouvé.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {editedAssignments.map((assignment) => (
                    <CommandItem
                      key={assignment.id}
                      value={`${assignment.reference} ${assignment.client.name} ${assignment.vehicle.license_plate}`}
                      onSelect={() => {
                        onValueChange(assignment.id.toString())
                        setOpen(false)
                      }}
                      className="flex flex-col items-start p-3"
                    >
                      <div className="flex items-center justify-between w-full">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === assignment.id.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {showDetails && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleShowDetails(assignment)
                            }}
                            className="h-6 w-6 p-0 ml-auto"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      {renderAssignmentInfo(assignment)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Modal de détails */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Détails du dossier {selectedAssignmentForDetails?.reference}
            </DialogTitle>
            <DialogDescription>
              Informations détaillées et sélection directe
            </DialogDescription>
          </DialogHeader>

          {selectedAssignmentForDetails && (
            <div className="space-y-6">
              {/* Informations générales */}
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Informations générales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Référence</p>
                      <p className="font-semibold">{selectedAssignmentForDetails.reference}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Statut</p>
                      <Badge className={getStatusColor(selectedAssignmentForDetails.status.code)}>
                        {selectedAssignmentForDetails.status.label}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Client</p>
                      <p className="font-semibold">{selectedAssignmentForDetails.client.name}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Véhicule</p>
                      <p className="font-semibold">{selectedAssignmentForDetails.vehicle.license_plate}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Date d'expertise</p>
                      <p className="font-semibold">{formatDate(selectedAssignmentForDetails.expertise_date)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Montant total</p>
                      <p className="font-semibold text-primary">
                        {formatCurrency(Number(selectedAssignmentForDetails.total_amount))}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Montant payé</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(selectedAssignmentForDetails.payment_received)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Reste à payer</p>
                      <p className="font-semibold text-orange-600">
                        {formatCurrency(selectedAssignmentForDetails.payment_remains)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quittances */}
              {showReceipts && selectedAssignmentForDetails.receipts && selectedAssignmentForDetails.receipts.length > 0 ? (
                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      Quittances ({selectedAssignmentForDetails.receipts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedAssignmentForDetails.receipts.map((receipt: any, index: number) => (
                        <div key={receipt.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{receipt.receipt_type.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(Number(receipt.amount))}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {formatDate(receipt.created_at)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="p-4 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground italic">
                    <span className="mr-2">✨</span>Aucune quittance trouvée<span className="ml-2">✨</span>
                  </p>
                </div>
              )}

              {/* Chocs */}
              {showShocks && selectedAssignmentForDetails.shocks && selectedAssignmentForDetails.shocks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Chocs ({selectedAssignmentForDetails.shocks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedAssignmentForDetails.shocks.map((shock: any, index: number) => (
                        <div key={shock.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{shock.shock_point.label}</p>
                            <Badge variant="outline">
                              {formatCurrency(Number(shock.amount || 0))}
                            </Badge>
                          </div>
                          {shock.shock_works && shock.shock_works.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {shock.shock_works.length} fourniture{shock.shock_works.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Main d'œuvre */}
              {showWorkforces && selectedAssignmentForDetails.shocks && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Main d'œuvre
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedAssignmentForDetails.shocks
                        .filter((shock: any) => shock.workforces && shock.workforces.length > 0)
                        .map((shock: any) => 
                          shock.workforces.map((workforce: any) => (
                            <div key={workforce.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">{workforce.workforce_type.label}</p>
                                <p className="text-sm text-muted-foreground">
                                  {workforce.nb_hours}h - {formatCurrency(Number(workforce.work_fee))}/h
                                </p>
                              </div>
                              <Badge variant="outline">
                                {formatCurrency(Number(workforce.amount))}
                              </Badge>
                            </div>
                          ))
                        )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Autres coûts */}
              {showOtherCosts && selectedAssignmentForDetails.other_costs && selectedAssignmentForDetails.other_costs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Autres coûts ({selectedAssignmentForDetails.other_costs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedAssignmentForDetails.other_costs.map((cost: any) => (
                        <div key={cost.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{cost.other_cost_type.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(cost.created_at)}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {formatCurrency(Number(cost.amount))}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bouton de sélection */}
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => handleSelectFromDetails(selectedAssignmentForDetails.id.toString())}
                  className="w-full"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Sélectionner ce dossier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 