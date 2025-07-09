
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Calendar, 
  Clock, 
  Code, 
  GitBranch, 
  Info, 
  Package, 
  Settings, 
  Star, 
  Zap 
} from "lucide-react"

// Types pour les données de versioning
interface Feature {
  id: string
  title: string
  description: string
  category: 'feature' | 'improvement' | 'bugfix' | 'security'
  status: 'completed' | 'in-progress' | 'planned'
  priority: 'high' | 'medium' | 'low'
  assignee?: string
  tags: string[]
  usage?: string
  breaking?: boolean
}

interface Version {
  version: string
  date: string
  title: string
  description: string
  features: Feature[]
  breakingChanges?: string[]
  migrationGuide?: string
  releaseNotes?: string
}

// Données de versioning (à remplacer par des données réelles)
const versionData: Version[] = [
  {
    version: "2.1.0",
    date: "2024-01-15",
    title: "Système de Gestion Avancé",
    description: "Nouvelle version avec des améliorations majeures du système de gestion et de nouvelles fonctionnalités d'expertise.",
    features: [
      {
        id: "1",
        title: "Gestion des Assignations Avancée",
        description: "Nouveau système de gestion des assignations avec workflow personnalisable et notifications automatiques.",
        category: "feature",
        status: "completed",
        priority: "high",
        assignee: "Équipe Développement",
        tags: ["assignations", "workflow", "notifications"],
        usage: "Accédez à la section Assignations > Nouvelle Assignation pour créer des assignations avec le nouveau workflow.",
        breaking: false
      },
      {
        id: "2",
        title: "Tableau de Bord Analytique",
        description: "Tableau de bord avec graphiques et statistiques en temps réel pour le suivi des performances.",
        category: "improvement",
        status: "completed",
        priority: "medium",
        assignee: "Équipe Analytics",
        tags: ["dashboard", "analytics", "statistiques"],
        usage: "Le nouveau tableau de bord est accessible depuis la page d'accueil avec des métriques détaillées.",
        breaking: false
      },
      {
        id: "3",
        title: "Système de Documents Multi-format",
        description: "Support pour l'upload et la gestion de documents dans différents formats (PDF, DOC, XLS).",
        category: "feature",
        status: "completed",
        priority: "high",
        assignee: "Équipe Backend",
        tags: ["documents", "upload", "multi-format"],
        usage: "Dans la section Documents, vous pouvez maintenant uploader des fichiers PDF, DOC, et XLS.",
        breaking: false
      }
    ],
    breakingChanges: [
      "Modification de l'API des assignations - les anciens endpoints ne sont plus supportés",
      "Nouvelle structure de base de données pour les documents"
    ],
    migrationGuide: "Consultez la documentation technique pour les détails de migration.",
    releaseNotes: "Cette version apporte des améliorations significatives en termes de performance et d'expérience utilisateur."
  },
]

function UpdateFeature() {

  const getCategoryIcon = (category: Feature['category']) => {
    switch (category) {
      case 'feature': return <Zap className="h-4 w-4" />
      case 'improvement': return <Star className="h-4 w-4" />
      case 'bugfix': return <Code className="h-4 w-4" />
      case 'security': return <Settings className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: Feature['category']) => {
    switch (category) {
      case 'feature': return 'bg-blue-500'
      case 'improvement': return 'bg-green-500'
      case 'bugfix': return 'bg-orange-500'
      case 'security': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: Feature['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'planned': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Feature['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mise à jour</h1>
          <p className="text-muted-foreground">
            Suivi des versions et fonctionnalités de l'application
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            Version actuelle: 2.1.0
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline des Versions</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          <ScrollArea className="h-[600px]">
            <div className="relative pr-6">
              {/* Timeline verticale */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
              
              {versionData.map((version, _index) => (
              <div key={version.version} className="relative flex items-start gap-6 mb-8">
                {/* Point de timeline */}
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground">
                  <Package className="h-6 w-6" />
                </div>

                {/* Contenu de la version */}
                <Card className="flex-1 shadow-none">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {version.title}
                          <Badge variant="secondary">{version.version}</Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(version.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              Version {version.version} - {version.title}
                            </DialogTitle>
                            <DialogDescription>
                              {version.description}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Fonctionnalités */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Fonctionnalités</h3>
                              <div className="space-y-3">
                                {version.features.map((feature) => (
                                  <Card key={feature.id} className="shadow-none">
                                    <CardContent className="pt-4">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2">
                                            <div className={`p-1 rounded ${getCategoryColor(feature.category)}`}>
                                              {getCategoryIcon(feature.category)}
                                            </div>
                                            <h4 className="font-medium">{feature.title}</h4>
                                            <Badge className={getStatusColor(feature.status)}>
                                              {feature.status}
                                            </Badge>
                                            <Badge className={getPriorityColor(feature.priority)}>
                                              {feature.priority}
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-muted-foreground mb-3">
                                            {feature.description}
                                          </p>
                                          {feature.usage && (
                                            <div className="bg-muted p-3 rounded-lg">
                                              <h5 className="font-medium text-sm mb-1">Comment utiliser :</h5>
                                              <p className="text-sm">{feature.usage}</p>
                                            </div>
                                          )}
                                          <div className="flex flex-wrap gap-1 mt-3">
                                            {feature.tags.map((tag) => (
                                              <Badge key={tag} variant="outline" className="text-xs">
                                                {tag}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>

                            {/* Breaking Changes */}
                            {version.breakingChanges && version.breakingChanges.length > 0 && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3 text-red-600">Changements Breaking</h3>
                                <Alert>
                                  <AlertDescription>
                                    <ul className="list-disc list-inside space-y-1">
                                      {version.breakingChanges.map((change, idx) => (
                                        <li key={idx}>{change}</li>
                                      ))}
                                    </ul>
                                  </AlertDescription>
                                </Alert>
                              </div>
                            )}

                            {/* Migration Guide */}
                            {version.migrationGuide && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Guide de Migration</h3>
                                <Card className="shadow-none">
                                  <CardContent className="pt-4">
                                    <p className="text-sm">{version.migrationGuide}</p>
                                  </CardContent>
                                </Card>
                              </div>
                            )}

                            {/* Release Notes */}
                            {version.releaseNotes && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Notes de Version</h3>
                                <Card className="shadow-none">
                                  <CardContent className="pt-4">
                                    <p className="text-sm">{version.releaseNotes}</p>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {version.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {version.features.length}
                        </div>
                        <div className="text-xs text-muted-foreground">Fonctionnalités</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {version.features.filter(f => f.status === 'completed').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Terminées</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {version.breakingChanges?.length || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Breaking Changes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Toutes les Fonctionnalités</CardTitle>
              <CardDescription>
                Vue d'ensemble de toutes les fonctionnalités par catégorie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-6">
                  {['feature', 'improvement', 'bugfix', 'security'].map((category) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-3 capitalize flex items-center gap-2">
                        <div className={`p-1 rounded ${getCategoryColor(category as Feature['category'])}`}>
                          {getCategoryIcon(category as Feature['category'])}
                        </div>
                        {category === 'feature' ? 'Nouvelles Fonctionnalités' : 
                         category === 'improvement' ? 'Améliorations' :
                         category === 'bugfix' ? 'Corrections de Bugs' : 'Sécurité'}
                      </h3>
                      <div className="grid gap-3">
                        {versionData.flatMap(v => v.features)
                          .filter(f => f.category === category)
                          .map((feature) => (
                            <Card key={feature.id} className="border-l-4 border-l-primary">
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-medium">{feature.title}</h4>
                                      <Badge className={getStatusColor(feature.status)}>
                                        {feature.status}
                                      </Badge>
                                      <Badge className={getPriorityColor(feature.priority)}>
                                        {feature.priority}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {feature.description}
                                    </p>
                                    {feature.assignee && (
                                      <p className="text-xs text-muted-foreground">
                                        Assigné à: {feature.assignee}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Roadmap Future</CardTitle>
              <CardDescription>
                Planification des prochaines fonctionnalités et améliorations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Q1 2024
                    </h3>
                    <div className="space-y-3">
                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <h4 className="font-medium">API REST Complète</h4>
                          <p className="text-sm text-muted-foreground">
                            Développement d'une API REST complète pour l'intégration avec d'autres systèmes
                          </p>
                          <Badge className="mt-2" variant="outline">En cours</Badge>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <h4 className="font-medium">Notifications Push</h4>
                          <p className="text-sm text-muted-foreground">
                            Système de notifications push en temps réel
                          </p>
                          <Badge className="mt-2" variant="outline">Planifié</Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      Q2 2024
                    </h3>
                    <div className="space-y-3">
                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="pt-4">
                          <h4 className="font-medium">Application Mobile</h4>
                          <p className="text-sm text-muted-foreground">
                            Développement d'une application mobile native
                          </p>
                          <Badge className="mt-2" variant="outline">Planifié</Badge>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="pt-4">
                          <h4 className="font-medium">Intelligence Artificielle</h4>
                          <p className="text-sm text-muted-foreground">
                            Intégration d'IA pour l'analyse automatique des documents
                          </p>
                          <Badge className="mt-2" variant="outline">Planifié</Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Star className="h-5 w-5 text-purple-500" />
                      Q3 2024
                    </h3>
                    <div className="space-y-3">
                      <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-4">
                          <h4 className="font-medium">Marketplace</h4>
                          <p className="text-sm text-muted-foreground">
                            Plateforme de marketplace pour les services d'expertise
                          </p>
                          <Badge className="mt-2" variant="outline">En réflexion</Badge>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-4">
                          <h4 className="font-medium">Blockchain</h4>
                          <p className="text-sm text-muted-foreground">
                            Intégration blockchain pour la certification des documents
                          </p>
                          <Badge className="mt-2" variant="outline">En réflexion</Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UpdateFeature