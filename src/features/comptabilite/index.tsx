import { Outlet } from '@tanstack/react-router'
import {
  IconBrowserCheck,
  IconCalculator,
  IconFileText,
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
import { useHasAnyPermission, useHasAnyRole, Permission, UserRole } from '@/stores/aclStore'
import { useMemo } from 'react'

export default function Comptabilite() {
  // Hooks pour vérifier les permissions et rôles - appelés au niveau du composant
  const hasViewPayment = useHasAnyPermission([Permission.VIEW_PAYMENT])
  const hasViewInvoice = useHasAnyPermission([Permission.VIEW_INVOICE])
  const hasPaymentStats = useHasAnyPermission([Permission.PAYMENT_STATISTICS])
  const hasInvoiceStats = useHasAnyPermission([Permission.INVOICE_STATISTICS])
  
  const hasAccountantRole = useHasAnyRole([UserRole.ACCOUNTANT, UserRole.ACCOUNTANT_MANAGER, UserRole.ADMIN, UserRole.SYSTEM_ADMIN])
  const hasManagerRole = useHasAnyRole([UserRole.ACCOUNTANT_MANAGER, UserRole.ADMIN, UserRole.SYSTEM_ADMIN])
  const hasCEO = useHasAnyRole([UserRole.CEO])
  const hasOpenerRole = useHasAnyRole([UserRole.OPENER])

  // Configuration complète des éléments du menu avec leurs permissions
  const allSidebarNavItems = [
    {
      title: 'Paiements',
      icon: <IconUser size={18} />,
      href: '/comptabilite/payments',
      checkAccess: () => hasViewPayment || hasCEO || hasOpenerRole,
    },
    {
      title: 'Cheques',
      icon: <IconTool size={18} />,
      href: '/comptabilite/checks',
      checkAccess: () => hasAccountantRole,
    },
    {
      title: 'Factures',
      icon: <IconFileText size={18} />,
      href: '/comptabilite/invoices',
      checkAccess: () => hasViewInvoice || hasCEO,
    },
    {
      title: 'Types de paiement',
      icon: <IconPalette size={18} />,
      href: '/comptabilite/payment-types',
      checkAccess: () => hasManagerRole || hasCEO,
    },
    {
      title: 'Méthodes de paiement',
      icon: <IconNotification size={18} />,
      href: '/comptabilite/payment-methods',
      checkAccess: () => hasManagerRole || hasCEO,
    },
    {
      title: 'Banques',
      icon: <IconBrowserCheck size={18} />,
      href: '/comptabilite/banks',
      checkAccess: () => hasManagerRole || hasCEO,
    },
    {
      title: 'Statistiques',
      icon: <IconCalculator size={18} />,
      href: '/comptabilite/statistics/assignments',
      checkAccess: () => hasPaymentStats || hasInvoiceStats || hasCEO,
    },
  ]

  // Filtrer les éléments du menu selon les permissions de l'utilisateur
  const filteredSidebarNavItems = useMemo(() => {
    return allSidebarNavItems
      .filter(item => item.checkAccess())
      .map(item => ({
        title: item.title,
        icon: item.icon,
        href: item.href
      }))
  }, [hasViewPayment, hasViewInvoice, hasPaymentStats, hasInvoiceStats, hasAccountantRole, hasManagerRole])

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
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12 w-full'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={filteredSidebarNavItems} />
          </aside>
          <div className='flex w-full overflow-y-auto p-1'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}
