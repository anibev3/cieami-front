import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/useAuth'
import { userService, ChangePasswordData } from '@/services/userService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
  const user = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [formData, setFormData] = useState<ChangePasswordData>({
    current_password: '',
    password: '',
    password_confirmation: '',
    code: user?.code || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  })

  // Mettre à jour les données utilisateur quand le modal s'ouvre
  useEffect(() => {
    if (open && user) {
      setFormData(prev => ({
        ...prev,
        code: user.code || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      }))
    }
  }, [open, user])

  const handleInputChange = (field: keyof ChangePasswordData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const resetForm = () => {
    setFormData({
      current_password: '',
      password: '',
      password_confirmation: '',
      code: user?.code || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
    })
    setError(null)
    setIsSuccess(false)
  }

  const validateForm = (): boolean => {
    if (!formData.current_password.trim()) {
      setError('Le mot de passe actuel est obligatoire')
      return false
    }
    if (!formData.password.trim()) {
      setError('Le nouveau mot de passe est obligatoire')
      return false
    }
    if (formData.password.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères')
      return false
    }
    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas')
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
      const response = await userService.changePassword(formData)
      
      if (response.status === 200) {
        setIsSuccess(true)
        toast.success('Mot de passe modifié avec succès')
        
        // Fermer le modal après 2 secondes
        setTimeout(() => {
          onOpenChange(false)
          resetForm()
        }, 2000)
      } else {
        setError(response.message || 'Erreur lors de la modification du mot de passe')
        toast.error('Erreur lors de la modification du mot de passe')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
      
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat()
        setError(errorMessages.join(', '))
      } else {
        setError('Erreur lors de la modification du mot de passe')
      }
      
      toast.error('Erreur lors de la modification du mot de passe')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
      resetForm()
    }
  }

  if (!user) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Changer le mot de passe
          </DialogTitle>
          <DialogDescription>
            Modifiez votre mot de passe pour sécuriser votre compte
          </DialogDescription>
        </DialogHeader>

        {/* Messages d'état */}
        {isSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Votre mot de passe a été modifié avec succès !
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mot de passe actuel */}
          <div className="space-y-2">
            <Label htmlFor="current_password">Mot de passe actuel *</Label>
            <div className="relative">
              <Input
                id="current_password"
                type={showPasswords.current ? "text" : "password"}
                value={formData.current_password}
                onChange={(e) => handleInputChange('current_password', e.target.value)}
                placeholder="Votre mot de passe actuel"
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('current')}
                disabled={isLoading}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPasswords.new ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Votre nouveau mot de passe"
                required
                disabled={isLoading}
                minLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('new')}
                disabled={isLoading}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Le mot de passe doit contenir au moins 8 caractères
            </p>
          </div>

          {/* Confirmation du mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirmer le nouveau mot de passe *</Label>
            <div className="relative">
              <Input
                id="password_confirmation"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.password_confirmation}
                onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                placeholder="Confirmez votre nouveau mot de passe"
                required
                disabled={isLoading}
                minLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('confirm')}
                disabled={isLoading}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isSuccess}
            >
              {isLoading ? 'Modification...' : 'Modifier le mot de passe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
