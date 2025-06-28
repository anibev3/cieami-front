import { useUser } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Shield, 
  Calendar, 
  Key, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function UserAccountDisplay() {
  const user = useUser()
  const [showHashId, setShowHashId] = useState(false)

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement des informations du compte...</p>
      </div>
    )
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copié dans le presse-papiers`)
  }

  return (
    <div className="space-y-6 w-full">
      {/* Statut du compte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Statut du compte
          </CardTitle>
          <CardDescription>
            Informations générales sur votre compte utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {user.pending_verification ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                )}
                <span className="text-sm font-medium">Statut de vérification</span>
              </div>
              <Badge variant={user.pending_verification ? "secondary" : "default"}>
                {user.pending_verification ? "En attente" : "Vérifié"}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Niveau d'accès</span>
              <Badge variant="outline">{user.role.name}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identifiants du compte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Identifiants du compte
          </CardTitle>
          <CardDescription>
            Vos identifiants uniques dans le système
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID utilisateur (Hash)</label>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded flex-1">
                  {showHashId ? user.hash_id : '••••••••••••••••'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHashId(!showHashId)}
                >
                  {showHashId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(user.hash_id, "ID utilisateur")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nom d'utilisateur</label>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded flex-1">
                  {user.username}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(user.username, "Nom d'utilisateur")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email de connexion</label>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded flex-1">
                  {user.email}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(user.email, "Email")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Informations de sécurité
          </CardTitle>
          <CardDescription>
            Détails sur vos permissions et accès
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Rôle principal</label>
              <p className="text-sm">{user.role.label}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description du rôle</label>
              <p className="text-sm">{user.role.description}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Permissions</label>
            {user.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-2">
                {user.permissions.map((permission, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                Aucune permission spécifique attribuée
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informations temporelles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Informations temporelles
          </CardTitle>
          <CardDescription>
            Dates importantes de votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date de création</label>
              <p className="text-sm">
                {new Date(user.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Dernière mise à jour</label>
              <p className="text-sm">
                {new Date(user.updated_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {user.pending_verification ? (
                <XCircle className="w-4 h-4 text-red-500 mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              )}
              <span className="text-sm">
                {user.pending_verification 
                  ? "Votre compte nécessite une vérification" 
                  : "Votre compte est entièrement vérifié"
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions du compte */}
      <Card>
        <CardHeader>
          <CardTitle>Actions du compte</CardTitle>
          <CardDescription>
            Actions disponibles pour votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1">
              Modifier le profil
            </Button>
            <Button variant="outline" className="flex-1">
              Changer le mot de passe
            </Button>
            <Button variant="outline" className="flex-1">
              Paramètres de sécurité
            </Button>
          </div>
          
          {user.pending_verification && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    Vérification en attente
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Votre compte nécessite une vérification pour accéder à toutes les fonctionnalités.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 