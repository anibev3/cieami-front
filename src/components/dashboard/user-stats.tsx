import { useUser } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Building, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Star
} from 'lucide-react'

export function UserStats() {
  const user = useUser()

  if (!user) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded w-2/3 mt-2 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Calculer l'ancienneté
  const createdAt = new Date(user.created_at)
  const now = new Date()
  const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Statut du compte */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Statut du compte</CardTitle>
          {user.pending_verification ? (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {user.pending_verification ? "En attente" : "Actif"}
          </div>
          <p className="text-xs text-muted-foreground">
            {user.pending_verification 
              ? "Vérification requise" 
              : "Compte vérifié"
            }
          </p>
        </CardContent>
      </Card>

      {/* Rôle utilisateur */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rôle</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.role.name}</div>
          <p className="text-xs text-muted-foreground">
            {user.role.label}
          </p>
        </CardContent>
      </Card>

      {/* Entité */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entité</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.entity.code}</div>
          <p className="text-xs text-muted-foreground">
            {user.entity.name}
          </p>
        </CardContent>
      </Card>

      {/* Ancienneté */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ancienneté</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{daysSinceCreation}</div>
          <p className="text-xs text-muted-foreground">
            jours depuis la création
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Composant de carte de bienvenue
export function WelcomeCard() {
  const user = useUser()

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bienvenue</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const currentHour = new Date().getHours()
  let greeting = "Bonjour"
  
  if (currentHour < 12) {
    greeting = "Bonjour"
  } else if (currentHour < 18) {
    greeting = "Bon après-midi"
  } else {
    greeting = "Bonsoir"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          {greeting}, {user.first_name} !
        </CardTitle>
        <CardDescription>
          Bienvenue sur votre tableau de bord. Voici un aperçu de votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Nom complet</span>
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm font-medium">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rôle</span>
            <Badge variant="outline">{user.role.name}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Entité</span>
            <span className="text-sm font-medium">{user.entity.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 