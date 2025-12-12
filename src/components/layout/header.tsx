import React from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'bg-background flex h-16 items-center gap-3 p-4 sm:gap-4',
        fixed && cn(
          'header-fixed peer/header fixed z-50 top-0 rounded-md',
          'right-0',
          'w-[calc(100vw-var(--sidebar-width))]',
          'peer-data-[state=collapsed]:w-[calc(100vw-var(--sidebar-width-icon)-1rem)]',
          'peer-data-[state=expanded]:w-[calc(100vw-var(--sidebar-width))]',
          'sm:transition-[width] sm:duration-200 sm:ease-linear'
        ),
        offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
        className
      )}
      {...props}
    >
      <SidebarTrigger variant='outline' className='scale-125 sm:scale-100 shrink-0' />
      <Separator orientation='vertical' className='h-6 shrink-0' />
      <div className='flex-1 flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden'>
        {children}
      </div>
    </header>
  )
}

Header.displayName = 'Header'
