import { ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight, ChevronDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { NavCollapsible, NavItem, NavLink, NavItemCounter, type NavGroup } from './types'

export function NavGroup({ title, items }: NavGroup) {
  const { state } = useSidebar()
  const href = useLocation({ select: (location) => location.href })
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`

          if (!item.items)
            return <SidebarMenuLink key={key} item={item} href={href} />

          if (state === 'collapsed')
            return (
              <SidebarMenuCollapsedDropdown key={key} item={item} href={href} />
            )

          return <SidebarMenuCollapsible key={key} item={item} href={href} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

const NavBadge = ({ children, variant = 'secondary' }: { 
  children: ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}) => (
  <Badge 
    variant={variant} 
    className='bg-secondary text-white hover:bg-secondary/90 rounded-full px-2 py-0 text-xs ml-auto shadow-sm'
  >
    {children}
  </Badge>
)

// Composant pour afficher les compteurs sous forme de sous-menu
const CountersSubMenu = ({ counters, baseUrl }: { 
  counters: NavItemCounter[]
  baseUrl: string 
}) => {
  const { setOpenMobile } = useSidebar()
  
  const getStatusUrl = (key: string) => {
    if (key === 'all' || key === 'total') return baseUrl
    
    // Mapping des clés vers les paramètres d'URL
    const statusMap: Record<string, string> = {
      'open': 'opened',
      'realized': 'realized', 
      'edited': 'edited',
      'validated': 'validated',
      'closed': 'closed',
      'active': 'active',
      'inactive': 'inactive'
    }
    
    const status = statusMap[key] || key
    return `${baseUrl}?status=${status}`
  }

  const getCounterLabel = (key: string) => {
    const labelMap: Record<string, string> = {
      'all': 'Tous les dossiers',
      'open': 'Dossiers ouverts',
      'realized': 'Dossiers réalisés',
      'edited': 'Dossiers rédigés', 
      'validated': 'Dossiers validés',
      'closed': 'Dossiers fermés',
      'total': 'Total',
      'active': 'Actifs',
      'inactive': 'Inactifs'
    }
    return labelMap[key] || key
  }

  return (
    <SidebarMenuSub>
      {counters.map((counter) => (
        <SidebarMenuSubItem key={counter.key}>
          <SidebarMenuSubButton asChild>
            <Link 
              to={getStatusUrl(counter.key)} 
              onClick={() => setOpenMobile(false)}
              className="flex items-center justify-between w-full"
            >
              <span className="text-xs">{getCounterLabel(counter.key)}</span>
              <NavBadge variant={counter.variant}>
                {counter.value}
              </NavBadge>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  )
}

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { setOpenMobile } = useSidebar()
  
  // Si l'élément a des compteurs, on l'affiche comme un collapsible
  if (item.showCounters && item.dynamicCounters && item.dynamicCounters.length > 0) {
    return (
      <Collapsible
        asChild
        defaultOpen={checkIsActive(href, item, true)}
        className='group/collapsible'
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              {item.badge && <NavBadge>{item.badge}</NavBadge>}
              <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className='CollapsibleContent'>
            <CountersSubMenu counters={item.dynamicCounters} baseUrl={item.url || ''} />
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  // Affichage normal sans compteurs
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={item.title}
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

const SidebarMenuCollapsible = ({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) => {
  const { setOpenMobile } = useSidebar()
  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(href, item, true)}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub>
            {item.items.map((subItem) => {
              // Si le sous-élément a des compteurs, on l'affiche différemment
              if (subItem.showCounters && subItem.dynamicCounters && subItem.dynamicCounters.length > 0) {
                return (
                  <SidebarMenuSubItem key={subItem.title}>
                    <Collapsible
                      asChild
                      defaultOpen={checkIsActive(href, subItem, true)}
                      className='group/subcollapsible'
                    >
                      <div>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuSubButton className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </div>
                            <ChevronDown className='h-3 w-3 transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-180' />
                          </SidebarMenuSubButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className='CollapsibleContent ml-4'>
                                                     <CountersSubMenu counters={subItem.dynamicCounters} baseUrl={subItem.url || ''} />
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  </SidebarMenuSubItem>
                )
              }
              
              // Affichage normal
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={checkIsActive(href, subItem)}
                  >
                    <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                      {subItem.icon && <subItem.icon />}
                      <span>{subItem.title}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

const SidebarMenuCollapsedDropdown = ({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(href, item)}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side='right' 
          align='start' 
          sideOffset={4}
          className="bg-white border-primary/20 shadow-lg"
        >
          <DropdownMenuLabel className="text-primary font-semibold">
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-primary/20" />
          {item.items.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link
                to={sub.url}
                className={`hover:bg-primary hover:text-white ${checkIsActive(href, sub) ? 'bg-secondary text-white' : ''}`}
              >
                {sub.icon && <sub.icon />}
                <span className='max-w-52 text-wrap'>{sub.title}</span>
                {sub.badge && (
                  <span className='ml-auto text-xs bg-secondary text-white px-1 rounded'>{sub.badge}</span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  return (
    href === item.url || // /endpint?search=param
    href.split('?')[0] === item.url || // endpoint
    !!item?.items?.filter((i) => i.url === href).length || // if child nav is active
    (mainNav &&
      href.split('/')[1] !== '' &&
      href.split('/')[1] === item?.url?.split('/')[1])
  )
}
