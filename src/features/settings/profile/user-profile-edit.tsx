import { useState } from 'react'
import { useUser } from '@/hooks/useAuth'
import { userService, UpdateProfileData } from '@/services/userService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
// import { SignaturePad } from '@/components/ui/signature-pad'
import { User, Mail, Phone, Save, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function UserProfileEdit() {
  const user = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<UpdateProfileData>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    // signature: null,
    code: user?.code || '',
  })

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement des informations utilisateur...</p>
      </div>
    )
  }

  const handleInputChange = (field: keyof UpdateProfileData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  // const handleSignatureChange = (signature: string | File | null) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     signature: signature instanceof File ? signature : null
  //   }))
  //   setError(null)
  // }

  const resetForm = () => {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      telephone: user.telephone || '',
      // signature: null,
      code: user.code || '',
    })
    setError(null)
    setIsSuccess(false)
  }

  const validateForm = (): boolean => {
    if (!formData.first_name.trim()) {
      setError('Le prénom est obligatoire')
      return false
    }
    if (!formData.last_name.trim()) {
      setError('Le nom de famille est obligatoire')
      return false
    }
    if (!formData.email.trim()) {
      setError('L\'email est obligatoire')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('L\'email n\'est pas valide')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      const response = await userService.updateProfile(formData)
      
      if (response.status === 200) {
        setIsSuccess(true)
        toast.success('Profil mis à jour avec succès')
        
        // Optionnel : mettre à jour les données utilisateur dans le contexte
        // Si vous avez un hook pour mettre à jour l'utilisateur
        // updateUser(response.data.user)
      } else {
        setError(response.message || 'Erreur lors de la mise à jour')
        toast.error('Erreur lors de la mise à jour du profil')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
      
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat()
        setError(errorMessages.join(', '))
      } else {
        setError('Erreur lors de la mise à jour du profil')
      }
      
      toast.error('Erreur lors de la mise à jour du profil')
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges = () => {
    return (
      formData.first_name !== user.first_name ||
      formData.last_name !== user.last_name ||
      formData.email !== user.email ||
      formData.telephone !== user.telephone ||
      // formData.signature !== null ||
      formData.code !== user.code
    )
  }

  return (
    <div className="space-y-6 w-full mx-auto">

      {/* Messages d'état */}
      {isSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Votre profil a été mis à jour avec succès !
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations personnelles
            </CardTitle>
            <CardDescription>
              Vos informations de base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="Votre prénom"
                  maxLength={255}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name">Nom de famille *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Votre nom de famille"
                  maxLength={255}
                  required
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="votre.email@exemple.com"
                    maxLength={255}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="telephone"
                    value={formData.telephone || ''}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    maxLength={255}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signature */}
        {/* <SignaturePad
          onSignatureChange={handleSignatureChange}
          currentSignature={(user as { signature_url?: string }).signature_url}
        /> */}

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading || !hasChanges()}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Mise à jour...' : 'Enregistrer les modifications'}
              </Button>
            </div>
            
            {!hasChanges() && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Aucune modification détectée
              </p>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  )
} 