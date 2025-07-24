/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
// import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/format-currency'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Checkbox } from '@/components/ui/checkbox'

// Type combiné pour les données de statistiques
export type StatisticsData = {
  year: number
  month: number
  count: number
  amount: number
  countPercentage: number
  amountPercentage: number
  // Données des filtres (si disponibles)
  assignment_type?: any
  expertise_type?: any
  vehicle?: any
  repairer?: any
  client?: any
  insurer?: any
  status?: any
  created_by?: any
  realized_by?: any
  edited_by?: any
  validated_by?: any
  directed_by?: any
  claim_nature?: any
}

export const createStatisticsColumns = (): ColumnDef<StatisticsData>[] => [

  {
    accessorKey: 'check',
    header: '',
    cell: ({ row }) => (
      <div className="font-medium">
        <Checkbox 
          checked={row.getValue('checked')}
          onCheckedChange={() => {
            row.toggleSelected()
          }}
        />
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'year',
    header: 'Année',
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue('year')}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'month',
    header: 'Mois',
    cell: ({ row }) => {
      const month = row.getValue('month') as number
      const date = new Date(2024, month - 1, 1)
      return (
        <div className="capitalize font-medium">
          {format(date, 'MMMM', { locale: fr })}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'count',
    header: 'Nombre de dossiers',
    cell: ({ row }) => (
      <div className="">
        {row.getValue('count')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'countPercentage',
    header: '% Dossiers',
    cell: ({ row }) => {
      const percentage = row.getValue('countPercentage') as number
      return (
        <div className="text-muted-foreground">
          {percentage.toFixed(1)}%
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'amount',
    header: 'Montant',
    cell: ({ row }) => (
      <div className=" text-primary">
        {formatCurrency(row.getValue('amount') as number)}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'amountPercentage',
    header: '% Montant',
    cell: ({ row }) => {
      const percentage = row.getValue('amountPercentage') as number
      return (
        <div className="text-muted-foreground">
          {percentage.toFixed(1)}%
        </div>
      )
    },
    enableSorting: true,
  },
  // Colonnes pour les filtres (masquées par défaut)
  // {
  //   accessorKey: 'assignment_type',
  //   header: 'Type de dossier',
  //   cell: ({ row }) => {
  //     const assignmentType = row.original.assignment_type
  //     return assignmentType ? (
  //       <div className="flex items-center space-x-2">
  //         <Badge variant="outline" className="text-xs">
  //           {assignmentType.label}
  //         </Badge>
  //       </div>
  //     ) : (
  //       <span className="text-muted-foreground text-sm">-</span>
  //     )
  //   },
  //   enableSorting: false,
  //   enableHiding: true,
  // },
  // {
  //   accessorKey: 'expertise_type',
  //   header: 'Type d\'expertise',
  //   cell: ({ row }) => {
  //     const expertiseType = row.original.expertise_type
  //     return expertiseType ? (
  //       <div className="flex items-center space-x-2">
  //         <Badge variant="outline" className="text-xs">
  //           {expertiseType.label}
  //         </Badge>
  //       </div>
  //     ) : (
  //       <span className="text-muted-foreground text-sm">-</span>
  //     )
  //   },
  //   enableSorting: false,
  //   enableHiding: true,
  // },
  // {
  //   accessorKey: 'repairer',
  //   header: 'Réparateur',
  //   cell: ({ row }) => {
  //     const repairer = row.original.repairer
  //     return repairer ? (
  //       <div className="max-w-[150px] truncate text-sm">
  //         {repairer.name}
  //       </div>
  //     ) : (
  //       <span className="text-muted-foreground text-sm">-</span>
  //     )
  //   },
  //   enableSorting: false,
  //   enableHiding: true,
  // },
  // {
  //   accessorKey: 'insurer',
  //   header: 'Assureur',
  //   cell: ({ row }) => {
  //     const insurer = row.original.insurer
  //     return insurer ? (
  //       <div className="max-w-[150px] truncate text-sm">
  //         {insurer.name}
  //       </div>
  //     ) : (
  //       <span className="text-muted-foreground text-sm">-</span>
  //     )
  //   },
  //   enableSorting: false,
  //   enableHiding: true,
  // },
  // {
  //   accessorKey: 'status',
  //   header: 'Statut',
  //   cell: ({ row }) => {
  //     const status = row.original.status
  //     return status ? (
  //       <div className="flex items-center space-x-2">
  //         <Badge 
  //           variant={status.code === 'active' ? 'default' : 'secondary'}
  //           className="text-xs"
  //         >
  //           {status.label}
  //         </Badge>
  //       </div>
  //     ) : (
  //       <span className="text-muted-foreground text-sm">-</span>
  //     )
  //   },
  //   enableSorting: false,
  //   enableHiding: true,
  // },
  // {
  //   accessorKey: 'claim_nature',
  //   header: 'Nature du sinistre',
  //   cell: ({ row }) => {
  //     const claimNature = row.original.claim_nature
  //     return claimNature ? (
  //       <div className="max-w-[150px] truncate text-sm">
  //         {claimNature.label}
  //       </div>
  //     ) : (
  //       <span className="text-muted-foreground text-sm">-</span>
  //     )
  //   },
  //   enableSorting: false,
  //   enableHiding: true,
  // },
  // {
  //   accessorKey: 'created_by',
  //   header: 'Créé par',
  //   cell: ({ row }) => {
  //     const createdBy = row.original.created_by
  //     return createdBy ? (
  //       <div className="max-w-[150px] truncate text-sm">
  //         {createdBy.name}
  //       </div>
  //     ) : (
  //       <span className="text-muted-foreground text-sm">-</span>
  //     )
  //   },
  //   enableSorting: false,
  //   enableHiding: true,
  // },
  // {
  //   accessorKey: 'realized_by',
  //   header: 'Réalisé par',
  //   cell: ({ row }) => {
  //     const realizedBy = row.original.realized_by
  //     return realizedBy ? (
  //       <div className="max-w-[150px] truncate text-sm">
  //         {realizedBy.name}
  //       </div>
  //     ) : (
  //       <span className="text-muted-foreground text-sm">-</span>
  //     )
  //   },
  //   enableSorting: false,
  //   enableHiding: true,
  // },
  // {
  //   accessorKey: 'validated_by',
  //   header: 'Validé par',
  //   cell: ({ row }) => {
  //     const validatedBy = row.original.validated_by
  //     return validatedBy ? (
  //       <div className="max-w-[150px] truncate text-sm">
  //         {validatedBy.name}
  //       </div>
  //     ) : (
  //       <span className="text-muted-foreground text-sm">-</span>
  //     )
  //   },
  //   enableSorting: false,
  //   enableHiding: true,
  // },
] 