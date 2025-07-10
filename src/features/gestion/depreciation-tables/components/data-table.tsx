import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Eye, Edit, Trash2, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useDepreciationTablesStore } from '@/stores/depreciationTablesStore'
import { DepreciationTable } from '@/services/depreciationTableService'

interface DataTableProps {
  onView: (depreciationTable: DepreciationTable) => void
  onEdit: (depreciationTable: DepreciationTable) => void
  onDelete: (depreciationTable: DepreciationTable) => void
}

export function DataTable({ onView, onEdit, onDelete }: DataTableProps) {
  const { 
    depreciationTables, 
    loading, 
    fetchDepreciationTables,
    pagination 
  } = useDepreciationTablesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Charger les données initiales au montage du composant
  useEffect(() => {
    fetchDepreciationTables({ 
      page: 1, 
      per_page: 20
    })
  }, [fetchDepreciationTables])

  // Charger les données avec pagination
  useEffect(() => {
    if (currentPage > 1) {
      fetchDepreciationTables({ 
        page: currentPage, 
        per_page: 20,
        search: searchTerm || undefined 
      })
    }
  }, [currentPage, fetchDepreciationTables])

  // Gestionnaire de recherche avec délai
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1) // Retour à la première page lors d'une recherche
      fetchDepreciationTables({ 
        page: 1, 
        per_page: 20,
        search: searchTerm || undefined
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, fetchDepreciationTables])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des tableaux de dépréciation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un tableau..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Genre de véhicule</TableHead>
              <TableHead>Âge du véhicule</TableHead>
              <TableHead>Taux de dépréciation</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {depreciationTables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucun tableau de dépréciation trouvé
                </TableCell>
              </TableRow>
            ) : (
              depreciationTables.map((table: DepreciationTable) => (
                <TableRow key={table.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{table.vehicle_genre.label}</span>
                      <Badge variant="outline" className="w-fit text-xs">
                        {table.vehicle_genre.code}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{table.vehicle_age.label}</span>
                      <Badge variant="outline" className="w-fit text-xs font-mono">
                        {table.vehicle_age.value} mois
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {table.value}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={table.status.code === 'active' ? 'default' : 'secondary'}
                    >
                      {table.status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(table)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(table)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(table)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Affichage de {pagination.from} à {pagination.to} sur {pagination.total} résultats
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                const page = Math.max(1, Math.min(pagination.last_page - 4, currentPage - 2)) + i
                if (page > pagination.last_page) return null
                
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8"
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.last_page}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.last_page)}
              disabled={currentPage === pagination.last_page}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 