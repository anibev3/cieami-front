import { Outlet } from '@tanstack/react-router'
import {
  IconBrowserCheck,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import SidebarNav from './components/sidebar-nav'

export default function Comptabilite() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Comptabilité
          </h1>
          <p className='text-muted-foreground'>
            Gestion des paiements et des cheques.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Paiements',
    icon: <IconUser size={18} />,
    href: '/comptabilite/payments',
  },
  {
    title: 'Cheques',
    icon: <IconTool size={18} />,
    href: '/comptabilite/checks',
  },
  {
    title: 'Types de paiement',
    icon: <IconPalette size={18} />,
    href: '/comptabilite/payment-types',
  },
  {
    title: 'Méthodes de paiement',
    icon: <IconNotification size={18} />,
    href: '/comptabilite/payment-methods',
  },
  {
    title: 'Banques',
    icon: <IconBrowserCheck size={18} />,
    href: '/comptabilite/banks',
  },
]
