import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  perPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
  loading?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onPerPageChange,
  loading = false
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {totalItems > 0 ? (
          <>
            Affichage de {((currentPage - 1) * perPage) + 1} à{' '}
            {Math.min(currentPage * perPage, totalItems)} sur {totalItems} paiement(s)
          </>
        ) : (
          'Aucun paiement trouvé'
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Bouton première page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage || loading}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        
        {/* Bouton page précédente */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage || loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Numéros de pages */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-2 py-1 text-sm text-muted-foreground">...</span>
              ) : (
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  disabled={loading}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Bouton page suivante */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || loading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {/* Bouton dernière page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage || loading}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Sélecteur de lignes par page */}
      {onPerPageChange && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Lignes par page</span>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            disabled={loading}
            className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
