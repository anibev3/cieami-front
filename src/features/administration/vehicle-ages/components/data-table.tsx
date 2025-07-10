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
import { useVehicleAgesStore } from '@/stores/vehicleAgesStore'
import { VehicleAge } from '@/services/vehicleAgeService'

interface DataTableProps {
  onView: (vehicleAge: VehicleAge) => void
  onEdit: (vehicleAge: VehicleAge) => void
  onDelete: (vehicleAge: VehicleAge) => void
}

export function DataTable({ onView, onEdit, onDelete }: DataTableProps) {
  const { vehicleAges, loading } = useVehicleAgesStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredVehicleAges = vehicleAges.filter(age =>
    age.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    age.value.toString().includes(searchTerm) ||
    age.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des âges de véhicules...</p>
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
            placeholder="Rechercher un âge..."
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
              <TableHead>Valeur (mois)</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicleAges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucun âge de véhicule trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicleAges.map((age) => (
                <TableRow key={age.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {age.value} mois
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{age.label}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {age.description}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={age.status.code === 'active' ? 'default' : 'secondary'}
                    >
                      {age.status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(age)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(age)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(age)}
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