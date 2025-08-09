import { ColumnDef } from '@tanstack/react-table'
import { User } from '@/types/administration'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreHorizontal, Eye, Edit, Trash2, User as UserIcon, Mail, Shield } from 'lucide-react'

// Props pour les actions
interface UserActionsProps {
  user: User
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onEnable: (user: User) => Promise<void>
  onDisable: (user: User) => Promise<void>
  onReset: (user: User) => Promise<void>
}

// Composant pour les actions
function UserActions({ user, onView, onEdit, onDelete, onEnable, onDisable, onReset }: UserActionsProps) {
  const isActive = user.status?.code === 'active'
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onView(user)}>
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        {/* Options conditionnelles selon le statut */}
        {!isActive && (
          <DropdownMenuItem 
            onClick={() => onEnable(user)}
            className="text-green-600"
          >
            <Shield className="mr-2 h-4 w-4" />
            Activer
          </DropdownMenuItem>
        )}
        
        {isActive && (
          <DropdownMenuItem 
            onClick={() => onDisable(user)}
            className="text-orange-600"
          >
            <Shield className="mr-2 h-4 w-4" />
            Désactiver
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={() => onReset(user)}
          className="text-blue-600"
        >
          <Shield className="mr-2 h-4 w-4" />
          Réinitialiser
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(user)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Props pour les colonnes
interface ColumnsProps {
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onEnable: (user: User) => Promise<void>
  onDisable: (user: User) => Promise<void>
  onReset: (user: User) => Promise<void>
}

export const createColumns = ({ onView, onEdit, onDelete, onEnable, onDisable, onReset }: ColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: 'username',
    header: 'Utilisateur',
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photo_url} alt={user.name} />
            <AvatarFallback>
              <UserIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-sm text-muted-foreground">{user.code || ''}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.getValue('email') as string
      return (
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'telephone',
    header: 'Téléphone',
    cell: ({ row }) => {
      const telephone = row.getValue('telephone') as string
      return (
        <div className="flex items-center space-x-2">
          {/* <Phone className="h-4 w-4 text-muted-foreground" /> */}
          <span className="text-sm">{telephone}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'entity',
    header: 'Entité',
    cell: ({ row }) => {
      const entity = row.original.entity
      return (
        <div className="flex items-center space-x-2">
          {/* <Building className="h-4 w-4 text-muted-foreground" /> */}
          <Badge variant="outline">
            {entity?.name || ''}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'role',
    header: 'Rôle',
    cell: ({ row }) => {
      const role = row.original.role
      return (
        <div className="flex items-center space-x-2">
          {/* <Shield className="h-4 w-4 text-muted-foreground" /> */}
          <Badge variant="secondary">
            {role?.label || ''}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.original.status
      const isActive = status?.code === 'active'
      return (
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {status?.label || 'Inconnu'}
        </Badge>
      )
    },
  },
  // {
  //   accessorKey: 'created_at',
  //   header: 'Créé le',
  //   cell: ({ row }) => {
  //     const date = new Date(row.getValue('created_at'))
  //     return (
  //       <div className="flex items-center space-x-2 text-sm text-muted-foreground">
  //         {/* <Calendar className="h-4 w-4" /> */}
  //         <span>{date.toLocaleDateString('fr-FR')}</span>
  //       </div>
  //     )
  //   },
  // },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <UserActions 
          user={row.original} 
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onEnable={onEnable}
          onDisable={onDisable}
          onReset={onReset}
        />
      )
    },
  },
] 