import { useState } from 'react'
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
import { Eye, Edit, Trash2, Search } from 'lucide-react'
import { useVehicleGenresStore } from '@/stores/vehicleGenresStore'
import { VehicleGenre } from '@/services/vehicleGenreService'

interface DataTableProps {
  onView: (vehicleGenre: VehicleGenre) => void
  onEdit: (vehicleGenre: VehicleGenre) => void
  onDelete: (vehicleGenre: VehicleGenre) => void
}

export function DataTable({ onView, onEdit, onDelete }: DataTableProps) {
  const { vehicleGenres, loading } = useVehicleGenresStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredVehicleGenres = vehicleGenres.filter(genre =>
    genre.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    genre.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    genre.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des genres de véhicules...</p>
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
            placeholder="Rechercher un genre..."
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
              <TableHead>Code</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicleGenres.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucun genre de véhicule trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicleGenres.map((genre) => (
                <TableRow key={genre.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {genre.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{genre.label}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {genre.description}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={genre.status.code === 'active' ? 'default' : 'secondary'}
                    >
                      {genre.status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(genre)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(genre)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(genre)}
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
    </div>
  )
} 