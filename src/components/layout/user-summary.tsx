import { useUser } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { User, Building, Shield } from 'lucide-react'

interface UserSummaryProps {
  compact?: boolean
  showEntity?: boolean
  showRole?: boolean
}

export function UserSummary({ compact = false, showEntity = true, showRole = true }: UserSummaryProps) {
  const user = useUser()

  if (!user) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
            <div className="space-y-1 flex-1">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.photo_url} alt={user.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              {showRole && (
                <Badge variant="outline" className="text-xs mt-1">
                  {user.role.name}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* En-tête utilisateur */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.photo_url} alt={user.name} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">{user.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground truncate">{user.username}</p>
            </div>
          </div>

          <Separator />

          {/* Informations de base */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Nom complet</span>
              <span className="text-xs">{user.name}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Rôle</span>
              <Badge variant="outline" className="text-xs">
                {user.role.name}
              </Badge>
            </div>

            {showEntity && (
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Entité</span>
                <span className="text-xs truncate">{user.entity.name}</span>
              </div>
            )}
          </div>

          {/* Statut de vérification */}
          {user.pending_verification && (
            <>
              <Separator />
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <p className="text-xs text-yellow-800">
                  ⚠️ Compte en attente de vérification
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 