import { useState } from 'react'
import { useClaimNatureStore } from '@/stores/claimNatureStore'
import { ClaimNature } from '@/types/administration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  Loader2,
  AlertTriangle
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface DataTableProps {
  onView: (claimNature: ClaimNature) => void
  onEdit: (claimNature: ClaimNature) => void
  onDelete: (claimNature: ClaimNature) => void
  onCreate: () => void
}

export function DataTable({ onView, onEdit, onDelete, onCreate }: DataTableProps) {
  const { claimNatures, loading, error } = useClaimNatureStore()
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrer les natures de sinistres basé sur la recherche
  const filteredClaimNatures = claimNatures.filter(claimNature =>
    claimNature.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claimNature.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claimNature.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement des natures de sinistres...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-500">{error}</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Natures de sinistres ({claimNatures.length})</CardTitle>
          <Button onClick={onCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une nature de sinistre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClaimNatures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucune nature de sinistre trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredClaimNatures.map((claimNature) => (
                <TableRow key={claimNature.id}>
                  <TableCell className="font-mono text-sm">
                    {claimNature.code}
                  </TableCell>
                  <TableCell className="font-medium">
                    {claimNature.label}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {claimNature.description}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={claimNature.status.code === 'active' ? 'default' : 'secondary'}
                      className={claimNature.status.code === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {claimNature.status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(claimNature.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(claimNature)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(claimNature)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(claimNature)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
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
      </CardContent>
    </Card>
  )
} 