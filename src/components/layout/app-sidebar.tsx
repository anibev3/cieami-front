import { useEffect } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
// import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { sidebarData } from './data/sidebar-data'
// import { useACLNavFilter } from './acl-sidebar-filter'
// import { useSidebarCounters } from './sidebar-counters-hook'
import { useDashboardStore } from '@/stores/dashboard'
import { AppSidebarTwoPanel } from './app-sidebar-two-panel'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const { filterNavGroups } = useACLNavFilter()
  // const { applyCountersToNavGroups } = useSidebarCounters()
  const { fetchStats } = useDashboardStore()
  
  // Charger les statistiques au montage pour les compteurs
  useEffect(() => {
    fetchStats()
  }, [fetchStats])
  
  // Filtrer les groupes de navigation selon les permissions ACL
  // const filteredNavGroups = filterNavGroups(sidebarData.navGroups)
  
  // Appliquer les compteurs dynamiques
  // const navGroupsWithCounters = applyCountersToNavGroups(filteredNavGroups)
  
  // Utiliser la nouvelle sidebar à deux panneaux
  return (
    <Sidebar collapsible='none' variant='sidebar' className="h-screen" {...props}>
      <SidebarHeader className="relative border-b border-gray-200 shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-secondary/5 rounded-lg -z-10"></div>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      
      <SidebarContent className="relative p-0 flex-1 overflow-hidden">
        <AppSidebarTwoPanel className="h-full" />
      </SidebarContent>
      
      <SidebarFooter className="relative border-t border-gray-200 shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-primary-700/20 to-transparent -z-10"></div>
        <NavUser />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}
