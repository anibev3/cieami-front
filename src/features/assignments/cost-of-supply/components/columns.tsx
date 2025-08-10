import { ColumnDef } from "@tanstack/react-table"
import { SupplyPrice } from "@/types/supplies"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const formatCurrency = (amount: string) => {
  return parseFloat(amount).toLocaleString('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

export const getStatusBadge = (supplyPrice: SupplyPrice) => {
  const hasNewPrice = parseFloat(supplyPrice.new_amount) > 0
  const hasObsolescence = parseFloat(supplyPrice.obsolescence_rate) > 0
  const hasRecovery = parseFloat(supplyPrice.recovery_amoun) > 0

  if (hasNewPrice) return <Badge className="bg-green-100 text-green-800">Nouveau</Badge>
  if (hasObsolescence) return <Badge className="bg-red-100 text-red-800">Obsolète</Badge>
  if (hasRecovery) return <Badge className="bg-blue-100 text-blue-800">Récupération</Badge>
  return <Badge variant="secondary">Standard</Badge>
}

export const getOperationIcons = (supplyPrice: SupplyPrice) => {
  const operations = []
  if (supplyPrice.disassembly) operations.push('Démontage')
  if (supplyPrice.replacement) operations.push('Remplacement')
  if (supplyPrice.repair) operations.push('Réparation')
  if (supplyPrice.paint) operations.push('Peinture')
  if (supplyPrice.control) operations.push('Contrôle')
  return operations
}

export const createColumns = (onViewDetails: (supplyPrice: SupplyPrice) => void): ColumnDef<SupplyPrice>[] => [

  {
    accessorKey: "supply.label",
    header: "Fourniture",
    cell: ({ row }) => {
      const supplyPrice = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium">{supplyPrice.supply.label}</span>
          <span className="text-xs text-muted-foreground">ID: {supplyPrice.supply.id}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "new_amount",
    header: "Prix neuf",
    cell: ({ row }) => {
      const supplyPrice = row.original
      return (
        <div className="font-semibold text-green-600">
          {formatCurrency(supplyPrice?.new_amount_excluding_tax || '0')}
        </div>
      )
    },
  },
  {
    accessorKey: "obsolescence_rate",
    header: "Dossier",
    cell: ({ row }) => {
      const supplyPrice = row.original
      return (
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">
            {supplyPrice?.shock?.assignment?.reference}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "recovery_amoun",
    header: "Réparateur",
    cell: ({ row }) => {
      const supplyPrice = row.original
      return (
        <div className="flex flex-col">
          {supplyPrice?.shock?.assignment?.repairer?.name || ''}
          {/* <span className="font-semibold text-blue-600">{rate}%</span>
          <span className="text-xs text-muted-foreground">
            {formatCurrency(supplyPrice.recovery_amount)}
          </span> */}
        </div>
      )
    },
  },
  {
    accessorKey: "operations",
    header: "Opérations",
    cell: ({ row }) => {
      const supplyPrice = row.original
      const operations = getOperationIcons(supplyPrice)
      return (
        <div className="flex flex-wrap gap-1">
          {operations.map((op, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {op}
            </Badge>
          ))}
        </div>
      )
    },
  },
  // {
  //   accessorKey: "status",
  //   header: "Statut",
  //   cell: ({ row }) => {
  //     const supplyPrice = row.original
  //     return getStatusBadge(supplyPrice)
  //   },
  // },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const supplyPrice = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onViewDetails(supplyPrice)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              Voir les détails
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 