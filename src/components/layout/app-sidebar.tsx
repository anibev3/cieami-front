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
      {/* Header avec gradient décoratif */}
      <SidebarHeader className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-secondary/5 rounded-lg -z-10"></div>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      
      {/* Contenu principal avec effet glassmorphism */}
      <SidebarContent className="relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        {navGroupsWithCounters.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      
      {/* Footer avec accent */}
      <SidebarFooter className="relative border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-t from-primary-700/20 to-transparent -z-10"></div>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}
