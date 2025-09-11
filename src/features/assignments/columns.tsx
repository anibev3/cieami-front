/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { ColumnDef, Row } from '@tanstack/react-table'
import { Assignment } from '@/types/assignments'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, AlertTriangle, Clock, Info, Calendar, TrendingUp, AlertCircle, Check, Copy, Phone, Mail, Search } from 'lucide-react'
import { formatDate } from '@/utils/format-date'
import { AssignmentActions } from './components/assignment-actions'
import { AssignmentStatusEnum } from '@/types/global-types'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface ColumnsProps {
  onDelete: (assignment: Assignment) => void
  onOpenReceiptModal: (assignmentId: number, amount: number) => void
  onViewDetail: (assignmentId: number) => void
  onSearch: (query: string) => void
}

// Fonction utilitaire pour calculer le temps restant
function getTimeLeft(expireAt: string | null) {
  if (!expireAt) return null
  const now = new Date()
  const end = new Date(expireAt)
  const diff = end.getTime() - now.getTime()
  if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  return { expired: false, days, hours, minutes }
}

// Composant Modal pour les détails du délai
function DelayDetailsModal({ 
  isOpen, 
  onClose, 
  label, 
  expireAt, 
  status, 
  percent 
}: {
  isOpen: boolean
  onClose: () => void
  label: string
  expireAt: string | null
  status: string | null
  percent: number | null
}) {
  if (!expireAt) return null

  const timeLeft = getTimeLeft(expireAt)
  if (!timeLeft) return null

  const isExpired = timeLeft.expired
  const isUrgent = timeLeft.expired || (timeLeft.days === 0 && timeLeft.hours < 24)
  const isInProgress = status === 'in_progress'

  const getStatusColor = () => {
    if (isExpired) return 'text-red-600'
    if (isUrgent) return 'text-orange-600'
    if (isInProgress) return 'text-blue-600'
    return 'text-gray-600'
  }

  const getStatusIcon = () => {
    if (isExpired) return <AlertCircle className="h-5 w-5 text-red-600" />
    if (isUrgent) return <AlertTriangle className="h-5 w-5 text-orange-600" />
    if (isInProgress) return <TrendingUp className="h-5 w-5 text-blue-600" />
    return <Clock className="h-5 w-5 text-gray-600" />
  }

  const getStatusText = () => {
    if (isExpired) return 'Expiré'
    if (isUrgent) return 'Urgent'
    if (isInProgress) return 'En cours'
    return 'En attente'
  }

  const getProgressColor = () => {
    if (label === "Rédaction") {
      // Bloquer le pourcentage à 100% pour l'affichage
      const displayPercent = percent !== null ? Math.min(percent, 100) : 0
      if (displayPercent >= 0 && displayPercent <= 50) return 'bg-green-500'
      if (displayPercent > 50 && displayPercent <= 90) return 'bg-yellow-500'
      if (displayPercent > 90) return 'bg-red-500'
    }
    return 'bg-blue-500'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Détails du délai - {label}
          </DialogTitle>
          <DialogDescription>
            Informations détaillées sur la progression et les échéances
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Statut général */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Statut</p>
              <p className={`text-sm ${getStatusColor()}`}>{getStatusText()}</p>
            </div>
            <Badge variant={isExpired ? 'destructive' : isUrgent ? 'secondary' : 'outline'}>
              {isExpired ? 'Expiré' : isUrgent ? 'Urgent' : 'Normal'}
            </Badge>
          </div>

          {/* Progression */}
          {percent !== null && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progression</span>
                <span className="text-sm font-bold">{Math.min(percent, 100)}%</span>
              </div>
              <Progress value={Math.min(percent, 100)} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          )}

          <Separator />

          {/* Délai restant */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Délai restant</span>
            </div>
            
            {isExpired ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">Délai expiré</p>
                <p className="text-sm text-red-600">
                  Le délai a expiré le {formatDate(expireAt)}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{timeLeft.days}</p>
                  <p className="text-xs text-blue-600">Jours</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{timeLeft.hours}</p>
                  <p className="text-xs text-blue-600">Heures</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{timeLeft.minutes}</p>
                  <p className="text-xs text-blue-600">Minutes</p>
                </div>
              </div>
            )}
          </div>

          {/* Date d'expiration */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Date d'expiration</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(expireAt)}
            </p>
          </div>

          {/* Recommandations */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Recommandations</h4>
            {isExpired ? (
              <p className="text-sm text-blue-800">
                Le délai est expiré. Une action immédiate est requise pour éviter les conséquences.
              </p>
            ) : isUrgent ? (
              <p className="text-sm text-blue-800">
                Le délai approche de sa fin. Il est recommandé de finaliser rapidement cette étape.
              </p>
            ) : (
              <p className="text-sm text-blue-800">
                Le délai est dans les normes. Continuez à travailler normalement.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Composant pour afficher les informations du client avec copie et recherche
function ClientInfoDisplay({ client, onSearch }: { 
  client: Assignment['client']
  onSearch: (query: string) => void
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!client) {
    return <div className="text-muted-foreground text-sm">-</div>
  }

  const copyToClipboard = async (text: string | null, field: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success(`${field} copié dans le presse-papiers`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      toast.error('Erreur lors de la copie')
    }
  }

  const handleClick = (text: string | null) => {
    if (text) {
      onSearch(text)
    }
  }

  return (
    <div className="space-y-2">
      {/* Nom du client - cliquable pour la recherche */}
      <div 
        className="font-medium cursor-pointer hover:text-primary hover:underline transition-colors"
        onClick={() => handleClick(client.name)}
        title="Cliquer pour rechercher ce nom"
      >
        {client.name}
      </div>
      
      {/* Informations de contact avec boutons de copie */}
      <div className="space-y-1">
        {client.phone_1 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span 
              className="cursor-pointer hover:text-primary hover:underline transition-colors"
              onClick={() => handleClick(client.phone_1)}
              title="Cliquer pour rechercher ce numéro"
            >
              {client.phone_1}
            </span>
            <button
              onClick={() => copyToClipboard(client.phone_1, 'Numéro 1')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Copier le numéro 1"
            >
              <Copy className={`h-3 w-3 ${copiedField === 'Numéro 1' ? 'text-green-600' : 'text-gray-400'}`} />
            </button>
          </div>
        )}
        
        {/* {client.phone_2 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span 
              className="cursor-pointer hover:text-primary hover:underline transition-colors"
              onClick={() => handleClick(client.phone_2)}
              title="Cliquer pour rechercher ce numéro"
            >
              {client.phone_2}
            </span>
            <button
              onClick={() => copyToClipboard(client.phone_2, 'Numéro 2')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Copier le numéro 2"
            >
              <Copy className={`h-3 w-3 ${copiedField === 'Numéro 2' ? 'text-green-600' : 'text-gray-400'}`} />
            </button>
          </div>
        )}
        
        {client.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span 
              className="cursor-pointer hover:text-primary hover:underline transition-colors"
              onClick={() => handleClick(client.email)}
              title="Cliquer pour rechercher cet email"
            >
              {client.email}
            </span>
            <button
              onClick={() => copyToClipboard(client.email, 'Email')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Copier l'email"
            >
              <Copy className={`h-3 w-3 ${copiedField === 'Email' ? 'text-green-600' : 'text-gray-400'}`} />
            </button>
          </div>
        )} */}
      </div>
    </div>
  )
}

// Composant pour afficher le compte à rebours
function CountdownBadge({ label, expireAt, status, percent }: { 
  label: string
  expireAt: string | null
  status: string | null
  percent: number | null
}) {
  const [showModal, setShowModal] = useState(false)
  
  if (!expireAt) return null
  
  const timeLeft = getTimeLeft(expireAt)
  if (!timeLeft) return null

  const isUrgent = timeLeft.expired || (timeLeft.days === 0 && timeLeft.hours < 24)
  const isInProgress = status === 'in_progress'
  const isDone = status === 'done'

  // Si le statut est "done", afficher "Validé" en vert
  if (isDone) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1">
          <Badge className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300 text-xs">
            <Check className="h-3 w-3" />
            Validé
          </Badge>
        </div>
      </div>
    )
  }

  // Fonction pour déterminer la couleur selon le pourcentage (uniquement pour "Édition")
  const getColorByPercentage = (label: string, percent: number | null) => {
    if (label !== "Rédaction" || percent === null) return null
    
    // Bloquer le pourcentage à 100% pour l'affichage
    const displayPercent = Math.min(percent, 100)
    
    if (displayPercent >= 0 && displayPercent <= 50) {
      return 'green' // Vert pour 0-50%
    } else if (displayPercent > 50 && displayPercent <= 90) {
      return 'warning' // Warning pour 50-90%
    } else if (displayPercent > 90) {
      return 'danger' // Danger pour 90%+
    }
    return null
  }

  const percentageColor = getColorByPercentage(label, percent)
  
  // Calculer le pourcentage d'affichage (bloqué à 100%)
  const displayPercent = percent !== null ? Math.min(percent, 100) : null

  if (timeLeft.expired) {
    return (
      <>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <Badge variant="destructive" className="flex items-center gap-1 bg-red-100 text-red-800 border-red-300 text-xs">
              <AlertTriangle className="h-3 w-3" />
              {label} expiré
            </Badge>
            <button
              onClick={() => setShowModal(true)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Info className="h-3 w-3 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          {percent !== null && (
            <span className="text-xs text-red-600 font-medium">{displayPercent}%</span>
          )}
        </div>
        <DelayDetailsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          label={label}
          expireAt={expireAt}
          status={status}
          percent={percent}
        />
      </>
    )
  }

  // Déterminer la classe CSS selon la couleur du pourcentage
  const getBadgeClassName = () => {
    if (percentageColor === 'green') {
      return 'flex items-center gap-1 bg-green-100 text-green-800 border-green-300 text-xs'
    } else if (percentageColor === 'warning') {
      return 'flex items-center gap-1 bg-yellow-100 text-yellow-800 border-yellow-300 text-xs'
    } else if (percentageColor === 'danger') {
      return 'flex items-center gap-1 bg-red-100 text-red-800 border-red-300 text-xs animate-pulse'
    }
    
    // Couleurs par défaut si pas de couleur spécifique au pourcentage
    if (isUrgent) {
      return 'flex items-center gap-1 bg-red-100 text-red-800 border-red-300 text-xs animate-pulse'
    } else if (isInProgress) {
      return 'flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-300 text-xs'
    } else {
      return 'flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-300 text-xs'
    }
  }

  // Déterminer la couleur du texte du pourcentage
  const getPercentageTextColor = () => {
    if (percentageColor === 'green') {
      return 'text-green-600'
    } else if (percentageColor === 'warning') {
      return 'text-yellow-600'
    } else if (percentageColor === 'danger') {
      return 'text-red-600'
    }
    
    // Couleurs par défaut
    if (isUrgent) {
      return 'text-red-600'
    } else if (isInProgress) {
      return 'text-blue-600'
    } else {
      return 'text-gray-600'
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1">
          <Badge
            variant={isUrgent ? 'destructive' : 'outline'}
            className={getBadgeClassName()}
          >
            {isUrgent && <AlertTriangle className="h-3 w-3" />}
            {!isUrgent && <Clock className="h-3 w-3" />}
            {timeLeft.days > 0 && `${timeLeft.days}j`}
            {timeLeft.days === 0 && timeLeft.hours > 0 && `${timeLeft.hours}h`}
            {timeLeft.days === 0 && timeLeft.hours === 0 && `${timeLeft.minutes}min`}
            {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && '<1min'}
          </Badge>
          <button
            onClick={() => setShowModal(true)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Info className="h-3 w-3 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        {percent !== null && (
          <span className={`text-xs font-medium ${getPercentageTextColor()}`}>
            {displayPercent}%
          </span>
        )}
      </div>
      <DelayDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        label={label}
        expireAt={expireAt}
        status={status}
        percent={percent}
      />
    </>
  )
}

// Fonction pour obtenir la variante de badge selon le statut
function getStatusVariant(statusCode: string) {
  switch (statusCode) {
    case AssignmentStatusEnum.ACTIVE:
      return 'info'
    case AssignmentStatusEnum.OPENED:
      return 'default'
    case AssignmentStatusEnum.REALIZED:
      return 'warning'
    case AssignmentStatusEnum.EDITED:
      return 'outline'
    case AssignmentStatusEnum.VALIDATED:
      return 'secondary'
    case AssignmentStatusEnum.CLOSED:
      return 'success'
    case AssignmentStatusEnum.IN_PAYMENT:
      return 'error'
    case AssignmentStatusEnum.PAID:
      return 'neutral'
    case AssignmentStatusEnum.INACTIVE:
      return 'primary'
    case AssignmentStatusEnum.CANCELLED:
      return 'error-light'
    case AssignmentStatusEnum.DELETED:
      return 'destructive'
    case AssignmentStatusEnum.ARCHIVED:
      return 'secondary'
    case AssignmentStatusEnum.DRAFT:
      return 'outline'
    default:
      return 'outline'
  }
}

export const createColumns = ({ onDelete, onOpenReceiptModal, onViewDetail, onSearch }: ColumnsProps): ColumnDef<Assignment>[] => [

  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
      />
    ),
  },
  {
    accessorKey: 'reference',
    header: 'Référence',
    cell: ({ row }) => {
      const assignment = row.original
      const isEditionDone = assignment.edition_status === 'done'
      const isRecoveryDone = assignment.recovery_status === 'done'
      const isDone = isEditionDone || isRecoveryDone
      
      return (
        <div className={`${isDone ? 'bg-green-50' : ''}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetail(assignment.id)}
              className="flex items-center gap-2 font-medium text-primary hover:text-primary/80 hover:underline transition-colors bg-transparent border-none cursor-pointer text-left"
            >
              {row.getValue('reference')}
              <ExternalLink className="h-3 w-3" />
            </button>
            <button
              onClick={() => onSearch(row.getValue('reference'))}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Cliquer pour rechercher cette référence"
            >
              <Search className="h-3 w-3 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row }) => {
      const client = row.getValue('client') as Assignment['client']
      const assignment = row.original
      const isEditionDone = assignment.edition_status === 'done'
      const isRecoveryDone = assignment.recovery_status === 'done'
      const isDone = isEditionDone || isRecoveryDone
      
      return (
        <div className={isDone ? 'bg-green-50' : ''}>
          <ClientInfoDisplay 
            client={client} 
            onSearch={onSearch}
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'vehicle',
    header: 'Véhicule',
    cell: ({ row }) => {
      const vehicle = row.getValue('vehicle') as Assignment['vehicle']
      const assignment = row.original
      const isEditionDone = assignment.edition_status === 'done'
      const isRecoveryDone = assignment.recovery_status === 'done'
      const isDone = isEditionDone || isRecoveryDone
      
      if (!vehicle) {
        return <div className="text-muted-foreground text-sm">-</div>
      }
      
      return (
        <div className={isDone ? 'bg-green-50' : ''}>
          <div 
            className="font-medium cursor-pointer hover:text-primary hover:underline transition-colors"
            onClick={() => onSearch(vehicle.license_plate)}
            title="Cliquer pour rechercher cette plaque"
          >
            {vehicle.license_plate}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'insurer',
    header: 'Assureur',
    cell: ({ row }) => {
      const insurer = row?.getValue('insurer') as Assignment['insurer']
      const assignment = row?.original || {}
      const isEditionDone = assignment?.edition_status === 'done'
      const isRecoveryDone = assignment?.recovery_status === 'done'
      const isDone = isEditionDone || isRecoveryDone
      
      if (!insurer) {
        return <div className="text-muted-foreground text-sm">-</div>
      }
      
      return (
        <div className={isDone ? 'bg-green-50' : ''}>
          <div 
            className="font-medium cursor-pointer hover:text-primary hover:underline transition-colors text-center"
            onClick={() => onSearch(insurer.name)}
            title="Cliquer pour rechercher cet assureur"
          >
            {insurer.name}
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: 'additional_insurer',
    header: 'Assureur additionnel',
    cell: ({ row }) => {
      const additionalInsurer = row?.getValue('additional_insurer') as Assignment['additional_insurer']
      const assignment = row?.original
      const isEditionDone = assignment?.edition_status === 'done'
      const isRecoveryDone = assignment?.recovery_status === 'done'
      const isDone = isEditionDone || isRecoveryDone
      
      if (!additionalInsurer) {
        return <div className="text-muted-foreground text-sm">-</div>
      }
      
      return (
        <div className={isDone ? 'bg-green-50' : ''}>
          <div 
            className="font-medium cursor-pointer hover:text-primary hover:underline transition-colors text-center"
            onClick={() => onSearch(additionalInsurer?.name || '')}
            title="Cliquer pour rechercher cet assureur additionnel"
          >
            {additionalInsurer?.name || ''}
          </div>
        </div>
      )
    },
  },
  
  {
    accessorKey: 'broker',
    header: 'Courtier',
    cell: ({ row }) => {
      const broker = row?.getValue('broker') as Assignment['broker']
      const assignment = row.original
      const isEditionDone = assignment.edition_status === 'done'
      const isRecoveryDone = assignment.recovery_status === 'done'
      const isDone = isEditionDone || isRecoveryDone
      
      if (!broker) {
        return <div className="text-muted-foreground text-sm">-</div>
      }
      
      return (
        <div className={isDone ? 'bg-green-50' : ''}>
          <div 
            className="font-medium cursor-pointer hover:text-primary hover:underline transition-colors text-center"
            onClick={() => onSearch(broker.name)}
            title="Cliquer pour rechercher ce courtier"
          >
            {broker.name}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'repairer',
    header: 'Reparateur',
    cell: ({ row }) => {
      const repairman = row.getValue('repairer') as Assignment['repairer']
      const assignment = row.original
      const isEditionDone = assignment.edition_status === 'done'
      const isRecoveryDone = assignment.recovery_status === 'done'
      const isDone = isEditionDone || isRecoveryDone
      
      if (!repairman) {
        return <div className="text-muted-foreground text-sm">-</div>
      }
      
      return (
        <div className={isDone ? 'bg-green-50' : ''}>
          <div 
            className="text-sm cursor-pointer hover:text-primary hover:underline transition-colors"
            onClick={() => onSearch(repairman.name)}
            title="Cliquer pour rechercher ce réparateur"
          >
            {repairman.name}
          </div>
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'assignment_type',
  //   header: 'Type',
  //   cell: ({ row }) => {
  //     const assignmentType = row.getValue('assignment_type') as Assignment['assignment_type']
  //     return (
  //       <div className="flex items-center space-x-2">
  //         {/* <FileText className="h-4 w-4 text-muted-foreground" /> */}
  //         <div>
  //           <div className="font-medium">{assignmentType.label}</div>
  //           {/* <div className="text-sm text-muted-foreground">{assignmentType.code}</div> */}
  //         </div>
  //       </div>
  //     )
  //   },
  // },
  {
    accessorKey: 'expertise_type',
    header: 'Type d\'expertise',
    cell: ({ row }) => {
      const expertiseType = row.getValue('expertise_type') as Assignment['expertise_type']
      const assignment = row.original
      const isEditionDone = assignment.edition_status === 'done'
      const isRecoveryDone = assignment.recovery_status === 'done'
      const isDone = isEditionDone || isRecoveryDone
      
      if (!expertiseType) {
        return <div className="text-muted-foreground text-sm">-</div>
      }
      
      return (
        <div 
        // className={isDone ? 'bg-green-50' : ''}
        >
          <div className="font-medium">{expertiseType.label}</div>
          {/* <div className="text-sm text-muted-foreground">{expertiseType.code}</div> */}
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'total_amount',
  //   header: 'Montant total',
  //   cell: ({ row }) => {
  //     const totalAmount = row.getValue('total_amount') as number
  //     return (
  //       <div className="flex items-center space-x-2">
  //         {/* <DollarSign className="h-4 w-4 text-green-600" /> */}
  //         <div className="font-medium text-green-600">
  //           {formatCurrency(totalAmount || 0)}
  //         </div>
  //       </div>
  //     )
  //   },
  // },
  // {
  //   accessorKey: 'shock_amount',
  //   header: 'Montant choc',
  //   cell: ({ row }) => {
  //     const shockAmount = row.getValue('shock_amount') as number
  //     return (
  //       <div className="font-medium text-blue-600">
  //         {formatCurrency(shockAmount || 0)}
  //       </div>
  //     )
  //   },
  // },
  // {
  //   accessorKey: 'other_cost_amount',
  //   header: 'Autres coûts',
  //   cell: ({ row }) => {
  //     const otherCostAmount = row.getValue('other_cost_amount') as number
  //     return (
  //       <div className="font-medium text-orange-600">
  //         {formatCurrency(otherCostAmount || 0)}
  //       </div>
  //     )
  //   },
  // },
  // {
  //   accessorKey: 'receipt_amount',
  //   header: 'Quittances',
  //   cell: ({ row }) => {
  //     const assignment = row.original
  //     return (
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         onClick={() => onOpenReceiptModal(assignment.id, parseFloat(assignment.total_amount || '0'))}
  //         className="flex items-center space-x-2"
  //       >
  //         {/* <Receipt className="h-4 w-4" /> */}
  //         <span>{ assignment.receipts.length } (qtce{ assignment.receipts.length > 1 ? 's' : '' })</span>
  //       </Button>
  //     )
  //   },
  // },




  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.getValue('status') as Assignment['status']
      const assignment = row.original
      const isEditionDone = assignment.edition_status === 'done'
      const isRecoveryDone = assignment.recovery_status === 'done'
      const isDone = isEditionDone || isRecoveryDone
      
      if (!status) {
        return <div className="text-muted-foreground text-sm">-</div>
      }
      
      return (
        <div 
        // className={isDone ? 'bg-green-50' : ''}
        >
          <Badge variant={getStatusVariant(status.code)}>
            {status.label}
          </Badge>
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'expertise_date',
  //   header: 'Date expertise',
  //   cell: ({ row }) => {
  //     const expertiseDate = row.getValue('expertise_date') as string
  //     const assignment = row.original
  //     const isEditionDone = assignment.edition_status === 'done'
  //     const isRecoveryDone = assignment.recovery_status === 'done'
  //     const isDone = isEditionDone || isRecoveryDone
      
  //     return (
  //       <div className={`flex items-center space-x-2`}>
  //         {/* <Calendar className="h-4 w-4 text-muted-foreground" /> */}
  //         <div className="text-sm text-muted-foreground">
  //           {expertiseDate ? formatDate(expertiseDate) : 'Non définie'}
  //         </div>
  //       </div>
  //     )
  //   },
  // },
  {
    accessorKey: 'created_at',
    header: 'Créé le',
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {formatDate(row.getValue('created_at'))}
        </div>
      )
    },
  },
  {
    accessorKey: 'created_by',
    header: 'Créé par',
    cell: ({ row }) => {
      const createdBy = row.getValue('created_by') as Assignment['created_by']
      
      if (!createdBy) {
        return <div className="text-muted-foreground text-sm">-</div>
      }
      
      return (
        <div className="text-sm text-muted-foreground">
          {createdBy.name}
        </div>
      )
    },
  },
  {
    accessorKey: 'edition_countdown',
    header: 'Délai d\'édition',
    cell: ({ row }) => {
      const assignment = row.original
      const isEditionDone = assignment.edition_status === 'done'
      const isRecoveryDone = assignment.recovery_status === 'done'
      const isDone = isEditionDone || isRecoveryDone
      
      return (
        <div 
        // className={isDone ? 'bg-green-50' : ''}
        >
          <CountdownBadge
            label="Rédaction"
            expireAt={assignment.edition_time_expire_at}
            status={assignment.edition_status}
            percent={assignment.edition_per_cent}
          />
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'recovery_countdown',
  //   header: 'Délai de recouvrement',
  //   cell: ({ row }) => {
  //     const assignment = row.original
  //     const isEditionDone = assignment.edition_status === 'done'
  //     const isRecoveryDone = assignment.recovery_status === 'done'
  //     const isDone = isEditionDone || isRecoveryDone
      
  //     return (
  //       isDone ? (
  //       <div 
  //       // className={isDone ? 'bg-green-50' : ''}
  //       >
  //         {/* <CountdownBadge
  //           label="Récupération"
  //           expireAt={assignment.recovery_time_expire_at}
  //           status={assignment.recovery_status}
  //           percent={assignment.recovery_per_cent}
  //         /> */}
  //       </div>
  //       ) : (
  //         <div>
  //           <CountdownBadge
  //             label="Récupération"
  //             expireAt={assignment.recovery_time_expire_at}
  //             status={assignment.recovery_status}
  //             percent={assignment.recovery_per_cent}
  //           />
  //         </div>
  //       )
  //     )
  //   },
  // },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const assignment = row.original
      const isEditionDone = assignment.edition_status === 'done'
      const isRecoveryDone = assignment.recovery_status === 'done'
      const isDone = isEditionDone || isRecoveryDone

      return (
        <div 
        // className={isDone ? 'bg-green-50' : ''}
        >
          <AssignmentActions
            assignment={assignment}
            onDelete={onDelete}
            onOpenReceiptModal={onOpenReceiptModal}
            onViewDetail={onViewDetail}
          />
        </div>
      )
    },
  },
] 