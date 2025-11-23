/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useState, useMemo, useEffect, useCallback } from 'react'
import { usePermissionsStore } from '@/stores/permissionsStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  User,
  Search,
  Shield,
  CheckCircle2,
  X,
} from 'lucide-react'
import {
  groupPermissionsByResource,
  formatResourceName,
  formatActionName,
  getActionName,
} from '@/utils/permissions'
import { cn } from '@/lib/utils'
import { UserListUser } from '@/types/administration'
import { userService } from '@/services/userService'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from 'sonner'
import { Pagination } from '@/components/ui/pagination'
import { Separator } from '@/components/ui/separator'
import { UserCardSkeleton } from './skeletons/user-card-skeleton'

export function UsersPermissionsTab() {
  const { permissions, setSelectedUserId, givePermissionToUser, revokePermissionFromUser, loading } = usePermissionsStore()
  const [users, setUsers] = useState<UserListUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserListUser | null>(null)
  const [userPermissions, setUserPermissions] = useState<string[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set())

  const debouncedSearch = useDebounce(searchQuery, 500)

  const groupedPermissions = useMemo(() => {
    return groupPermissionsByResource(permissions)
  }, [permissions])

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true)
      const response = await userService.getAllFromList({
        search: debouncedSearch || undefined,
        page: currentPage,
        per_page: perPage,
      })
      setUsers(response.data)
      setPagination({
        currentPage: response.meta.current_page,
        lastPage: response.meta.last_page,
        total: response.meta.total,
        from: response.meta.from,
        to: response.meta.to,
      })
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
      toast.error('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoadingUsers(false)
    }
  }, [debouncedSearch, currentPage, perPage])

  // Reset à la page 1 quand la recherche change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  // Fetch les utilisateurs quand les dépendances changent
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleOpenDialog = (user: UserListUser) => {
    setSelectedUser(user)
    setSelectedUserId(user.id)
    
    // Les permissions sont déjà dans user.permissions (tableau de strings)
    const userPerms = user.permissions || []
    setUserPermissions(userPerms)
    
    // Pré-sélectionner les permissions déjà assignées
    // Chercher les IDs correspondants dans la liste complète des permissions
    const assigned = new Set<string>()
    
    userPerms.forEach((permName: string) => {
      // Chercher la permission correspondante dans la liste complète par nom
      const fullPermission = permissions.find((p) => p.name === permName)
      if (fullPermission) {
        assigned.add(fullPermission.id)
      }
    })
    
    setSelectedPermissions(assigned)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedUser(null)
    setSelectedUserId(null)
    setUserPermissions([])
    setSelectedPermissions(new Set())
  }

  const handleTogglePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions)
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId)
    } else {
      newSelected.add(permissionId)
    }
    setSelectedPermissions(newSelected)
  }

  const handleSavePermissions = async () => {
    if (!selectedUser) return

    // Convertir les IDs de permissions sélectionnées en noms pour l'API
    const selectedPermissionNames = Array.from(selectedPermissions)
      .map((id) => {
        const perm = permissions.find((p) => p.id === id)
        return perm?.name
      })
      .filter((name): name is string => !!name)

    const currentPermissionNames = new Set(userPermissions)
    const toAdd = selectedPermissionNames.filter((name) => !currentPermissionNames.has(name))
    const toRemove = Array.from(currentPermissionNames).filter((name) => !selectedPermissionNames.includes(name))

    try {
      if (toAdd.length > 0) {
        // Convertir les noms en IDs pour l'API
        const toAddIds = toAdd
          .map((name) => {
            const perm = permissions.find((p) => p.name === name)
            return perm?.id
          })
          .filter((id): id is string => !!id)
        
        await givePermissionToUser(selectedUser.id, {
          permissions: toAddIds,
        })
      }
      if (toRemove.length > 0) {
        // Convertir les noms en IDs pour l'API
        const toRemoveIds = toRemove
          .map((name) => {
            const perm = permissions.find((p) => p.name === name)
            return perm?.id
          })
          .filter((id): id is string => !!id)
        
        await revokePermissionFromUser(selectedUser.id, {
          permissions: toRemoveIds,
        })
      }
      handleCloseDialog()
      // Rafraîchir la liste des utilisateurs
      await fetchUsers()
    } catch (error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Barre de recherche et contrôles */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Par page:</span>
          <Select
            value={perPage.toString()}
            onValueChange={(value) => {
              const newPerPage = Number(value)
              setPerPage(newPerPage)
              setCurrentPage(1) // Reset à la page 1 quand on change per_page
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      {loadingUsers && users.length === 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <UserCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun utilisateur trouvé
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                  <Card
                    key={user.id}
                    className="border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer shadow-none gap-0 py-2"
                    onClick={() => handleOpenDialog(user)}
                  >
                    <CardHeader className="px-2 my-1">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.photo_url} alt={user.name} />
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm truncate">{user.name.length > 30 ? user.name.slice(0, 30) + '...' : user.name}</CardTitle>
                            <CardDescription className="truncate text-xs">
                              {user.email.length > 30 ? user.email.slice(0, 30) + '...' : user.email}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="px-2 mt-2">
                      <div className="space-y-2">
                        <div className="text-xs flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="secondary" className="text-xs bg-muted-foreground/10 text-muted-foreground"><span className="text-xs">{user.role.label.length > 30 ? user.role.label.slice(0, 30) + '...' : user.role.label}</span></Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{user.permissions?.length || 0} permission{(user.permissions?.length || 0) > 1 ? 's' : ''}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <User className="h-4 w-4 mr-2" />
                          Gérer les permissions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination - Toujours afficher si on a des résultats */}
              {pagination.total > 0 && (
                <div className="pt-4">
                  {pagination.lastPage > 1 ? (
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.lastPage}
                      totalItems={pagination.total}
                      perPage={perPage}
                      onPageChange={(page) => {
                        setCurrentPage(page)
                      }}
                      loading={loadingUsers}
                    />
                  ) : (
                    <div className="text-center text-sm text-muted-foreground py-2">
                      Affichage de {pagination.from} à {pagination.to} sur {pagination.total} utilisateur{pagination.total > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Dialog de gestion des permissions */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Gérer les permissions - {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.email} • {selectedUser?.role.label}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {groupedPermissions.map((group) => (
                <div key={group.resource} className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <h4 className="font-semibold text-base">
                      {formatResourceName(group.resource)}
                    </h4>
                    <Badge variant="outline" className="ml-auto">
                      {group.actions.length}
                    </Badge>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {group.actions.map((permission) => {
                      const permissionId = permission.id
                      const isSelected = selectedPermissions.has(permissionId)
                      // Vérifier si cette permission était assignée à l'utilisateur (permissions est un tableau de strings)
                      const wasAssigned = userPermissions.includes(permission.name)

                      return (
                        <div
                          key={permission.id}
                          className={cn(
                            'flex items-center space-x-2 p-2 rounded-lg border transition-colors',
                            isSelected && 'bg-primary/10 border-primary',
                            !isSelected && wasAssigned && 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
                            !isSelected && !wasAssigned && 'hover:bg-accent'
                          )}
                        >
                          <Checkbox
                            id={permission.id}
                            checked={isSelected}
                            onCheckedChange={() =>
                              handleTogglePermission(permissionId)
                            }
                          />
                          <label
                            htmlFor={permission.id}
                            className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {formatActionName(getActionName(permission.name))}
                          </label>
                          {wasAssigned && !isSelected && (
                            <Badge variant="outline" className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700">
                              Retiré
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSavePermissions} disabled={loading}>
              {loading ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

