import { Assignment } from '@/types/assignments'
import { Button } from '@/components/ui/button'
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Receipt, 
  ExternalLink, 
  Eye,
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { AssignmentPreviewModal } from './assignment-preview-modal'
import { useNavigate } from '@tanstack/react-router'

interface AssignmentActionsProps {
  assignment: Assignment
  onDelete: (assignment: Assignment) => void
  onOpenReceiptModal: (assignmentId: number, amount: number) => void
  onViewDetail: (assignmentId: number) => void
}

export function AssignmentActions({
  assignment,
  onDelete,
  onOpenReceiptModal,
  onViewDetail
}: AssignmentActionsProps) {
  const navigate = useNavigate()
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  
  // Fonction pour déterminer les actions disponibles selon le statut
  const getAvailableActions = (statusCode: string, assignment: Assignment) => {
    const baseActions = [
      {
        key: 'view-detail',
        label: 'Voir le détail',
        icon: ExternalLink,
        onClick: () => onViewDetail(assignment.id),
        show: true,
        destructive: false
      },
      {
        key: 'view',
        label: 'Aperçu rapide',
        icon: Eye,
        onClick: () => setIsPreviewModalOpen(true),
        show: true,
        destructive: false
      }
    ]

    const statusActions = {
      // Statuts initiaux - toutes les actions disponibles
      'pending': [
        {
          key: 'edit',
          label: 'Modifier',
          icon: Edit,
          onClick: () => navigate({ to: `/assignments/edite-report/${assignment.id}` }),
          show: true,
          destructive: false
        },
        {
          key: 'receipts',
          label: assignment.receipts && assignment.receipts.length > 0 ? 'Modifier les quittances' : 'Ajouter une quittance',
          icon: Receipt,
          onClick: () => onOpenReceiptModal(assignment.id, parseFloat(assignment.total_amount || '0')),
          show: true,
          destructive: false
        },
        {
          key: 'delete',
          label: 'Supprimer',
          icon: Trash2,
          onClick: () => onDelete(assignment),
          show: true,
          destructive: true
        }
      ],
      // Statuts en cours - modification limitée
      'opened': [
        {
          key: 'edit',
          label: 'Modifier',
          icon: Edit,
          onClick: () => navigate({ to: `/assignments/edit/${assignment.id}` }),
          show: true,
          destructive: false
        },
        // {
        //   key: 'receipts',
        //   label: assignment.receipts && assignment.receipts.length > 0 ? 'Modifier les quittances' : 'Ajouter une quittance',
        //   icon: Receipt,
        //   onClick: () => onOpenReceiptModal(assignment.id, parseFloat(assignment.total_amount || '0')),
        //   show: true,
        //   destructive: false
        // },
        {
          key: 'realize-opened',
          label: 'Réaliser le dossier',
          icon: CheckCircle,
          onClick: () => navigate({ to: `/assignments/realize/${assignment.id}` }),
          show: true,
          destructive: false
        },
      ],
      // Statuts réalisés - lecture et quittances
      'realized': [
        {
          key: 'edit-realization',
          label: 'Modifier la réalisation',
          icon: Edit,
          onClick: () => navigate({ to: `/assignments/realize/${assignment.id}` }),
          show: true,
          destructive: false
        },
        // {
        //   key: 'receipts',
        //   label: assignment.receipts && assignment.receipts.length > 0 ? 'Modifier les quittances' : 'Ajouter une quittance',
        //   icon: Receipt,
        //   onClick: () => onOpenReceiptModal(assignment.id, parseFloat(assignment.total_amount || '0')),
        //   show: true,
        //   destructive: false
        // },
        {
          key: 'write-report',
          label: 'Rédiger  ' + (assignment.expertise_type.code === 'evaluation' ? 'le rapport' : '    le rapport'), 
          icon: FileText,
          onClick: () => {
            if (assignment.expertise_type.code === 'evaluation') {
              navigate({ to: `/assignments/evaluate-report/${assignment.id}` })
            } else {
              navigate({ to: `/assignments/edite-report/${assignment.id}` })
            }
          },
          show: true,
          destructive: false
        }
      ],
      // Statuts édités - lecture et documents
      'edited': [
        {
          key: 'edit-report',
          label: 'Modifier la rédaction',
          icon: Edit,
          onClick: () => navigate({ to: `/assignments/edit-report/${assignment.id}` }),
          show: true,
          destructive: false
        },
        {
          key: 'receipts',
          label: assignment.receipts && assignment.receipts.length > 0 ? 'Modifier les quittances' : 'Ajouter une quittance',
          icon: Receipt,
          onClick: () => onOpenReceiptModal(assignment.id, parseFloat(assignment.total_amount || '0')),
          show: true,
          destructive: false
        },
        // {
        //   key: 'download-sheet',
        //   label: 'Télécharger la fiche',
        //   icon: Download,
        //   onClick: () => {
        //     // TODO: Implémenter le téléchargement de la fiche
        //   },
        //   show: true,
        //   destructive: false
        // },
        // {
        //   key: 'download-report',
        //   label: 'Télécharger le rapport',
        //   icon: FileText,
        //   onClick: () => {
        //     // TODO: Implémenter le téléchargement du rapport
        //   },
        //   show: true,
        //   destructive: false
        // },
        // {
        //   key: 'print',
        //   label: 'Imprimer',
        //   icon: Printer,
        //   onClick: () => {
        //     // TODO: Implémenter l'impression
        //   },
        //   show: true,
        //   destructive: false
        // }
      ],
      // Statuts fermés - lecture seule
      'closed': [
        {
          key: 'receipts',
          label: assignment.receipts && assignment.receipts.length > 0 ? 'Modifier les quittances' : 'Ajouter une quittance',
          icon: Receipt,
          onClick: () => onOpenReceiptModal(assignment.id, parseFloat(assignment.total_amount || '0')),
          show: true,
          destructive: false
        },
        // {
        //   key: 'download-sheet',
        //   label: 'Télécharger la fiche',
        //   icon: Download,
        //   onClick: () => {
        //     // TODO: Implémenter le téléchargement de la fiche
        //   },
        //   show: true,
        //   destructive: false
        // },
        // {
        //   key: 'download-report',
        //   label: 'Télécharger le rapport',
        //   icon: FileText,
        //   onClick: () => {
        //     // TODO: Implémenter le téléchargement du rapport
        //   },
        //   show: true,
        //   destructive: false
        // }
      ],
      // Statuts payés - lecture seule
      'paid': [
        {
          key: 'receipts',
          label: assignment.receipts && assignment.receipts.length > 0 ? 'Modifier les quittances' : 'Ajouter une quittance',
          icon: Receipt,
          onClick: () => onOpenReceiptModal(assignment.id, parseFloat(assignment.total_amount || '0')),
          show: true,
          destructive: false
        },
        // {
        //   key: 'download-sheet',
        //   label: 'Télécharger la fiche',
        //   icon: Download,
        //   onClick: () => {
        //     // TODO: Implémenter le téléchargement de la fiche
        //   },
        //   show: true,
        //   destructive: false
        // },
        // {
        //   key: 'download-report',
        //   label: 'Télécharger le rapport',
        //   icon: FileText,
        //   onClick: () => {
        //     // TODO: Implémenter le téléchargement du rapport
        //   },
        //   show: true,
        //   destructive: false
        // }
      ],
      // Statuts annulés - lecture seule
      'cancelled': [
        {
          key: 'download-sheet',
          label: 'Télécharger la fiche',
          icon: Download,
          onClick: () => {
            // TODO: Implémenter le téléchargement de la fiche
          },
          show: true,
          destructive: false
        }
      ]
    }

    return [
      ...baseActions,
      ...(statusActions[statusCode as keyof typeof statusActions] || [])
    ]
  }

  const availableActions = getAvailableActions(assignment.status.code, assignment)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {availableActions.map((action) => {
            const IconComponent = action.icon
            return (
              <DropdownMenuItem
                key={action.key}
                onClick={action.onClick}
                className={action.destructive ? 'text-destructive' : ''}
              >
                <IconComponent className="mr-2 h-4 w-4" />
                {action.label}
              </DropdownMenuItem>
            )
          })}
          
          {/* Séparateur avant les actions de statut */}
          <DropdownMenuSeparator />
          
          {/* Indicateur de statut */}
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {assignment.status.code === 'pending' && <Clock className="h-3 w-3" />}
              {assignment.status.code === 'opened' && <AlertCircle className="h-3 w-3" />}
              {assignment.status.code === 'realized' && <CheckCircle className="h-3 w-3" />}
              {assignment.status.code === 'edited' && <FileText className="h-3 w-3" />}
              {assignment.status.code === 'closed' && <CheckCircle className="h-3 w-3" />}
              {assignment.status.code === 'paid' && <CheckCircle className="h-3 w-3" />}
              {assignment.status.code === 'cancelled' && <AlertCircle className="h-3 w-3" />}
              <span>Statut: {assignment.status.label}</span>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal d'aperçu rapide */}
      <AssignmentPreviewModal
        assignment={assignment}
        open={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
        onViewDetail={onViewDetail}
      />
    </>
  )
} 