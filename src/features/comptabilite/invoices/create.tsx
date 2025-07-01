/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Eye, 
  Calendar,
  DollarSign,
  User,
  Car,
  Building,
  Receipt,
  Wrench,
  CheckCircle,
  Loader2,
  FileText
} from 'lucide-react'
import { useAssignmentsStore } from '@/stores/assignments'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { formatDate } from '@/utils/format-date'
import { formatCurrency } from '@/utils/format-currency'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function CreateInvoicePage() {
  const navigate = useNavigate()
  const { assignments, loading: assignmentsLoading, fetchAssignments } = useAssignmentsStore()
  const { createInvoice } = useInvoiceStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [creating, setCreating] = useState(false)
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([])

  useEffect(() => {
    if (assignments.length === 0) {
      fetchAssignments()
    }
  }, [fetchAssignments, assignments.length])

  useEffect(() => {
    // Filtrer les dossiers basés sur la recherche
    const filtered = assignments.filter(assignment => 
      assignment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.policy_number.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredAssignments(filtered)
  }, [assignments, searchTerm])

  const handleCreateInvoice = async () => {
    if (!selectedAssignment) {
      toast.error('Veuillez sélectionner un dossier')
      return
    }

    if (!invoiceDate) {
      toast.error('Veuillez sélectionner une date de facturation')
      return
    }

    setCreating(true)
    try {
      await createInvoice({
        assignment_id: selectedAssignment.id.toString(),
        date: invoiceDate
      })
      toast.success('Facture créée avec succès')
      navigate({ to: '/comptabilite/invoices' })
    } catch (error) {
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
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderAssignmentCard = (assignment: any) => {
    const isSelected = selectedAssignment?.id === assignment.id
    
    return (
      <Card 
        key={assignment.id} 
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md shadow-none",
          isSelected 
            ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" 
            : "hover:border-gray-300"
        )}
        onClick={() => setSelectedAssignment(assignment)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {assignment.reference}
                </h3>
                <Badge className={cn(getStatusColor(assignment.status.code), "text-xs")}>
                  {assignment.status.label}
                </Badge>
                {isSelected && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{assignment.client.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{assignment.vehicle.license_plate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="truncate">Police: {assignment.policy_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{formatDate(assignment.expertise_date)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span className="font-medium">{formatCurrency(Number(assignment.total_amount))}</span>
                </div>
                
                {assignment.receipts && assignment.receipts.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Receipt className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">
                      {assignment.receipts.length} quittance{assignment.receipts.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                
                {assignment.shocks && assignment.shocks.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Car className="h-3 w-3 text-orange-600" />
                    <span className="text-orange-600 font-medium">
                      {assignment.shocks.length} choc{assignment.shocks.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                
                {assignment.shocks && assignment.shocks.some((shock: any) => shock.workforces && shock.workforces.length > 0) && (
                  <div className="flex items-center gap-1">
                    <Wrench className="h-3 w-3 text-blue-600" />
                    <span className="text-blue-600 font-medium">Main d'œuvre</span>
                  </div>
                )}
                
                {assignment.other_costs && assignment.other_costs.length > 0 && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-red-600" />
                    <span className="text-red-600 font-medium">
                      {assignment.other_costs.length} autre{assignment.other_costs.length > 1 ? 's' : ''} coût{assignment.other_costs.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/comptabilite/invoices' })}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nouvelle facture</h1>
            <p className="text-muted-foreground">
              Créez une nouvelle facture pour un dossier d'expertise
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des dossiers */}
        <div className="lg:col-span-2">
          <div className="shadow-none h-full">
            {/* <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Sélectionner un dossier
              </CardTitle>
            </CardHeader> */}
            <CardContent>
              {/* Barre de recherche */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par référence, client, plaque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Liste des dossiers */}
              <ScrollArea className="h-[530px]">
                {assignmentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Chargement des dossiers...</span>
                  </div>
                ) : filteredAssignments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {searchTerm ? 'Aucun dossier trouvé' : 'Aucun dossier disponible'}
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm 
                        ? 'Aucun dossier ne correspond à votre recherche'
                        : 'Tous les dossiers ont été traités'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAssignments.map(renderAssignmentCard)}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
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
            <CardContent className="space-y-6">
              {/* Dossier sélectionné */}
              {selectedAssignment ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Dossier sélectionné</Label>
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-blue-900">{selectedAssignment.reference}</h4>
                        <Badge className={cn(getStatusColor(selectedAssignment.status.code), "text-xs")}>
                          {selectedAssignment.status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-700 mb-1">
                        {selectedAssignment.client.name} - {selectedAssignment.vehicle.license_plate}
                      </p>
                      <p className="text-xs text-blue-600">
                        Police: {selectedAssignment.policy_number} • Expertise: {formatDate(selectedAssignment.expertise_date)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Montant total */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Montant total</Label>
                    <div className="mt-2 text-2xl font-bold text-green-600">
                      {formatCurrency(Number(selectedAssignment.total_amount))}
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

                  <Separator />

                  {/* Résumé des éléments */}
                  <div>
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
                  </div>

                  <Separator />

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