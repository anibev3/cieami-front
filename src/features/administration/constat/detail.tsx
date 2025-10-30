import { useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAscertainmentStore } from '@/stores/ascertainments'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { formatDate } from '@/utils/format-date'
import { Label } from '@/components/ui/label'

export default function AscertainmentDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false }) as { id: string }
  const { currentAscertainment, loading, fetchAscertainmentById } = useAscertainmentStore()

  useEffect(() => {
    if (id) {
      fetchAscertainmentById(id)
    }
  }, [id, fetchAscertainmentById])

  const getQualityText = () => {
    if (!currentAscertainment) return 'Non défini'
    if (currentAscertainment.very_good) return 'Très bon'
    if (currentAscertainment.good) return 'Bon'
    if (currentAscertainment.acceptable) return 'Acceptable'
    if (currentAscertainment.less_good) return 'Moins bon'
    if (currentAscertainment.bad) return 'Mauvais'
    if (currentAscertainment.very_bad) return 'Très mauvais'
    return 'Non défini'
  }

  const getQualityBadgeVariant = () => {
    if (!currentAscertainment) return 'outline' as const
    if (currentAscertainment.very_good) return 'default' as const
    if (currentAscertainment.good) return 'secondary' as const
    if (currentAscertainment.acceptable) return 'outline' as const
    if (currentAscertainment.less_good || currentAscertainment.bad || currentAscertainment.very_bad) return 'destructive' as const
    return 'outline' as const
  }

  const getStatusBadgeVariant = (statusCode: string) => {
    switch (statusCode) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (loading) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="container mx-auto py-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Chargement du constat...</p>
              </div>
            </div>
          </div>
        </Main>
      </>
    )
  }

  if (!currentAscertainment) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="container mx-auto py-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Constat non trouvé</h1>
              <p className="text-muted-foreground mb-4">
                Le constat que vous recherchez n'existe pas ou a été supprimé.
              </p>
              <Button onClick={() => navigate({ to: '/administration/constat' })}>
                Retour à la liste
              </Button>
            </div>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="container mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/administration/constat' })}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate({ to: `/administration/constat/edit/${currentAscertainment.id}` })}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate({ to: `/administration/constat/delete/${currentAscertainment.id}` })}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Constat #{currentAscertainment?.id}
            </h1>
            <p className="text-muted-foreground">
              Détails du constat pour l'affectation {currentAscertainment?.assignment?.reference}
            </p>
          </div>

          <div className="grid gap-6">
            {/* Informations de base */}
            <Card className='shadow-none'>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">ID</Label>
                    <p className="text-sm">{currentAscertainment?.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                    <Badge variant={getStatusBadgeVariant(currentAscertainment?.status?.code)} className="mt-1">
                      {currentAscertainment?.status?.label}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Créé le</Label>
                    <p className="text-sm">{formatDate(currentAscertainment?.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Modifié le</Label>
                    <p className="text-sm">{formatDate(currentAscertainment?.updated_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affectation */}
            <Card className='shadow-none'>
              <CardHeader>
                <CardTitle>Affectation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Référence</Label>
                    <p className="text-sm font-mono">{currentAscertainment?.assignment?.reference}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Numéro de police</Label>
                    <p className="text-sm">{currentAscertainment?.assignment?.policy_number}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Numéro de sinistre</Label>
                    <p className="text-sm">{currentAscertainment?.assignment?.claim_number}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Date d'expertise</Label>
                    <p className="text-sm">{formatDate(currentAscertainment?.assignment?.expertise_date)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Lieu d'expertise</Label>
                    <p className="text-sm">{currentAscertainment?.assignment?.expertise_place}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Reçu le</Label>
                    <p className="text-sm">{formatDate(currentAscertainment?.assignment?.received_at)}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Circonstances</Label>
                    <div 
                      className="text-sm mt-1 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: currentAscertainment?.assignment?.circumstance || '' }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Dégâts déclarés</Label>
                    <div 
                      className="text-sm mt-1 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: currentAscertainment?.assignment?.damage_declared || '' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Type de constat */}
            <Card className='shadow-none'>
              <CardHeader>
                <CardTitle>Type de constat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                    <p className="text-sm">{currentAscertainment?.ascertainment_type?.label}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Code</Label>
                    <p className="text-sm font-mono">{currentAscertainment?.ascertainment_type?.code}</p>
                  </div>
                </div>
                {currentAscertainment?.ascertainment_type?.description && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                      <p className="text-sm">{currentAscertainment?.ascertainment_type?.description}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Qualité */}
            <Card className='shadow-none'>
              <CardHeader>
                <CardTitle>Évaluation de la qualité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Qualité générale</Label>
                    <Badge variant={getQualityBadgeVariant()} className="mt-1">
                      {getQualityText()}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Détails</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={currentAscertainment.very_good} disabled />
                        <Label className="text-sm">Très bon</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={currentAscertainment.good} disabled />
                        <Label className="text-sm">Bon</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={currentAscertainment.acceptable} disabled />
                        <Label className="text-sm">Acceptable</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={currentAscertainment.less_good} disabled />
                        <Label className="text-sm">Moins bon</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={currentAscertainment.bad} disabled />
                        <Label className="text-sm">Mauvais</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={currentAscertainment.very_bad} disabled />
                        <Label className="text-sm">Très mauvais</Label>
                      </div>
                    </div>
                  </div>
                </div>

                {currentAscertainment.comment && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Commentaire</Label>
                      <p className="text-sm mt-1">{currentAscertainment.comment}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <a 
                      href={currentAscertainment?.assignment?.expertise_sheet} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Fiche d'expertise
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <a 
                      href={currentAscertainment?.assignment?.expertise_report} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Rapport d'expertise
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <a 
                      href={currentAscertainment?.assignment?.work_sheet} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Fiche de travail
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Utilisateurs */}
            <Card className='shadow-none'>
              <CardHeader>
                <CardTitle>Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Créé par</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <img
                        src={currentAscertainment?.created_by?.photo_url}
                        alt={currentAscertainment?.created_by?.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm">{currentAscertainment?.created_by?.name}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Modifié par</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <img
                          src={currentAscertainment?.updated_by?.photo_url}
                        alt={currentAscertainment?.updated_by?.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm">{currentAscertainment?.updated_by?.name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
} 