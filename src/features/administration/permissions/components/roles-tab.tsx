/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from 'react'
import { usePermissionsStore } from '@/stores/permissionsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Shield,
  Search,
  Plus,
  CheckCircle2,
} from 'lucide-react'
import {
  groupPermissionsByResource,
  formatResourceName,
  formatActionName,
  getActionName,
} from '@/utils/permissions'
import { cn } from '@/lib/utils'
import { Role } from '@/types/permissions'
import { Separator } from '@/components/ui/separator'
import { RoleCardSkeleton } from './skeletons/role-card-skeleton'

export function RolesTab() {
  const { roles, permissions, selectedRole, setSelectedRole, givePermissionToRole, revokePermissionFromRole, loading } = usePermissionsStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set())

  const groupedPermissions = useMemo(() => {
    return groupPermissionsByResource(permissions)
  }, [permissions])

  const filteredRoles = useMemo(() => {
    if (!searchQuery) return roles
    const query = searchQuery.toLowerCase()
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(query) ||
        role.label.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query)
    )
  }, [roles, searchQuery])

  const handleOpenDialog = (role: Role) => {
    setSelectedRole(role)
    // Pré-sélectionner les permissions déjà assignées
    // Les permissions du rôle peuvent avoir id: null, donc on doit trouver l'ID correspondant
    // en cherchant dans la liste complète des permissions par nom
    const assigned = new Set<string>()
    
    role.permissions.forEach((rolePerm) => {
      // Chercher la permission correspondante dans la liste complète
      const fullPermission = permissions.find(
        (p) => p.name === rolePerm.name
      )
      if (fullPermission) {
        // Utiliser l'ID de la permission complète
        assigned.add(fullPermission.id)
      } else if (rolePerm.id) {
        // Si on ne trouve pas par nom, utiliser l'ID du rôle (si disponible)
        assigned.add(rolePerm.id)
      }
    })
    
    setSelectedPermissions(assigned)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedRole(null)
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
    if (!selectedRole) return

    // Convertir les permissions du rôle en IDs (en cherchant dans la liste complète)
    const currentPermissionIds = new Set<string>()
    selectedRole.permissions.forEach((rolePerm) => {
      // Chercher la permission correspondante dans la liste complète par nom
      const fullPermission = permissions.find((p) => p.name === rolePerm.name)
      if (fullPermission) {
        currentPermissionIds.add(fullPermission.id)
      } else if (rolePerm.id) {
        // Si on ne trouve pas par nom, utiliser l'ID du rôle (si disponible)
        currentPermissionIds.add(rolePerm.id)
      }
    })

    // Les permissions sélectionnées sont déjà des IDs (depuis selectedPermissions)
    const toAdd = Array.from(selectedPermissions).filter(
      (id) => !currentPermissionIds.has(id)
    )
    const toRemove = Array.from(currentPermissionIds).filter(
      (id) => !selectedPermissions.has(id)
    )

    try {
      if (toAdd.length > 0) {
        await givePermissionToRole(selectedRole.id, {
          permissions: toAdd,
        })
      }
      if (toRemove.length > 0) {
        await revokePermissionFromRole(selectedRole.id, {
          permissions: toRemove,
        })
      }
      handleCloseDialog()
    } catch (error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un rôle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Liste des rôles */}
      {loading && filteredRoles.length === 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <RoleCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRoles.map((role) => (
          <Card
            key={role.id}
            className="border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer py-2 gap-0 shadow-none"
            onClick={() => handleOpenDialog(role)}
          >
            <CardHeader className="px-3 my-1">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* <div className="p-2 bg-primary/10 rounded-lg"> */}
                    <Shield className="h-5 w-5 text-primary" />
                  {/* </div> */}
                  <div className="flex-1">
                    <CardTitle className="text-sm truncate">{role.label.length > 30 ? role.label.slice(0, 30) + '...' : role.label}</CardTitle>
                    {/* <CardDescription className="mt-1 truncate text-xs">
                      {role.name.length > 35 ? role.name.slice(0, 35) + '...' : role.name}
                    </CardDescription> */}
                  </div>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="px-3 mt-2">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {role.description}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  {role.permissions.length} permission{role.permissions.length > 1 ? 's' : ''}
                </Badge>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Gérer
                </Button>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Dialog de gestion des permissions */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Gérer les permissions - {selectedRole?.label}
            </DialogTitle>
            <DialogDescription>
              {selectedRole?.description}
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
                      // Vérifier si cette permission était assignée au rôle
                      const wasAssigned = selectedRole
                        ? selectedRole.permissions.some(
                            (rp) => rp.name === permission.name || rp.id === permission.id
                          )
                        : false

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

