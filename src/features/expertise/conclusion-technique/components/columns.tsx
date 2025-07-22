/* eslint-disable no-console */
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { TechnicalConclusion } from "@/types/technical-conclusions"

interface ColumnsProps {
  onView?: (id: number) => void
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnsProps): ColumnDef<TechnicalConclusion>[] => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const code = row.getValue("code") as string
      return (
        <Badge variant="secondary" className="font-mono">
          {code}
        </Badge>
      )
    },
  },
  {
    accessorKey: "label",
    header: "Libellé",
    cell: ({ row }) => {
      const label = row.getValue("label") as string
      return (
        <div className="font-medium">
          {label}
        </div>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="text-sm text-muted-foreground max-w-md truncate">
          {description}
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Créé le",
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(createdAt).toLocaleDateString('fr-FR')}
        </div>
      )
    },
  },
  {
    accessorKey: "updated_at",
    header: "Modifié le",
    cell: ({ row }) => {
      const updatedAt = row.getValue("updated_at") as string
      const createdAt = row.getValue("created_at") as string
      return (
        <div className="text-sm text-muted-foreground">
          {updatedAt !== createdAt 
            ? new Date(updatedAt).toLocaleDateString('fr-FR')
            : '-'
          }
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const conclusion = row.original

      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onView?.(conclusion.id)}
            title="Voir les détails"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit?.(conclusion.id)}
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete?.(conclusion.id)}
            title="Supprimer"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
] 