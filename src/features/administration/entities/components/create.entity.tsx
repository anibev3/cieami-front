import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import axiosInstance from '@/lib/axios'
import { useEntityTypesStore } from '@/stores/entityTypesStore'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { API_CONFIG } from '@/config/api'
import { entityService } from '@/services/entityService'
import { Loader2, Building2, Mail, Phone, MapPin, Hash, Image as ImageIcon, X, Upload, FileText } from 'lucide-react'

export function EntityCreatePage() {
  const navigate = useNavigate()
  const params = useParams({ strict: false }) as { id?: string }
  const { entityTypes, fetchEntityTypes } = useEntityTypesStore()
  
  const isEditMode = Boolean(params?.id)
  const entityId = params?.id || null

  const [form, setForm] = useState({
    code: '',
    name: '',
    email: '',
    telephone: '',
    address: '',
    entity_type_code: '',
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Gérer la prévisualisation du logo
  useEffect(() => {
    if (photoFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(photoFile)
    } else {
      setPreviewUrl(null)
    }
  }, [photoFile])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setPhotoFile(file)
  }

  const handleRemoveLogo = () => {
    setPhotoFile(null)
    setPreviewUrl(null)
    // Réinitialiser l'input file
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  // Charger les types d'entités
  useEffect(() => {
    fetchEntityTypes()
  }, [fetchEntityTypes])

  // Charger l'entité si on est en mode édition
  useEffect(() => {
      const loadEntity = async () => {
        if (!isEditMode || !entityId) {
          setInitialized(true)
          return
        }
        
        try {
          setLoading(true)
          const loadedEntity = await entityService.getById(entityId)
        
        // Pré-remplir tous les champs du formulaire
        setForm({
          code: loadedEntity.code || '',
          name: loadedEntity.name || '',
          email: loadedEntity.email || '',
          telephone: loadedEntity.telephone || '',
          address: loadedEntity.address || '',
          // entity_type_code peut venir de la réponse directement ou depuis entity_type
          entity_type_code: loadedEntity.entity_type_code || loadedEntity.entity_type?.code || '',
        })
        
        // Si l'entité a un logo, on peut l'afficher
        if (loadedEntity.logo) {
          setExistingPhotoUrl(loadedEntity.logo)
        }
        
        setInitialized(true)
      } catch (_error) {
        toast.error('Erreur lors du chargement de l\'entité')
        navigate({ to: '/administration/entities' })
      } finally {
        setLoading(false)
      }
    }
    
    loadEntity()
  }, [isEditMode, entityId, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.entity_type_code) {
      toast.error("Veuillez sélectionner un type d'entité")
      return
    }
    try {
      setSubmitting(true)
      const fd = new FormData()
      fd.append('code', form.code)
      fd.append('name', form.name)
      fd.append('email', form.email)
      if (form.telephone) fd.append('telephone', form.telephone)
      if (form.address) fd.append('address', form.address)
      fd.append('entity_type_code', form.entity_type_code)
      if (photoFile && photoFile instanceof File) {
        fd.append('logo', photoFile)
      }

      if (isEditMode && entityId) {
        await axiosInstance.post(`${API_CONFIG.ENDPOINTS.ENTITIES}/${entityId}`, fd)
        toast.success('Entité modifiée avec succès')
      } else {
        await axiosInstance.post(API_CONFIG.ENDPOINTS.ENTITIES, fd)
        toast.success('Entité créée avec succès')
      }
      navigate({ to: '/administration/entities' })
    } catch (_e) {
      toast.error(isEditMode ? 'Erreur lors de la modification de l\'entité' : 'Erreur lors de la création de l\'entité')
    } finally {
      setSubmitting(false)
    }
  }

  // Afficher le loader pendant le chargement des données en mode édition
  if (loading || (isEditMode && !initialized)) {
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
          <div className="p-6 max-w-2xl mx-auto">
            <Card className="shadow-none">
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
                <span className="ml-2 text-gray-600">Chargement de l'entité...</span>
              </CardContent>
            </Card>
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
        <div className="p-6 mx-auto">
          <Card className="shadow-none">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{isEditMode ? 'Modifier l\'entité' : 'Créer une nouvelle entité'}</CardTitle>
                  <CardDescription className="mt-1">
                    {isEditMode 
                      ? 'Modifiez les informations de l\'entité existante' 
                      : 'Remplissez les informations pour créer une nouvelle entité dans le système'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Colonne gauche - Informations principales */}
                  <div className="space-y-6">
                    {/* Section Informations de base */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Informations de base</h3>
                      </div>
                      <Separator />
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="code" className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            Code <span className="text-destructive">*</span>
                          </Label>
                          <Input 
                            id="code"
                            value={form.code} 
                            onChange={e => setForm({ ...form, code: e.target.value })} 
                            required 
                            disabled={isEditMode}
                            placeholder="Ex: ENT001"
                            className={isEditMode ? 'bg-muted cursor-not-allowed' : ''}
                          />
                          {isEditMode && (
                            <p className="text-xs text-muted-foreground">Le code ne peut pas être modifié après la création</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            Nom <span className="text-destructive">*</span>
                          </Label>
                          <Input 
                            id="name"
                            value={form.name} 
                            onChange={e => setForm({ ...form, name: e.target.value })} 
                            required 
                            placeholder="Nom de l'entité"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="entity_type" className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            Type d'entité <span className="text-destructive">*</span>
                          </Label>
                          <Select value={form.entity_type_code} onValueChange={val => setForm({ ...form, entity_type_code: val })}>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder="Sélectionner un type d'entité" />
                            </SelectTrigger>
                            <SelectContent>
                              {(entityTypes || []).filter(t => t.code && t.code.trim() !== '').map(t => (
                                <SelectItem key={t.id} value={t.code}>{t.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">Sélectionnez le type d'entité parmi les options disponibles</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Section Contact */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Informations de contact</h3>
                      </div>
                      <Separator />

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            Email <span className="text-destructive">*</span>
                          </Label>
                          <Input 
                            id="email"
                            type="email" 
                            value={form.email} 
                            onChange={e => setForm({ ...form, email: e.target.value })} 
                            required 
                            placeholder="contact@exemple.com"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="telephone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            Téléphone
                          </Label>
                          <Input 
                            id="telephone"
                            type="tel"
                            value={form.telephone} 
                            onChange={e => setForm({ ...form, telephone: e.target.value })} 
                            placeholder="+33 1 23 45 67 89"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            Adresse
                          </Label>
                          <Input 
                            id="address"
                            value={form.address} 
                            onChange={e => setForm({ ...form, address: e.target.value })} 
                            placeholder="123 Rue Exemple, 75000 Paris"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colonne droite - Logo */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Logo</h3>
                      </div>
                      <Separator />

                      <div className="space-y-4">
                        {/* Logo existant ou prévisualisation */}
                        {(existingPhotoUrl || previewUrl) && (
                          <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-muted/50">
                            <div className="relative">
                              <img 
                                src={previewUrl || existingPhotoUrl || ''} 
                                alt="Logo" 
                                className="h-32 object-cover rounded-lg border-2 border-border shadow-md" 
                              />
                              {previewUrl && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-7 w-7 rounded-full"
                                  onClick={handleRemoveLogo}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                {previewUrl ? 'Nouveau logo' : 'Logo actuel'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                                {previewUrl 
                                  ? 'Le nouveau logo remplacera l\'ancien lors de l\'enregistrement'
                                  : isEditMode 
                                    ? 'Uploadez un nouveau fichier pour remplacer le logo actuel'
                                    : 'Logo de l\'entité'}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="logo-upload" className="flex items-center gap-2">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            {existingPhotoUrl || previewUrl ? 'Remplacer le logo' : 'Ajouter un logo'}
                          </Label>
                          <Input 
                            id="logo-upload"
                            type="file" 
                            accept="image/*" 
                            onChange={handleLogoChange}
                            className="cursor-pointer"
                          />
                          <p className="text-xs text-muted-foreground">
                            Formats acceptés : JPG, PNG, GIF.<br />
                            Taille recommandée : 200x200px.
                            {isEditMode && !previewUrl && <><br />Laissez vide pour conserver le logo actuel.</>}
                          </p>
                        </div>

                        {!existingPhotoUrl && !previewUrl && (
                          <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/30">
                            <div className="text-center">
                              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Aucun logo sélectionné</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate({ to: '/administration/entities' })}
                    className="min-w-[100px]"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="min-w-[120px]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditMode ? 'Modification...' : 'Création...'}
                      </>
                    ) : (
                      <>
                        {isEditMode ? 'Modifier' : 'Créer'} l'entité
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}