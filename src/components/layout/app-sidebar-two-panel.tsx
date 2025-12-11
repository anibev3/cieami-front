import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { ChevronRight, ExternalLink } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { sidebarTwoPanelData } from './data/sidebar-two-panel-data'
import { SidebarMenuItem } from './types'
import { useACL } from '@/hooks/useACL'

interface AppSidebarTwoPanelProps {
  className?: string
}

export function AppSidebarTwoPanel({ className }: AppSidebarTwoPanelProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const location = useLocation()
  const navigate = useNavigate()
  const { hasPermission, isInitialized } = useACL()

  // Trouver la catégorie active basée sur l'URL actuelle
  useEffect(() => {
    const currentPath = location.pathname
    
    // Trouver la catégorie qui correspond à l'URL actuelle
    for (const category of sidebarTwoPanelData.mainCategories) {
      // Si la catégorie a une URL directe
      if (category.url && currentPath === String(category.url)) {
        setActiveCategoryId(category.id)
        return
      }
      
      // Vérifier les sections et items
      if (category.sections) {
        for (const section of category.sections) {
          for (const item of section.items) {
            if (item.url) {
              const itemUrl = String(item.url)
              // Correspondance exacte ou chemin qui commence par l'URL de l'item
              if (currentPath === itemUrl || currentPath.startsWith(itemUrl + '/')) {
                setActiveCategoryId(category.id)
                // Ouvrir la section correspondante
                setExpandedSections(prev => new Set(prev).add(`${category.id}-${section.title}`))
                return
              }
            }
          }
        }
      }
    }
  }, [location.pathname])

  // Filtrer les catégories selon les permissions
  const filteredCategories = sidebarTwoPanelData.mainCategories.filter(category => {
    if (!isInitialized) {
      return !category.requiredPermission
    }
    
    if (category.requiredPermission && !hasPermission(category.requiredPermission)) {
      return false
    }
    
    // Si la catégorie a des sections, vérifier qu'au moins une section a des items accessibles
    if (category.sections) {
      const hasAccessibleItems = category.sections.some(section =>
        section.items.some(item => {
          if (!isInitialized) return !item.requiredPermission
          return !item.requiredPermission || hasPermission(item.requiredPermission)
        })
      )
      return hasAccessibleItems
    }
    
    return true
  })

  // Filtrer les items selon les permissions
  const filterSectionItems = (items: SidebarMenuItem[]): SidebarMenuItem[] => {
    return items.filter(item => {
      if (!isInitialized) {
        return !item.requiredPermission
      }
      return !item.requiredPermission || hasPermission(item.requiredPermission)
    })
  }

  const toggleSection = (categoryId: string, sectionTitle: string) => {
    const key = `${categoryId}-${sectionTitle}`
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const isSectionExpanded = (categoryId: string, sectionTitle: string) => {
    return expandedSections.has(`${categoryId}-${sectionTitle}`)
  }

  const isItemActive = (url: string | undefined) => {
    if (!url) return false
    const currentPath = location.pathname
    const itemUrl = String(url)
    // Correspondance exacte ou chemin qui commence par l'URL de l'item suivi de /
    return currentPath === itemUrl || currentPath.startsWith(itemUrl + '/')
  }

  // Si aucune catégorie n'est active, activer la première par défaut
  useEffect(() => {
    if (!activeCategoryId && filteredCategories.length > 0) {
      const firstCategory = filteredCategories[0]
      if (firstCategory.sections && firstCategory.sections.length > 0) {
        setActiveCategoryId(firstCategory.id)
        // Ouvrir la première section par défaut
        if (firstCategory.sections[0]) {
          setExpandedSections(prev => new Set(prev).add(`${firstCategory.id}-${firstCategory.sections![0].title}`))
        }
      } else if (firstCategory.url) {
        setActiveCategoryId(firstCategory.id)
      }
    }
  }, [activeCategoryId, filteredCategories])

  const activeCategory = filteredCategories.find(cat => cat.id === activeCategoryId)

  return (
    <div className={cn('flex h-full bg-white border-r border-gray-200', className)}>
      {/* Panneau gauche - Icônes principales */}
      <div className="bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4 space-y-3 overflow-y-auto px-1">
        {filteredCategories.map((category) => {
          const Icon = category.icon
          const isActive = activeCategoryId === category.id
          
          return (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategoryId(category.id)
                // Si la catégorie a une URL directe, naviguer
                if (category.url) {
                  navigate({ to: category.url })
                } else if (category.sections && category.sections.length > 0) {
                  // Ouvrir la première section par défaut
                  const firstSection = category.sections[0]
                  if (firstSection) {
                    setExpandedSections(prev => new Set(prev).add(`${category.id}-${firstSection.title}`))
                  }
                }
              }}
              className={cn(
                'h-12 w-16 flex flex-col items-center justify-center rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-blue-600 text-white scale-105 pb-1'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
              title={category.title}
            >
              <Icon className={cn(
                'h-6 w-4 transition-transform duration-200',
                isActive && 'scale-110'
              )} />
              <span className={cn(
                'mt-1 text-[10px] font-medium text-center leading-tight max-w-full px-1',
                isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'
              )}>
                {category.title}
              </span>
              {isActive && (
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-l-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Panneau droit - Menus et sous-menus */}
      <div className="flex-1 w-60 bg-white overflow-y-auto flex flex-col">
        {/* Header avec titre de la catégorie active */}
        {activeCategory && (
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              {activeCategory.icon && (
                <activeCategory.icon className="h-5 w-5 text-blue-600" />
              )}
              {activeCategory.title}
            </h3>
          </div>
        )}
        
        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          {activeCategory && activeCategory.sections ? (
            <div className="py-5 space-y-1">
            {activeCategory.sections.map((section) => {
              const filteredItems = filterSectionItems(section.items)
              
              if (filteredItems.length === 0) return null
              
              const isExpanded = isSectionExpanded(activeCategory.id, section.title)
              
              // Vérifier si un item de cette section est actif
              const hasActiveItem = filteredItems.some(item => isItemActive(item.url))
              
              return (
                <Collapsible
                  key={section.title}
                  open={isExpanded || hasActiveItem}
                  onOpenChange={() => toggleSection(activeCategory.id, section.title)}
                  className="group/collapsible"
                >
                  <CollapsibleTrigger className="w-full">
                    <div className={cn(
                      "flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors cursor-pointer group",
                      hasActiveItem && !isExpanded
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    )}>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn(
                          'h-3.5 w-3.5 text-gray-400 transition-transform duration-200 group-hover:text-gray-600',
                          (isExpanded || hasActiveItem) && 'rotate-90 text-blue-600'
                        )} />
                        <span className={cn(
                          "text-sm font-semibold",
                          hasActiveItem ? "text-blue-700" : "text-gray-900"
                        )}>
                          {section.title}
                        </span>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="CollapsibleContent">
                    <div className="ml-6 mt-1 space-y-0.5 border-l border-gray-200 px-2">
                      {filteredItems.map((item) => {
                        const ItemIcon = item.icon
                        const isActive = isItemActive(item.url)
                        
                        return (
                          <Link
                            key={item.title}
                            to={item.url}
                            className={cn(
                              'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150 relative',
                              isActive
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            )}
                          >
                            {isActive && (
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 -translate-x-4 w-0.5 h-6 bg-blue-600 rounded-full" />  
                            )}
                            {ItemIcon && (
                              <ItemIcon className={cn(
                                "h-4 w-4 flex-shrink-0",
                                isActive ? "text-blue-600" : "text-gray-500"
                              )} />
                            )}
                            <span className="flex-1">{item.title}</span>
                            {item.url && item.url.toString().startsWith('http') && (
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
            </div>
          ) : activeCategory && activeCategory.url ? (
            // Si la catégorie a une URL directe sans sections
            <div className="p-4">
              <Link
                to={activeCategory.url}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors"
              >
                {activeCategory.title}
              </Link>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              Sélectionnez une catégorie
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
