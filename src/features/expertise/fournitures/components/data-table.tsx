import { Supply } from '@/types/supplies'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { SupplyViewDialog } from './supply-view-dialog'
import { SupplyMutateDialog } from './supply-mutate-dialog'
import { SupplyDeleteDialog } from './supply-delete-dialog'

interface DataTableProps {
  data: Supply[]
  loading: boolean
}

export function DataTable({ data, loading }: DataTableProps) {
  const [viewId, setViewId] = useState<number | null>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  if (loading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libellé</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead>Modifié le</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-8 w-24" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libellé</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead>Modifié le</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((supply) => (
            <TableRow key={supply.id}>
              <TableCell>{supply.label}</TableCell>
              <TableCell>{supply.description}</TableCell>
              <TableCell>{supply.status?.label}</TableCell>
              <TableCell>{new Date(supply.created_at).toLocaleString()}</TableCell>
              <TableCell>{new Date(supply.updated_at).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setViewId(supply.id)}>Voir</Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditId(supply.id)}>Modifier</Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(supply.id)}>Supprimer</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SupplyViewDialog id={viewId} onOpenChange={() => setViewId(null)} />
      <SupplyMutateDialog id={editId} onOpenChange={() => setEditId(null)} />
      <SupplyDeleteDialog id={deleteId} onOpenChange={() => setDeleteId(null)} />
    </>
  )
} 