import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Wrench, 
  Shield,
  AlertTriangle,
  FileCheck,
  Clock,
  CreditCard,
  Archive,
  XCircle,
  Edit,
  ArrowRight,
  ArrowDown,
  GitBranch,
  RotateCcw,
  User,
  Building2,
  ClipboardCheck,
  FileEdit,
  Receipt,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  AlertCircle,
  Banknote,
  Lock,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

// Types for the workflow
type StepStatus = 'pending' | 'active' | 'completed' | 'warning' | 'error'

interface WorkflowStep {
  id: string
  title: string
  description: string
  actor: 'expert' | 'client' | 'assureur' | 'reparateur'
  status?: StepStatus
  subSteps?: WorkflowStep[]
  branches?: {
    condition: string
    steps: WorkflowStep[]
  }[]
  loop?: {
    condition: string
    backTo: string
  }
}

// Actor configuration
const actors = {
  client: {
    name: 'Client',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-500/30',
    icon: User
  },
  expert: {
    name: 'Expert / Cabinet',
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-500/30',
    icon: Building2
  },
  assureur: {
    name: 'Assureur / Compagnie',
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    bgLight: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-500/30',
    icon: Shield
  },
  reparateur: {
    name: 'Réparateur',
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    bgLight: 'bg-orange-50 dark:bg-orange-950/30',
    borderColor: 'border-orange-500/30',
    icon: Wrench
  }
}

// Mission types
const missionTypes = [
  { id: 'compagnie', name: 'Compagnie', description: 'Mission pour une compagnie d\'assurance' },
  { id: 'particulier', name: 'Particulier', description: 'Mission pour un particulier' },
  { id: 'taxi', name: 'Taxi', description: 'Mission pour un taxi' },
  { id: 'evaluation', name: 'Évaluation', description: 'Mission d\'évaluation' },
  { id: 'contre-expertise', name: 'Contre expertise', description: 'Mission de contre-expertise' }
]

// Workflow Node Component
function WorkflowNode({ 
  step, 
  index, 
  isLast = false,
  indent = 0,
  showConnector = true 
}: { 
  step: { 
    id: string
    title: string 
    description: string
    actor: keyof typeof actors
    icon?: React.ComponentType<{ className?: string }>
    isLoop?: boolean
    loopText?: string
    isBranch?: boolean
    branchLabel?: string
    isValidationSousReserve?: boolean
    isDecision?: boolean
    decisionYes?: string
    decisionNo?: string
  }
  index: number
  isLast?: boolean
  indent?: number
  showConnector?: boolean
}) {
  const actor = actors[step.actor]
  const Icon = step.icon || FileText

  return (
    <div className={`relative ${indent > 0 ? 'ml-8' : ''}`}>
      {/* Connector line */}
      {showConnector && !isLast && (
        <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-border to-border/50" />
      )}
      
      {/* Branch indicator */}
      {step.isBranch && (
        <div className="flex items-center gap-2 mb-2 text-sm">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground font-medium">{step.branchLabel}</span>
        </div>
      )}

      {/* Main node */}
      <div className={`
        relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-300
        ${actor.bgLight} ${actor.borderColor}
        hover:shadow-lg hover:scale-[1.02]
        ${step.isValidationSousReserve ? 'ring-2 ring-amber-500/50' : ''}
      `}>
        {/* Step number */}
        <div className={`
          flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
          ${actor.color} text-white font-bold text-lg shadow-lg
        `}>
          {step.isLoop ? (
            <RotateCcw className="h-6 w-6" />
          ) : step.isDecision ? (
            <GitBranch className="h-6 w-6" />
          ) : (
            <Icon className="h-6 w-6" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-foreground">{step.title}</h4>
            <Badge variant="outline" className={`text-xs ${actor.textColor}`}>
              <actor.icon className="h-3 w-3 mr-1" />
              {actor.name}
            </Badge>
            {step.isValidationSousReserve && (
              <Badge className="bg-amber-500 text-white text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Sous réserve
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
          
          {/* Loop indicator */}
          {step.isLoop && step.loopText && (
            <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
              <RotateCcw className="h-3 w-3" />
              <span>{step.loopText}</span>
            </div>
          )}

          {/* Decision branches */}
          {step.isDecision && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 text-xs p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                <ThumbsUp className="h-3 w-3" />
                <span>{step.decisionYes}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                <ThumbsDown className="h-3 w-3" />
                <span>{step.decisionNo}</span>
              </div>
            </div>
          )}
        </div>

        {/* Step index */}
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shadow-md">
          {index}
        </div>
      </div>
    </div>
  )
}

// Decision Node Component
function DecisionNode({ 
  title, 
  options,
  actor
}: { 
  title: string
  options: { label: string; description: string; type: 'success' | 'warning' | 'continue' }[]
  actor: keyof typeof actors
}) {
  const actorConfig = actors[actor]
  
  return (
    <div className="relative my-4">
      {/* Diamond shape decision */}
      <div className={`
        relative mx-auto w-max p-4 rounded-xl border-2 border-dashed
        ${actorConfig.borderColor} ${actorConfig.bgLight}
      `}>
        <div className="flex items-center gap-2 mb-3">
          <GitBranch className={`h-5 w-5 ${actorConfig.textColor}`} />
          <span className="font-semibold">{title}</span>
        </div>
        <div className="grid gap-2">
          {options.map((option, idx) => (
            <div 
              key={idx}
              className={`
                flex items-center gap-2 p-2 rounded-lg text-sm
                ${option.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : ''}
                ${option.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : ''}
                ${option.type === 'continue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : ''}
              `}
            >
              <ArrowRight className="h-4 w-4" />
              <div>
                <span className="font-medium">{option.label}</span>
                <span className="text-xs ml-2 opacity-75">{option.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Connector Arrow
function ConnectorArrow({ type = 'down', label }: { type?: 'down' | 'loop' | 'branch'; label?: string }) {
  return (
    <div className="flex flex-col items-center py-2">
      {type === 'down' && (
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-4 bg-gradient-to-b from-border to-primary/50" />
          <ArrowDown className="h-4 w-4 text-primary" />
          {label && <span className="text-xs text-muted-foreground mt-1">{label}</span>}
        </div>
      )}
      {type === 'loop' && (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30">
          <RotateCcw className="h-4 w-4 text-amber-600" />
          <span className="text-xs text-amber-600 dark:text-amber-400">{label || 'Retour'}</span>
        </div>
      )}
    </div>
  )
}

// Section Card
function SectionCard({ 
  title, 
  icon: Icon, 
  children,
  collapsible = false,
  defaultOpen = true
}: { 
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card className="overflow-hidden shadow-none border-2">
      <CardHeader 
        className={`bg-muted/50 ${collapsible ? 'cursor-pointer hover:bg-muted/70 transition-colors' : ''}`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <span>{title}</span>
          </div>
          {collapsible && (
            isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
          )}
        </CardTitle>
      </CardHeader>
      {(!collapsible || isOpen) && (
        <CardContent className="pt-6">
          {children}
        </CardContent>
      )}
    </Card>
  )
}

export default function WorkflowPage() {
  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold'>Workflow de Traitement des Dossiers</h1>
        </div>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 p-8 mb-8 border">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              Documentation du Workflow
            </Badge>
            <h1 className="text-3xl font-bold mb-3">
              Workflow de Traitement des Dossiers d'Expertise
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Ce schéma représente le processus complet de traitement d'un dossier d'expertise automobile, 
              depuis la demande initiale jusqu'à la clôture du dossier.
            </p>
          </div>
        </div>

        {/* Actors Legend */}
        <Card className="mb-8 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Acteurs du Workflow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(actors).map(([key, actor]) => (
                <div 
                  key={key} 
                  className={`flex items-center gap-3 p-3 rounded-xl ${actor.bgLight} border ${actor.borderColor}`}
                >
                  <div className={`p-2 rounded-lg ${actor.color}`}>
                    <actor.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">{actor.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-dashed">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Note importante</p>
                  <p className="text-sm text-muted-foreground">
                    L'Expert travaille au sein du Cabinet, leurs actions sont donc considérées comme celles d'un même acteur.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Types */}
        <Card className="mb-8 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Types de Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {missionTypes.map((type) => (
                <div 
                  key={type.id}
                  className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-center border hover:shadow-md"
                >
                  <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <span className="font-medium text-sm">{type.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Workflow Section */}
        <div className="space-y-6">
          {/* Phase 1: Demande */}
          <SectionCard title="Phase 1 : Demande d'Expertise" icon={MessageSquare}>
            <div className="space-y-4">
              <WorkflowNode 
                index={1}
                step={{
                  id: "demande",
                  title: "Demande d'expertise",
                  description: "Le client fait une demande d'expertise. À ce stade, le client ne sélectionne pas de type de mission.",
                  actor: "client",
                  icon: FileText
                }}
              />
              <ConnectorArrow />
              <WorkflowNode 
                index={2}
                step={{
                  id: "reception",
                  title: "Réception et validation de l'ouverture",
                  description: "Le cabinet concerné reçoit la demande, évalue le type de mission approprié et ouvre le dossier.",
                  actor: "expert",
                  icon: ClipboardCheck
                }}
              />
              
              <div className="mt-6 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-700 dark:text-purple-300">Alternative : Ouverture par la Compagnie</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                      Les compagnies d'assurance peuvent aussi ouvrir un dossier pour le compte d'un cabinet. 
                      Dans ce cas, le type de mission est automatiquement "Compagnie".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Phase 2: Ouverture du dossier */}
          <SectionCard title="Phase 2 : Ouverture et Réalisation du Dossier" icon={Edit}>
            <div className="space-y-4">
              <WorkflowNode 
                index={3}
                step={{
                  id: "ouverture",
                  title: "Ouverture du dossier",
                  description: "L'expert peut ouvrir un dossier de tout type de mission de manière indépendante. Il a également la possibilité de modifier le dossier après ouverture.",
                  actor: "expert",
                  icon: FileEdit
                }}
              />
              <ConnectorArrow />
              <WorkflowNode 
                index={4}
                step={{
                  id: "realisation",
                  title: "Réalisation du dossier",
                  description: "L'expert réalise le dossier. Il peut modifier le contenu du dossier ou la réalisation à tout moment.",
                  actor: "expert",
                  icon: Edit,
                  isLoop: true,
                  loopText: "Possibilité de modification"
                }}
              />
              <ConnectorArrow />
              <WorkflowNode 
                index={5}
                step={{
                  id: "fiche-expertise",
                  title: "Rédaction de la fiche d'expertise / Fiche des travaux",
                  description: "L'expert rédige la fiche d'expertise ou la fiche des travaux nécessaires.",
                  actor: "expert",
                  icon: FileText
                }}
              />
            </div>
          </SectionCard>

          {/* Phase 3: Devis */}
          <SectionCard title="Phase 3 : Gestion du Devis" icon={Receipt}>
            <div className="space-y-4">
              <WorkflowNode 
                index={6}
                step={{
                  id: "edition-devis",
                  title: "Édition du devis",
                  description: "Le réparateur établit et soumet le devis pour les travaux de réparation.",
                  actor: "reparateur",
                  icon: Receipt
                }}
              />
              <ConnectorArrow />
              
              {/* Decision point for quote validation */}
              <div className="relative p-6 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 dark:bg-blue-950/20">
                <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                  POINT DE DÉCISION
                </div>
                
                <WorkflowNode 
                  index={7}
                  step={{
                    id: "validation-devis",
                    title: "Validation du devis",
                    description: "L'expert examine le devis et prend une décision de validation.",
                    actor: "expert",
                    icon: ClipboardCheck,
                    isDecision: true,
                    decisionYes: "Validation définitive",
                    decisionNo: "Validation sous réserve"
                  }}
                />

                {/* Options */}
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-700 dark:text-green-400">Validation définitive</span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      Le devis est accepté et le processus continue vers la rédaction du rapport.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <span className="font-semibold text-amber-700 dark:text-amber-400">Validation sous réserve</span>
                    </div>
                    <p className="text-sm text-amber-600 dark:text-amber-500">
                      Le devis est accepté conditionnellement. Une validation définitive sera nécessaire ultérieurement.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-red-700 dark:text-red-400">Refus / Modification</span>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-500">
                      L'expert peut décliner le devis avec un motif. Le processus revient à l'étape d'édition du devis.
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-red-500">
                      <RotateCcw className="h-3 w-3" />
                      <span>Retour à l'étape 6</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Phase 4: Rapport */}
          <SectionCard title="Phase 4 : Rédaction et Validation du Rapport" icon={FileCheck}>
            <div className="space-y-4">
              <WorkflowNode 
                index={8}
                step={{
                  id: "redaction-rapport",
                  title: "Rédaction du rapport",
                  description: "L'expert rédige le rapport d'expertise. Ce rapport peut être rédigé après une validation définitive ou une validation sous réserve du devis.",
                  actor: "expert",
                  icon: FileEdit
                }}
              />
              <ConnectorArrow />

              {/* Branching for validation types */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Branch 1: Validation définitive */}
                <div className="p-5 rounded-2xl bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-700 dark:text-green-400">Cas : Validation définitive du devis</span>
                  </div>
                  
                  <WorkflowNode 
                    index={9}
                    step={{
                      id: "validation-rapport-def",
                      title: "Validation du rapport",
                      description: "L'expert valide la rédaction du rapport. Il peut rejeter et le processus reprend jusqu'à validation.",
                      actor: "expert",
                      icon: ClipboardCheck,
                      isLoop: true,
                      loopText: "Possibilité de rejet et reprise"
                    }}
                  />
                </div>

                {/* Branch 2: Validation sous réserve */}
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Cas : Validation sous réserve</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-300">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Condition requise</span>
                      </div>
                      <p className="text-sm text-amber-600 dark:text-amber-500">
                        Pour valider la réserve du rapport, l'expert doit d'abord <strong>valider définitivement le devis du réparateur</strong>.
                      </p>
                    </div>
                    
                    <WorkflowNode 
                      index={"9b" as any}
                      step={{
                        id: "validation-devis-reserve",
                        title: "Validation définitive du devis",
                        description: "L'expert valide définitivement le devis pour lever la réserve.",
                        actor: "expert",
                        icon: CheckCircle,
                        isValidationSousReserve: true
                      }}
                    />
                  </div>
                </div>
              </div>

              <ConnectorArrow />

              <WorkflowNode 
                index={10}
                step={{
                  id: "validation-reparateur",
                  title: "Validation par le réparateur",
                  description: "Le réparateur doit valider le rapport rédigé par l'expert. Il a la possibilité de rejeter le rapport.",
                  actor: "reparateur",
                  icon: ThumbsUp,
                  isDecision: true,
                  decisionYes: "Accepter le rapport",
                  decisionNo: "Rejeter le rapport"
                }}
              />

              <div className="ml-8 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 inline-flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600 dark:text-red-400">En cas de rejet, retour à l'étape de rédaction du rapport</span>
              </div>
            </div>
          </SectionCard>

          {/* Phase 5: Validation finale */}
          <SectionCard title="Phase 5 : Validation Finale et Clôture" icon={Lock}>
            <div className="space-y-4">
              <WorkflowNode 
                index={11}
                step={{
                  id: "validation-finale",
                  title: "Validation finale et irréversible",
                  description: "L'expert valide de manière finale et irréversible le rapport. Une fois cette étape passée, le dossier est définitivement validé au niveau de la compagnie.",
                  actor: "expert",
                  icon: Lock
                }}
              />

              <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900/30 border-2 border-green-500 flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-400">Dossier validé définitivement</p>
                  <p className="text-sm text-green-600 dark:text-green-500">Le dossier est maintenant validé au niveau de la compagnie</p>
                </div>
              </div>

              <ConnectorArrow />

              <WorkflowNode 
                index={12}
                step={{
                  id: "paiement",
                  title: "Paiement du dossier",
                  description: "Paiement du dossier par la compagnie au cabinet concerné. Le statut passe à 'Payé'.",
                  actor: "assureur",
                  icon: Banknote
                }}
              />

              <div className="p-4 rounded-xl bg-purple-100 dark:bg-purple-900/30 border border-purple-300 flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-700 dark:text-purple-400">Statut : Payé</p>
                  <p className="text-sm text-purple-600 dark:text-purple-500">Le paiement a été effectué par la compagnie</p>
                </div>
              </div>

              <ConnectorArrow />

              <WorkflowNode 
                index={13}
                step={{
                  id: "cloture",
                  title: "Clôture du dossier",
                  description: "Mise à jour manuelle du statut du dossier à 'Clôturé'.",
                  actor: "expert",
                  icon: Archive
                }}
              />

              <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <div>
                  <p className="font-bold text-xl">Dossier Clôturé</p>
                  <p className="text-green-100">Le processus de traitement du dossier est terminé</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Summary Flow Diagram */}
        <Card className="mt-8 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Vue d'ensemble simplifiée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max p-4">
                {[
                  { label: 'Demande', icon: MessageSquare, color: 'bg-emerald-500' },
                  { label: 'Ouverture', icon: FileText, color: 'bg-blue-500' },
                  { label: 'Réalisation', icon: Edit, color: 'bg-blue-500' },
                  { label: 'Devis', icon: Receipt, color: 'bg-orange-500' },
                  { label: 'Validation Devis', icon: ClipboardCheck, color: 'bg-blue-500' },
                  { label: 'Rapport', icon: FileEdit, color: 'bg-blue-500' },
                  { label: 'Validation Réparateur', icon: ThumbsUp, color: 'bg-orange-500' },
                  { label: 'Validation Finale', icon: Lock, color: 'bg-blue-500' },
                  { label: 'Paiement', icon: Banknote, color: 'bg-purple-500' },
                  { label: 'Clôture', icon: Archive, color: 'bg-green-600' }
                ].map((step, idx, arr) => (
                  <div key={idx} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center shadow-lg`}>
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs mt-2 text-center font-medium max-w-16">{step.label}</span>
                    </div>
                    {idx < arr.length - 1 && (
                      <ArrowRight className="h-5 w-5 text-muted-foreground mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend for validation sous reserve */}
            <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-700 dark:text-amber-400">Principe de Validation Sous Réserve</p>
                  <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                    Lors de la validation du devis, l'expert peut opter pour une "validation sous réserve". 
                    Dans ce cas, le processus continue mais l'expert devra ultérieurement valider définitivement 
                    le devis du réparateur avant de pouvoir finaliser le rapport. Cela permet de continuer 
                    le travail tout en gardant une marge pour d'éventuels ajustements.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer spacer */}
        <div className="h-8" />
      </Main>
    </>
  )
}


