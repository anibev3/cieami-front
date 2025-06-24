import { ExpertiseType } from '@/types/expertise-types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { ExpertiseTypeViewDialog } from './expertise-type-view-dialog'
import { ExpertiseTypeMutateDialog } from './expertise-type-mutate-dialog'
import { ExpertiseTypeDeleteDialog } from './expertise-type-delete-dialog'

interface DataTableProps {
  data: ExpertiseType[]
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
          {data.map((expertiseType) => (
            <TableRow key={expertiseType.id}>
              <TableCell>{expertiseType.code}</TableCell>
              <TableCell>{expertiseType.label}</TableCell>
              <TableCell>{expertiseType.description}</TableCell>
              <TableCell>{expertiseType.status?.label}</TableCell>
              <TableCell>{new Date(expertiseType.created_at).toLocaleString()}</TableCell>
              <TableCell>{new Date(expertiseType.updated_at).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setViewId(expertiseType.id)}>Voir</Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditId(expertiseType.id)}>Modifier</Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(expertiseType.id)}>Supprimer</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ExpertiseTypeViewDialog id={viewId} onOpenChange={() => setViewId(null)} />
      <ExpertiseTypeMutateDialog id={editId} onOpenChange={() => setEditId(null)} />
      <ExpertiseTypeDeleteDialog id={deleteId} onOpenChange={() => setDeleteId(null)} />
    </>
  )
} 