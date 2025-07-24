import { useUser } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Phone, Building, Calendar, Shield } from 'lucide-react'

export default function UserProfileDisplay() {
  const user = useUser()

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement des informations utilisateur...</p>
      </div>
    )
  }

  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`

  return (
    <div className="space-y-6 w-full">
      {/* En-tête du profil */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.photo_url} alt={user.name} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <CardDescription className="text-lg">{user.email}</CardDescription>
          <div className="flex justify-center mt-2">
            <Badge variant="secondary" className="text-sm">
              <Shield className="w-3 h-3 mr-1" />
              {user.role?.label || 'Rôle non défini'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Informations personnelles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
              <p className="text-sm">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nom d'utilisateur</label>
              <p className="text-sm">{user.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Prénom</label>
              <p className="text-sm">{user.first_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nom de famille</label>
              <p className="text-sm">{user.last_name}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                <p className="text-sm">{user.telephone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations de l'entité */}
      {user.entity && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Informations de l'entité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nom de l'entité</label>
                <p className="text-sm">{user.entity.name || 'Non renseigné'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Code de l'entité</label>
                <p className="text-sm">{user.entity.code || 'Non renseigné'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email de l'entité</label>
                <p className="text-sm">{user.entity.email || 'Non renseigné'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Téléphone de l'entité</label>
              <p className="text-sm">{user.entity.telephone || 'Non renseigné'}</p>
            </div>
          </div>
          
          {user.entity.address && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                <p className="text-sm">{user.entity.address}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      )}

      {/* Informations du compte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Informations du compte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID utilisateur</label>
              <p className="text-sm font-mono">{user.hash_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Rôle</label>
              <p className="text-sm">{user.role?.name || 'Non renseigné'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date de création</label>
              <p className="text-sm">{new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Dernière mise à jour</label>
              <p className="text-sm">{new Date(user.updated_at).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Description du rôle</label>
            <p className="text-sm">{user.role?.description || 'Aucune description'}</p>
          </div>
          
          {user.permissions && user.permissions.length > 0 && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Permissions</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 