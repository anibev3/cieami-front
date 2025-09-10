import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  perPage: number
  onPageChange: (page: number) => void
  loading?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
  loading = false
}: PaginationProps) {
  const startItem = (currentPage - 1) * perPage + 1
  const endItem = Math.min(currentPage * perPage, totalItems)

  // Calculer les pages à afficher
  const getVisiblePages = () => {
    const delta = 2 // Nombre de pages à afficher de chaque côté de la page courante
    const pages: number[] = []
    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

    // Toujours afficher la première page
    if (totalPages > 0) pages.push(1)

    // Ajouter "..." si nécessaire
    if (rangeStart > 2) {
      pages.push(-1) // -1 représente "..."
    }

    // Pages du milieu
    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }

    // Ajouter "..." si nécessaire
    if (rangeEnd < totalPages - 1) {
      pages.push(-1) // -1 représente "..."
    }

    // Toujours afficher la dernière page
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  const visiblePages = getVisiblePages()

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        Affichage de {startItem} à {endItem} sur {totalItems} résultats
      </div>
      <div className="flex items-center space-x-2">
        {/* Première page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || loading}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Page précédente */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Pages */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            page === -1 ? (
              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                disabled={loading}
                className="min-w-[2.5rem]"
              >
                {page}
              </Button>
            )
          ))}
        </div>

        {/* Page suivante */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Dernière page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || loading}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
