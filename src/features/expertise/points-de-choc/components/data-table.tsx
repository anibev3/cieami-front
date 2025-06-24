import { ShockPoint } from '@/types/shock-points'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { ShockPointViewDialog } from './shock-point-view-dialog'
import { ShockPointMutateDialog } from './shock-point-mutate-dialog'
import { ShockPointDeleteDialog } from './shock-point-delete-dialog'

interface DataTableProps {
  data: ShockPoint[]
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
            <TableHead>Code</TableHead>
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
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
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
            <TableHead>Code</TableHead>
            <TableHead>Libellé</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead>Modifié le</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((shockPoint) => (
            <TableRow key={shockPoint.id}>
              <TableCell>{shockPoint.code}</TableCell>
              <TableCell>{shockPoint.label}</TableCell>
              <TableCell>{shockPoint.description}</TableCell>
              <TableCell>{shockPoint.status?.label}</TableCell>
              <TableCell>{new Date(shockPoint.created_at).toLocaleString()}</TableCell>
              <TableCell>{new Date(shockPoint.updated_at).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setViewId(shockPoint.id)}>Voir</Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditId(shockPoint.id)}>Modifier</Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(shockPoint.id)}>Supprimer</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ShockPointViewDialog id={viewId} onOpenChange={() => setViewId(null)} />
      <ShockPointMutateDialog id={editId} onOpenChange={() => setEditId(null)} />
      <ShockPointDeleteDialog id={deleteId} onOpenChange={() => setDeleteId(null)} />
    </>
  )
} 