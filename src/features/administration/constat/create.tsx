/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAscertainmentStore } from '@/stores/ascertainments'
import { useAscertainmentTypeStore } from '@/stores/ascertainmentTypes'
import { CreateAscertainmentData } from '@/services/ascertainmentService'
import { AssignmentSelect } from '@/features/widgets/AssignmentSelect'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Star,
  StarOff,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function CreateAscertainmentPageContent() {
  const navigate = useNavigate()
  const { createAscertainment, loading } = useAscertainmentStore()
  const { ascertainmentTypes, fetchAscertainmentTypes } = useAscertainmentTypeStore()
  
  const [formData, setFormData] = useState<CreateAscertainmentData>({
    assignment_id: '',
    ascertainments: [{
      ascertainment_type_id: '',
      very_good: false,
      good: false,
      acceptable: false,
      less_good: false,
      bad: false,
      very_bad: false,
      comment: ''
    }]
  })

  useEffect(() => {
    if (ascertainmentTypes.length === 0) {
      fetchAscertainmentTypes()
    }
  }, [ascertainmentTypes.length, fetchAscertainmentTypes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.assignment_id.trim()) {
      toast.error('Veuillez sélectionner un dossier')
      return
    }

    if (formData.ascertainments.some(a => !a.ascertainment_type_id)) {
      toast.error('Tous les types de constat doivent être sélectionnés')
      return
    }

    if (formData.ascertainments.some(a => !a.comment.trim())) {
      toast.error('Les commentaires des constats doivent être remplis')
      return
    }

    const success = await createAscertainment(formData)
    if (success) {
      toast.success('Constat créé avec succès')
      navigate({ to: '/administration/constat' })
    }
  }

  const updateAscertainment = (index: number, field: string, value: any) => {
    const newAscertainments = [...formData.ascertainments]
    newAscertainments[index] = { ...newAscertainments[index], [field]: value }
    setFormData({ ...formData, ascertainments: newAscertainments })
  }

  const addAscertainment = () => {
    setFormData({
      ...formData,
      ascertainments: [...formData.ascertainments, {
        ascertainment_type_id: '',
        very_good: false,
        good: false,
        acceptable: false,
        less_good: false,
        bad: false,
        very_bad: false,
        comment: ''
      }]
    })
  }

  const removeAscertainment = (index: number) => {
    if (formData.ascertainments.length > 1) {
      const newAscertainments = formData.ascertainments.filter((_, i) => i !== index)
      setFormData({ ...formData, ascertainments: newAscertainments })
    }
  }

  const getQualityScore = (ascertainment: any) => {
    if (ascertainment.very_good) return 6
    if (ascertainment.good) return 5
    if (ascertainment.acceptable) return 4
    if (ascertainment.less_good) return 3
    if (ascertainment.bad) return 2
    if (ascertainment.very_bad) return 1
    return 0
  }

  const getQualityColor = (score: number) => {
    if (score >= 5) return 'text-green-600 bg-green-50'
    if (score >= 4) return 'text-blue-600 bg-blue-50'
    if (score >= 3) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getQualityLabel = (score: number) => {
    if (score >= 5) return 'Excellent'
    if (score >= 4) return 'Bon'
    if (score >= 3) return 'Moyen'
    return 'Faible'
  }

  const handleCheckboxChange = (index: number, field: string) => {
    const newAscertainments = formData.ascertainments.map((asc, i) => {
      if (i === index) {
        return {
          ...asc,
          very_good: false,
          good: false,
          acceptable: false,
          less_good: false,
          bad: false,
          very_bad: false,
          [field]: true,
        }
      }
      return asc
    })
    setFormData({ ...formData, ascertainments: newAscertainments })
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
          {/* Header avec navigation et titre */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/administration/constat' })}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la liste
                </Button>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Nouveau constat</span>
                </div>
              </div>
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                En cours de création
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Créer un constat d'expertise
              </h1>
              {/* <p className="text-muted-foreground text-lg">
                Évaluez et documentez l'état d'un véhicule avec précision
              </p> */}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Sélection du dossier */}
                <Card className="border-2 border-dashed border-black-200 hover:border-blue-300 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Sélection du dossier</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Choisissez le dossier d'affectation concerné
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label className="text-sm font-medium">Dossier d'affectation *</Label>
                        <AssignmentSelect
                          value={formData.assignment_id}
                          onValueChange={(value) => setFormData({ ...formData, assignment_id: value })}
                          placeholder="Sélectionner un dossier d'affectation..."
                        />
                      </div>
                      {/* {formData.assignment_id && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-700">Dossier sélectionné</span>
                          </div>
                        </div>
                      )} */}
                    </div>
                  </CardContent>
                </Card>

                {/* Constats */}
                <div>
                  <div>
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center space-x-2 ">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Star className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Évaluations de constat</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Définissez les types et qualités des constats
                          </p>
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={addAscertainment}
                        className="hover:bg-purple-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un constat
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-8">
                      {formData.ascertainments.map((ascertainment, index) => {
                        const qualityScore = getQualityScore(ascertainment)
                        return (
                          <div key={index} className="relative">
                            <div className="absolute -top-3 left-4 bg-white px-2">
                              <Badge variant="secondary" className="text-xs">
                                Constat {index + 1}
                              </Badge>
                            </div>
                            
                            <Card className="border-2 hover:border-purple-200 transition-colors">
                              <CardContent className="pt-6">
                                <div className="space-y-6">
                                  {/* Type de constat */}
                                  <div className="grid gap-2">
                                    <Label className="text-sm font-medium flex items-center space-x-2">
                                      <span>Type de constat</span>
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                      value={ascertainment.ascertainment_type_id}
                                      onValueChange={(value) => updateAscertainment(index, 'ascertainment_type_id', value)}
                                    >
                                      <SelectTrigger className="hover:bg-gray-50 w-full">
                                        <SelectValue placeholder="Sélectionner un type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {ascertainmentTypes.map((type) => (
                                          <SelectItem key={type.id} value={type.id.toString()}>
                                            <div className="flex items-center space-x-2">
                                              <span>{type.label}</span>
                                              <Badge variant="outline" className="text-xs">
                                                {type.code}
                                              </Badge>
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Qualité */}
                                  <div className="space-y-3">
                                    <Label className="text-sm font-medium">Évaluation de la qualité</Label>
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                      <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                          <Checkbox
                                            id={`very_good_${index}`}
                                            checked={ascertainment.very_good}
                                            onCheckedChange={() => handleCheckboxChange(index, 'very_good')}
                                          />
                                          <Label htmlFor={`very_good_${index}`} className="flex items-center space-x-2 cursor-pointer">
                                            <Star className="h-4 w-4 text-green-600" />
                                            <span>Très bon</span>
                                          </Label>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          <Checkbox
                                            id={`good_${index}`}
                                            checked={ascertainment.good}
                                            onCheckedChange={() => handleCheckboxChange(index, 'good')}
                                          />
                                          <Label htmlFor={`good_${index}`} className="flex items-center space-x-2 cursor-pointer">
                                            <Star className="h-4 w-4 text-blue-600" />
                                            <span>Bon</span>
                                          </Label>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          <Checkbox
                                            id={`acceptable_${index}`}
                                            checked={ascertainment.acceptable}
                                            onCheckedChange={() => handleCheckboxChange(index, 'acceptable')}
                                          />
                                          <Label htmlFor={`acceptable_${index}`} className="flex items-center space-x-2 cursor-pointer">
                                            <Star className="h-4 w-4 text-yellow-600" />
                                            <span>Acceptable</span>
                                          </Label>
                                        </div>
                                      </div>
                                      <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                          <Checkbox
                                            id={`less_good_${index}`}
                                            checked={ascertainment.less_good}
                                            onCheckedChange={() => handleCheckboxChange(index, 'less_good')}
                                          />
                                          <Label htmlFor={`less_good_${index}`} className="flex items-center space-x-2 cursor-pointer">
                                            <StarOff className="h-4 w-4 text-orange-600" />
                                            <span>Moins bon</span>
                                          </Label>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          <Checkbox
                                            id={`bad_${index}`}
                                            checked={ascertainment.bad}
                                            onCheckedChange={() => handleCheckboxChange(index, 'bad')}
                                          />
                                          <Label htmlFor={`bad_${index}`} className="flex items-center space-x-2 cursor-pointer">
                                            <StarOff className="h-4 w-4 text-red-600" />
                                            <span>Mauvais</span>
                                          </Label>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          <Checkbox
                                            id={`very_bad_${index}`}
                                            checked={ascertainment.very_bad}
                                            onCheckedChange={() => handleCheckboxChange(index, 'very_bad')}
                                          />
                                          <Label htmlFor={`very_bad_${index}`} className="flex items-center space-x-2 cursor-pointer">
                                            <StarOff className="h-4 w-4 text-red-800" />
                                            <span>Très mauvais</span>
                                          </Label>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Score de qualité */}
                                    {qualityScore > 0 && (
                                      <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                        <span className="text-sm font-medium">Score de qualité :</span>
                                        <Badge className={`${getQualityColor(qualityScore)} border-0`}>
                                          {getQualityLabel(qualityScore)} ({qualityScore}/6)
                                        </Badge>
                                      </div>
                                    )}
                                  </div>

                                  {/* Commentaire */}
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center space-x-2">
                                      <span>Commentaire détaillé</span>
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <RichTextEditor
                                      value={ascertainment.comment}
                                      onChange={(value) => updateAscertainment(index, 'comment', value)}
                                      placeholder="Décrivez en détail l'état observé, les défauts constatés, les recommandations..."
                                      className="min-h-[120px]"
                                    />
                                  </div>

                                  {/* Actions */}
                                  {formData.ascertainments.length > 1 && (
                                    <div className="flex justify-end">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeAscertainment(index)}
                                        className="text-destructive hover:text-destructive hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Supprimer ce constat
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Résumé */}
                <Card className="sticky top-6 border-2 border-dashed border-black-200 hover:border-blue-300 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Résumé</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Dossier sélectionné</span>
                        <Badge variant={formData.assignment_id ? "default" : "secondary"}>
                          {formData.assignment_id ? "Oui" : "Non"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Nombre de constats</span>
                        <Badge variant="outline">
                          {formData.ascertainments.length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Types définis</span>
                        <Badge variant={formData.ascertainments.every(a => a.ascertainment_type_id) ? "default" : "secondary"}>
                          {formData.ascertainments.filter(a => a.ascertainment_type_id).length}/{formData.ascertainments.length}
                        </Badge>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Validation</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          {formData.assignment_id ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={formData.assignment_id ? "text-green-700" : "text-red-700"}>
                            Dossier sélectionné
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          {formData.ascertainments.every(a => a.ascertainment_type_id) ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={formData.ascertainments.every(a => a.ascertainment_type_id) ? "text-green-700" : "text-red-700"}>
                            Types de constat définis
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          {formData.ascertainments.every(a => a.comment.trim()) ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={formData.ascertainments.every(a => a.comment.trim()) ? "text-green-700" : "text-red-700"}>
                            Commentaires remplis
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3 mt-10">
                        <Button
                          type="submit"
                          disabled={loading || !formData.assignment_id || formData.ascertainments.some(a => !a.ascertainment_type_id || !a.comment.trim())}
                          className="w-full"
                          size="lg"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? 'Création en cours...' : 'Créer le constat'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate({ to: '/administration/constat' })}
                          className="w-full"
                          size="lg"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

               
              </div>
            </div>
          </form>
        </div>
      </Main>
    </>
  )
}

export default function CreateAscertainmentPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.CREATE_ASCERTAINMENT}>
      <CreateAscertainmentPageContent />
    </ProtectedRoute>
  )
} 