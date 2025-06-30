import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Download, 
  FileText, 
  Car,
  Receipt,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { formatDate } from '@/utils/format-date'
import { formatCurrency } from '@/utils/format-currency'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PdfViewer } from '@/components/ui/PdfViewer'

export default function InvoiceDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { 
    selectedInvoice, 
    loading, 
    fetchInvoiceById, 
    deleteInvoice 
  } = useInvoiceStore()

  const [pdfViewer, setPdfViewer] = useState<{
    open: boolean
    url: string
    title: string
  }>({
    open: false,
    url: '',
    title: ''
  })

  useEffect(() => {
    if (id) {
      fetchInvoiceById(Number(id))
    }
  }, [id, fetchInvoiceById])

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        await deleteInvoice(Number(id))
        navigate({ to: '/comptabilite/invoices' })
        toast.success('Facture supprimée avec succès')
      } catch (_error) {
        // L'erreur est déjà gérée dans le store
      }
    }
  }

  const handleEdit = () => {
    navigate({ to: `/comptabilite/invoices/${id}/edit` })
  }

  const handleBack = () => {
    navigate({ to: '/comptabilite/invoices' })
  }

  const handleViewPdf = (url: string, title: string) => {
    setPdfViewer({
      open: true,
      url,
      title
    })
  }

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    )
  }

  if (!selectedInvoice) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Facture non trouvée</p>
        <Button variant="outline" className="mt-4" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
    )
  }

  const invoice = selectedInvoice
  const assignment = invoice.assignment

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Facture {invoice.reference}</h1>
            <p className="text-muted-foreground">
              Détails de la facture et de l'assignation associée
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-20rem)] overflow-y-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-hidden scrollbar-hide scrollbar-thin">
          {/* Informations principales de la facture */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de la facture */}
            <Card className='shadow-none'>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informations de la facture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Référence</p>
                      <p className="text-lg font-semibold text-primary">{invoice.reference}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date de facturation</p>
                      <p className="text-sm font-semibold">{formatDate(invoice.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Statut</p>
                      <Badge className={getStatusColor(invoice.status.code)}>
                        {invoice.status.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Montant de la facture</p>
                      <p className="text-2xl font-bold text-primary">
                        {invoice.amount 
                          ? formatCurrency(Number(invoice.amount))
                          : formatCurrency(Number(assignment.total_amount))
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Créé par</p>
                      <p className="text-sm font-semibold">{invoice.created_by.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date de création</p>
                      <p className="text-sm font-semibold">{formatDate(invoice.created_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations de l'assignation */}
            <Card className='shadow-none'>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Informations de l'assignation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Informations générales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary border-b pb-1">Identité</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Référence</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{assignment.reference}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Numéro de police</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{assignment.policy_number}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Numéro de sinistre</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{assignment.claim_number}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary border-b pb-1">Dates importantes</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Date d'expertise</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{formatDate(assignment.expertise_date)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Date de réception</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{formatDate(assignment.received_at)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Lieu d'expertise</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{assignment.expertise_place || 'Non renseigné'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Montants */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-primary border-b pb-1">Montants</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Chocs (HT)</p>
                        <p className="text-sm font-semibold">{formatCurrency(Number(assignment.shock_amount_excluding_tax))}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Chocs (TVA)</p>
                        <p className="text-sm font-semibold">{formatCurrency(Number(assignment.shock_amount_tax))}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Autres coûts (HT)</p>
                        <p className="text-sm font-semibold">{formatCurrency(Number(assignment.other_cost_amount_excluding_tax))}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Honoraires (HT)</p>
                        <p className="text-sm font-semibold">{formatCurrency(Number(assignment.receipt_amount_excluding_tax))}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Total (HT)</p>
                        <p className="text-sm font-semibold text-primary">{formatCurrency(Number(assignment.total_amount_excluding_tax))}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Total (TVA)</p>
                        <p className="text-sm font-semibold">{formatCurrency(Number(assignment.total_amount_tax))}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Total (TTC)</p>
                        <p className="text-lg font-bold text-primary">{formatCurrency(Number(assignment.total_amount))}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Informations complémentaires */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-primary border-b pb-1">Informations complémentaires</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Circonstances</p>
                        <p className="text-sm bg-muted/50 px-2 py-1 rounded">{assignment.circumstance}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Dégâts déclarés</p>
                        <p className="text-sm bg-muted/50 px-2 py-1 rounded">{assignment.damage_declared}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Points notés</p>
                        <p className="text-sm bg-muted/50 px-2 py-1 rounded">{assignment.point_noted}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Administrateur</p>
                        <p className="text-sm bg-muted/50 px-2 py-1 rounded">{assignment.administrator || 'Non renseigné'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions et documents */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card className='shadow-none'>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {assignment.expertise_sheet && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs h-8" 
                    onClick={() => handleViewPdf(assignment.expertise_sheet!, 'Fiche d\'expertise')}
                  >
                    <Download className="h-3 w-3 mr-2" />
                    Voir la fiche d'expertise
                  </Button>
                )}
                {assignment.expertise_report && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-xs h-8" 
                    onClick={() => handleViewPdf(assignment.expertise_report!, 'Rapport d\'expertise')}
                  >
                    <Download className="h-3 w-3 mr-2" />
                    Voir le rapport d'expertise
                  </Button>
                )}
                <Button variant="outline" className="w-full justify-start text-xs h-8">
                  <Receipt className="h-3 w-3 mr-2" />
                  Gérer les quittances
                </Button>
              </CardContent>
            </Card>

            {/* Documents transmis */}
            {assignment.document_transmitted && assignment.document_transmitted.length > 0 && (
              <Card className='shadow-none'>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    Documents transmis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {assignment.document_transmitted.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{doc.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statuts et progression */}
            <Card className='shadow-none'>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4" />
                  Statuts et progression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Statut d'édition</p>
                    <Badge variant="secondary" className="text-xs">{assignment.edition_status || 'N/A'}</Badge>
                    {assignment.edition_per_cent && (
                      <p className="text-xs text-muted-foreground mt-1">{assignment.edition_per_cent}% complété</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Statut de récupération</p>
                    <Badge variant="secondary" className="text-xs">{assignment.recovery_status || 'N/A'}</Badge>
                    {assignment.recovery_per_cent && (
                      <p className="text-xs text-muted-foreground mt-1">{assignment.recovery_per_cent}% complété</p>
                    )}
                  </div>
                  {assignment.validated_at && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Validé le</p>
                      <p className="text-xs font-semibold">{formatDate(assignment.validated_at)}</p>
                    </div>
                  )}
                  {assignment.realized_at && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Réalisé le</p>
                      <p className="text-xs font-semibold">{formatDate(assignment.realized_at)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>

      {/* PDF Viewer Modal */}
      <PdfViewer
        open={pdfViewer.open}
        onOpenChange={(open) => setPdfViewer(prev => ({ ...prev, open }))}
        url={pdfViewer.url}
        title={pdfViewer.title}
      />
    </div>
  )
}
