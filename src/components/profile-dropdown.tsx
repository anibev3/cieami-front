
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { useUser } from '@/stores/authStore'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from '@tanstack/react-router'
import { ConfirmDialog } from '@/components/confirm-dialog'

export function ProfileDropdown() {
  const user = useUser()
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  // Si l'utilisateur n'est pas connecté, ne pas afficher le dropdown
  if (!user) {
    return null
  }

  // Générer les initiales de l'utilisateur
  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`

  // Fonction pour ouvrir le dialog de confirmation
  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  // Fonction de déconnexion avec redirection
  const handleConfirmLogout = async () => {
    await logout()
    setShowLogoutDialog(false)
    navigate({ to: '/sign-in-2' })
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user.photo_url} alt={user.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogoutClick}>
            <LogOut className='mr-2 h-4 w-4' />
            Déconnexion
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Confirmer la déconnexion"
        desc="Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à l'application."
        confirmText="Se déconnecter"
        cancelBtnText="Annuler"
        destructive
        handleConfirm={handleConfirmLogout}
      />
    </>
  )
}
