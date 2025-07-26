import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  IconArrowRightDashed,
  IconChevronRight,
  IconDeviceLaptop,
  IconMoon,
  IconSun,
} from '@tabler/icons-react'
import { useSearch } from '@/context/search-context'
import { useTheme } from '@/context/theme-context'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { sidebarData } from './layout/data/sidebar-data'
import { ScrollArea } from './ui/scroll-area'
import { useACLNavFilter } from './layout/acl-sidebar-filter'
import { useSidebarCounters } from './layout/sidebar-counters-hook'
import { Badge } from './ui/badge'

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()
  const { filterNavGroups } = useACLNavFilter()
  const { applyCountersToNavGroups } = useSidebarCounters()

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  // Filtrer et appliquer les compteurs aux groupes de navigation
  const filteredNavGroups = filterNavGroups(sidebarData.navGroups)
  const navGroupsWithCounters = applyCountersToNavGroups(filteredNavGroups)

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pr-1'>
          <CommandEmpty>No results found.</CommandEmpty>
          {navGroupsWithCounters.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url) {
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => navigate({ to: navItem.url }))
                      }}
                    >
                      <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                        <IconArrowRightDashed className='text-muted-foreground/80 size-2' />
                      </div>
                      <span className="flex-1">{navItem.title}</span>
                      {navItem.showCounters && navItem.dynamicCounters && navItem.dynamicCounters.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {navItem.dynamicCounters.find(c => c.key === 'all' || c.key === 'total')?.value || 0}
                        </Badge>
                      )}
                    </CommandItem>
                  )
                }

                return navItem.items?.map((subItem, j) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${j}`}
                    value={`${navItem.title}-${subItem.url}`}
                    onSelect={() => {
                      runCommand(() => navigate({ to: subItem.url }))
                    }}
                  >
                    <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                      <IconArrowRightDashed className='text-muted-foreground/80 size-2' />
                    </div>
                    <span className="flex-1">
                      {navItem.title} <IconChevronRight className="inline h-3 w-3" /> {subItem.title}
                    </span>
                    {subItem.showCounters && subItem.dynamicCounters && subItem.dynamicCounters.length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {subItem.dynamicCounters.find(c => c.key === 'all' || c.key === 'total')?.value || 0}
                      </Badge>
                    )}
                  </CommandItem>
                ))
              })}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading='Theme'>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <IconSun /> <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <IconMoon className='scale-90' />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <IconDeviceLaptop />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
