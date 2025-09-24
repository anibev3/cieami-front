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
import { Eye, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useVehicleAgesStore } from '@/stores/vehicleAgesStore'
import { VehicleAge } from '@/services/vehicleAgeService'

interface DataTableProps {
  onView: (vehicleAge: VehicleAge) => void
  onEdit: (vehicleAge: VehicleAge) => void
  onDelete: (vehicleAge: VehicleAge) => void
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    from: number
    to: number
    total: number
  }
  searchQuery: string
  onSearchChange: (value: string) => void
  onPageChange: (page: number) => void
}

export function DataTable({ 
  onView, 
  onEdit, 
  onDelete, 
  pagination, 
  searchQuery, 
  onSearchChange, 
  onPageChange 
}: DataTableProps) {
  const { vehicleAges, loading } = useVehicleAgesStore()

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des âges de véhicules..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
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
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 5 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des âges de véhicules..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
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
            {vehicleAges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucun âge de véhicule trouvé
                </TableCell>
              </TableRow>
            ) : (
              vehicleAges.map((age) => (
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

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Affichage de {pagination.from} à {pagination.to} sur {pagination.total} âges de véhicules
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.currentPage} sur {pagination.lastPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.lastPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 