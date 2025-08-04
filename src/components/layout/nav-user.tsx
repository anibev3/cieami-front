import { Link } from '@tanstack/react-router'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-secondary data-[state=open]:text-white hover:bg-white/10 transition-all duration-200'
            >
              <Avatar className='h-8 w-8 rounded-lg border-2 border-white/20'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='rounded-lg bg-secondary text-white font-semibold'>
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold text-white'>{user.name}</span>
                <span className='truncate text-xs text-white/70'>{user.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4 text-white/80' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-white border-primary/20 shadow-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal bg-gradient-to-r from-primary/5 to-primary/10'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg border-2 border-primary/20'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className='rounded-lg bg-primary text-white font-semibold'>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold text-primary'>{user.name}</span>
                  <span className='truncate text-xs text-primary/70'>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-primary/20" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-secondary hover:text-white focus:bg-secondary focus:text-white">
                <Sparkles className="text-secondary" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-primary/20" />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to='/settings/account' className="hover:bg-primary hover:text-white focus:bg-primary focus:text-white">
                  <BadgeCheck className="text-primary" />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to='/settings' className="hover:bg-primary hover:text-white focus:bg-primary focus:text-white">
                  <CreditCard className="text-primary" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to='/settings/notifications' className="hover:bg-primary hover:text-white focus:bg-primary focus:text-white">
                  <Bell className="text-primary" />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-primary/20" />
            <DropdownMenuItem className="hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white">
              <LogOut className="text-red-500" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
