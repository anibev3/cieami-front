import { useEffect } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { sidebarData } from './data/sidebar-data'
import { useACLNavFilter } from './acl-sidebar-filter'
import { useSidebarCounters } from './sidebar-counters-hook'
import { useDashboardStore } from '@/stores/dashboard'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { filterNavGroups } = useACLNavFilter()
  const { applyCountersToNavGroups } = useSidebarCounters()
  const { fetchStats } = useDashboardStore()
  
  // Charger les statistiques au montage pour les compteurs
  useEffect(() => {
    fetchStats()
  }, [fetchStats])
  
  // Filtrer les groupes de navigation selon les permissions ACL
  const filteredNavGroups = filterNavGroups(sidebarData.navGroups)
  
  // Appliquer les compteurs dynamiques
  const navGroupsWithCounters = applyCountersToNavGroups(filteredNavGroups)
  
  return (
    <Sidebar collapsible='icon' variant='sidebar' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {navGroupsWithCounters.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
