import { useState } from 'react'
import { useRemarkStore } from '@/stores/remarkStore'
import { Remark } from '@/types/administration'
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
  onView: (remark: Remark) => void
  onEdit: (remark: Remark) => void
  onDelete: (remark: Remark) => void
  onCreate: () => void
}

export function DataTable({ onView, onEdit, onDelete, onCreate }: DataTableProps) {
  const { remarks, loading, error } = useRemarkStore()
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrer les remarques basé sur la recherche
  const filteredRemarks = remarks.filter(remark =>
    remark.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement des remarques...</span>
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
          <CardTitle>Remarques experts ({remarks.length})</CardTitle>
          <Button onClick={onCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une remarque..."
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
              <TableHead>Label</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRemarks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucune remarque trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredRemarks.map((remark) => (
                <TableRow key={remark.id}>
                  <TableCell className="font-medium">
                    {remark.label}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={remark.description}>
                      <div 
                        className="text-sm text-muted-foreground line-clamp-2"
                        dangerouslySetInnerHTML={{ 
                          __html: remark.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...' 
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={remark.status.label === 'Actif(ve)' ? 'default' : 'secondary'}
                      className={remark.status.label === 'Actif(ve)' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {remark.status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(remark.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(remark)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(remark)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(remark)}
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