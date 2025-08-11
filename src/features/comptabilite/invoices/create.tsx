/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Calendar,
  DollarSign,
  User,
  Car,
  Receipt,
  Wrench,
  CheckCircle,
  Loader2,
  FileText,
  // Filter,
  Settings2,
  ChevronDown,
  Eye
} from 'lucide-react'
import { useAssignmentsStore } from '@/stores/assignments'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { formatDate } from '@/utils/format-date'
import { formatCurrency } from '@/utils/format-currency'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function CreateInvoicePage() {
  const navigate = useNavigate()
  const { assignments, loading: assignmentsLoading, fetchAssignments } = useAssignmentsStore()
  const { createInvoice } = useInvoiceStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [invoiceObject, setInvoiceObject] = useState('')
  const [creating, setCreating] = useState(false)
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([])
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    reference: true,
    client: false,
    vehicle: false,
    policy: false,
    date: false,
    status: true,
    amount: true,
    details: false,
    actions: false
  })

  useEffect(() => {
    if (assignments.length === 0) {
      fetchAssignments()
    }
  }, [fetchAssignments, assignments.length])

  useEffect(() => {
    if (searchTerm) {
      fetchAssignments(1, { search: searchTerm, status_code: statusFilter })
    }
  }, [searchTerm, fetchAssignments, statusFilter])

  useEffect(() => {
    // Filtrer les dossiers basés sur la recherche et le statut
    const filtered = assignments.filter(assignment => {
      // Filtre par recherche textuelle avec vérifications de sécurité
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        (assignment.reference?.toLowerCase() || '').includes(searchLower) ||
        (assignment.client?.name?.toLowerCase() || '').includes(searchLower) ||
        (assignment.vehicle?.license_plate?.toLowerCase() || '').includes(searchLower) ||
        (assignment.policy_number?.toLowerCase() || '').includes(searchLower)
      
      // Filtre par statut
      const matchesStatus = statusFilter === 'all' || assignment.status?.code === statusFilter
      
      return matchesSearch && matchesStatus
    })
    
    setFilteredAssignments(filtered)
  }, [assignments, searchTerm, statusFilter])

  const handleCreateInvoice = async () => {
    if (!selectedAssignment) {
      
      toast.error('Veuillez sélectionner un dossier')
      return
    }

    if (!invoiceDate) {
      toast.error('Veuillez sélectionner une date de facturation')
      return
    }

    if (!invoiceObject.trim()) {
      toast.error('Veuillez saisir l\'objet de la facture')
      return
    }

    setCreating(true)
    try {
      await createInvoice({
        assignment_id: selectedAssignment.id.toString(),
        date: invoiceDate,
        object: invoiceObject.trim()
      })
      toast.success('Facture créée avec succès')
      navigate({ to: '/comptabilite/invoices' })
    } catch (_error) {
      toast.error('Erreur lors de la création de la facture')
    } finally {
      setCreating(false)
    }
  }

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'edited':
        return 'bg-blue-100 text-blue-800'
      case 'validated':
        return 'bg-green-100 text-green-800'
      case 'realized':
        return 'bg-purple-100 text-purple-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'opened':
        return 'bg-yellow-100 text-yellow-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-600'
      case 'deleted':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isAssignmentEligible = (assignment: any) => {
    return assignment.receipts && assignment.receipts.length > 0
    // assignment.status?.code === 'edited' &&
      
  }

  const handleRowClick = (assignment: any) => {
    if (isAssignmentEligible(assignment)) {
      setSelectedAssignment(assignment)
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/comptabilite/invoices' })}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Créez une nouvelle facture pour un dossier d'expertise
          </Button>
        </div>

        
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DataTable des dossiers */}
        <div className="lg:col-span-2">
          <div className="shadow-none">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate({ to: '/comptabilite/invoices' })}
                    className="hover:bg-gray-100"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Dossiers d'expertise
                  </Button>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings2 className="mr-2 h-4 w-4" />
                        Colonnes
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {Object.entries(columnVisibility).map(([key, visible]) => (
                        <DropdownMenuCheckboxItem
                          key={key}
                          checked={visible}
                          onCheckedChange={(checked) =>
                            setColumnVisibility(prev => ({ ...prev, [key]: checked }))
                          }
                        >
                          {key === 'reference' && 'Référence'}
                          {key === 'client' && 'Client'}
                          {key === 'vehicle' && 'Véhicule'}
                          {key === 'policy' && 'Police'}
                          {key === 'date' && 'Date'}
                          {key === 'status' && 'Statut'}
                          {key === 'amount' && 'Montant'}
                          {key === 'details' && 'Détails'}
                          {key === 'actions' && 'Actions'}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div>
              {/* Information sur les critères d'éligibilité */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                {/* <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Critères d'éligibilité</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {filteredAssignments.filter(a => isAssignmentEligible(a)).length} éligible{filteredAssignments.filter(a => isAssignmentEligible(a)).length > 1 ? 's' : ''}
                  </Badge>
                </div> */}
                <p className="text-xs text-blue-700">
                  Seuls les dossiers possédant au moins une quittance peuvent faire l'objet d'une facturation.
                </p>
              </div>

              <div className="flex items-center gap-2 justify-between mb-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par référence, client, plaque..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actives</SelectItem>
                      <SelectItem value="opened">Ouvertes</SelectItem>
                      <SelectItem value="realized">Réalisées</SelectItem>
                      <SelectItem value="edited">Éditées</SelectItem>
                      <SelectItem value="corrected">Corrigées</SelectItem>
                      <SelectItem value="closed">Fermées</SelectItem>
                      <SelectItem value="in_payment">En paiement</SelectItem>
                      <SelectItem value="paid">Payées</SelectItem>
                      <SelectItem value="inactive">Inactives</SelectItem>
                      <SelectItem value="cancelled">Annulées</SelectItem>
                      <SelectItem value="deleted">Supprimées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* DataTable */}
              <div className="rounded-md border">
                {assignmentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Chargement des dossiers...</span>
                  </div>
                ) : filteredAssignments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {searchTerm ? 'Aucun dossier trouvé' : 'Aucun dossier éligible'}
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm 
                        ? 'Aucun dossier ne correspond à votre recherche'
                        : 'Aucun dossier avec le statut "Édité" et des quittances n\'est disponible'
                      }
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                                      <Table>
                    <TableHeader>
                      <TableRow>
                        {columnVisibility.reference && (
                          <TableHead className="font-semibold">Référence</TableHead>
                        )}
                        {columnVisibility.client && (
                          <TableHead className="font-semibold">Client</TableHead>
                        )}
                        {columnVisibility.vehicle && (
                          <TableHead className="font-semibold">Véhicule</TableHead>
                        )}
                        {columnVisibility.policy && (
                          <TableHead className="font-semibold">Police</TableHead>
                        )}
                        {columnVisibility.date && (
                          <TableHead className="font-semibold">Date expertise</TableHead>
                        )}
                        {columnVisibility.status && (
                          <TableHead className="font-semibold">Statut</TableHead>
                        )}
                        {columnVisibility.amount && (
                          <TableHead className="font-semibold">Montant</TableHead>
                        )}
                        {columnVisibility.details && (
                          <TableHead className="font-semibold">Détails</TableHead>
                        )}
                        {columnVisibility.actions && (
                          <TableHead className="font-semibold">Actions</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssignments.map((assignment) => {
                        const isSelected = selectedAssignment?.id === assignment.id
                        const isEligible = isAssignmentEligible(assignment)
                        // const isEligible = true
                        
                        return (
                          <TableRow 
                            key={assignment.id}
                            className={cn(
                              "transition-all duration-200",
                              isEligible 
                                ? "cursor-pointer hover:bg-gray-50" 
                                : "cursor-not-allowed opacity-60",
                              isSelected && "bg-blue-50 border-l-4 border-l-blue-500"
                            )}
                            onClick={() => handleRowClick(assignment)}
                          >
                            {columnVisibility.reference && (
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {assignment.reference}
                                  {isSelected && (
                                    <CheckCircle className="h-4 w-4 text-blue-600" />
                                  )}
                                </div>
                              </TableCell>
                            )}
                            
                            {columnVisibility.client && (
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="truncate max-w-[150px]">
                                    {assignment.client?.name || 'Client inconnu'}
                                  </span>
                                </div>
                              </TableCell>
                            )}
                            
                            {columnVisibility.vehicle && (
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Car className="h-4 w-4 text-gray-500" />
                                  <span className="font-mono">
                                    {assignment.vehicle?.license_plate || 'N/A'}
                                  </span>
                                </div>
                              </TableCell>
                            )}
                            
                            {columnVisibility.policy && (
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    {assignment.policy_number || 'N/A'}
                                  </span>
                                </div>
                              </TableCell>
                            )}
                            
                            {columnVisibility.date && (
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    {formatDate(assignment.expertise_date)}
                                  </span>
                                </div>
                              </TableCell>
                            )}
                            
                            {columnVisibility.status && (
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Badge className={cn(getStatusColor(assignment.status?.code || ''), "text-xs")}>
                                    {assignment.status?.label || 'Statut inconnu'}
                                  </Badge>
                                  {!isEligible && (
                                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                      {assignment.status?.code !== 'edited' ? 'Non éligible' : 'Pas de quittance'}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                            )}
                            
                            {columnVisibility.amount && (
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {/* <DollarSign className="h-4 w-4 text-gray-500" /> */}
                                  <span className="font-semibold text-green-600">
                                    {formatCurrency(Number(assignment.receipt_amount || 0))}
                                  </span>
                                </div>
                              </TableCell>
                            )}
                            
                            {columnVisibility.details && (
                              <TableCell>
                                <div className="flex items-center gap-3 text-xs">
                                  {assignment.receipts && assignment.receipts.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <Receipt className="h-3 w-3 text-green-600" />
                                      <span className="text-green-600 font-medium">
                                        {assignment.receipts.length}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {assignment.shocks && assignment.shocks.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <Car className="h-3 w-3 text-orange-600" />
                                      <span className="text-orange-600 font-medium">
                                        {assignment.shocks.length}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {assignment.shocks && assignment.shocks.some((shock: any) => shock.workforces && shock.workforces.length > 0) && (
                                    <div className="flex items-center gap-1">
                                      <Wrench className="h-3 w-3 text-blue-600" />
                                      <span className="text-blue-600 font-medium">MO</span>
                                    </div>
                                  )}
                                  
                                  {assignment.other_costs && assignment.other_costs.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-3 w-3 text-red-600" />
                                      <span className="text-red-600 font-medium">
                                        {assignment.other_costs.length}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            )}
                            
                            {columnVisibility.actions && (
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (isEligible) {
                                        setSelectedAssignment(assignment)
                                      }
                                    }}
                                    disabled={!isEligible}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  </ScrollArea>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panneau de création */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Créer la facture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Dossier sélectionné */}
              {selectedAssignment ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Dossier sélectionné</Label>
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <h5 className="font-semibold text-blue-900">{selectedAssignment.reference}</h5>
                        {/* <Badge className={cn(getStatusColor(selectedAssignment.status.code), "text-xs")}>
                          {selectedAssignment.status.label}
                        </Badge> */}
                      </div>
                      {/* <p className="text-sm text-blue-700 mb-1">
                        {selectedAssignment.client.name} - {selectedAssignment.vehicle.license_plate}
                      </p>
                      <p className="text-xs text-blue-600">
                        Police: {selectedAssignment.policy_number} • Expertise: {formatDate(selectedAssignment.expertise_date)}
                      </p> */}
                    </div>
                  </div>

                  <Separator />

                  {/* Informations de paiement */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Informations de paiement</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Montant total :</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(Number(selectedAssignment.total_amount))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                        <span className="text-sm text-gray-600">Déjà payé :</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(selectedAssignment.payment_received)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                        <span className="text-sm text-gray-600">Reste à payer :</span>
                        <span className="font-semibold text-orange-600">
                          {formatCurrency(selectedAssignment.payment_remains)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Montant des quittances */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Montant des quittances</Label>
                    <div className="mt-2 text-2xl font-bold text-green-600">
                      {formatCurrency(Number(selectedAssignment.receipt_amount))}
                    </div>
                  </div>

                  <Separator />

                  {/* Date de facturation */}
                  <div>
                    <Label htmlFor="invoice-date" className="text-sm font-medium text-gray-700">
                      Date de facturation
                    </Label>
                    <Input
                      id="invoice-date"
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  {/* Objet de la facture */}
                  <div>
                    <Label htmlFor="invoice-object" className="text-sm font-medium text-gray-700">
                      Objet de la facture
                    </Label>
                    <Input
                      id="invoice-object"
                      type="text"
                      value={invoiceObject}
                      onChange={(e) => setInvoiceObject(e.target.value)}
                      placeholder="Ex: Expertise véhicule accidenté"
                      className="mt-2"
                    />
                  </div>

                  <Separator />

                  {/* Résumé des éléments */}
                  {/* <div>
                    <Label className="text-sm font-medium text-gray-700">Résumé des éléments</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      {selectedAssignment.receipts && selectedAssignment.receipts.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-green-600" />
                            Quittances
                          </span>
                          <span className="font-medium">
                            {formatCurrency(Number(selectedAssignment.receipt_amount || 0))}
                          </span>
                        </div>
                      )}
                      
                      {selectedAssignment.shocks && selectedAssignment.shocks.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-orange-600" />
                            Chocs
                          </span>
                          <span className="font-medium">
                            {formatCurrency(Number(selectedAssignment.shock_amount || 0))}
                          </span>
                        </div>
                      )}
                      
                      {selectedAssignment.other_costs && selectedAssignment.other_costs.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-red-600" />
                            Autres coûts
                          </span>
                          <span className="font-medium">
                            {formatCurrency(Number(selectedAssignment.other_cost_amount || 0))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div> */}

                  {/* <Separator /> */}

                  {/* Bouton de création */}
                  <Button 
                    onClick={handleCreateInvoice}
                    disabled={creating}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Créer la facture
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Sélectionnez un dossier
                  </h3>
                  <p className="text-gray-500">
                    Choisissez un dossier dans la liste pour créer une facture
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 