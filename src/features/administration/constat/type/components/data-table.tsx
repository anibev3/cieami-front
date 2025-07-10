import { useState, useEffect } from 'react'
import { useAscertainmentTypeStore } from '@/stores/ascertainmentTypes'
import { AscertainmentType } from '@/services/ascertainmentTypeService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Search, Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { formatDate } from '@/utils/format-date'
import { useDebounce } from '@/hooks/use-debounce'

interface DataTableProps {
  onView: (item: AscertainmentType) => void
  onEdit: (item: AscertainmentType) => void
  onDelete: (item: AscertainmentType) => void
  onCreate: () => void
}

export function AscertainmentTypeDataTable({
  onView,
  onEdit,
  onDelete,
  onCreate
}: DataTableProps) {
  const {
    ascertainmentTypes,
    loading,
    pagination,
    fetchAscertainmentTypes
  } = useAscertainmentTypeStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    fetchAscertainmentTypes({
      search: debouncedSearchTerm,
      page: currentPage,
      per_page: 20
    })
  }, [debouncedSearchTerm, currentPage, fetchAscertainmentTypes])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getStatusBadgeVariant = (statusCode: string) => {
    switch (statusCode) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (loading && ascertainmentTypes.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des types de constat...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Types de constat</CardTitle>
          <Button onClick={onCreate} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau type
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un type de constat..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ascertainmentTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm ? 'Aucun type de constat trouvé' : 'Aucun type de constat disponible'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                ascertainmentTypes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">
                      {item.code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.label}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.status.code)}>
                        {item.status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(item.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(item)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDelete(item)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && pagination.lastPage > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Affichage de {pagination.from} à {pagination.to} sur {pagination.total} résultats
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <div className="text-sm">
                Page {currentPage} sur {pagination.lastPage}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.lastPage}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 