/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, TrendingUp, BarChart3, Download, Calendar } from 'lucide-react'
import { StatisticsData, StatisticsType } from '@/types/statistics'
import { formatCurrency } from '@/utils/format-currency'
import { cn } from '@/lib/utils'

interface UnifiedStatisticsDisplayProps {
  type: StatisticsType
  statistics: StatisticsData
  onDownloadExport?: (exportUrl: string) => void
  className?: string
}

export function UnifiedStatisticsDisplay({
  type,
  statistics,
  onDownloadExport,
  className
}: UnifiedStatisticsDisplayProps) {
  const getTypeConfig = () => {
    switch (type) {
      case 'assignments':
        return {
          icon: '📁',
          label: 'Dossiers',
          countKey: 'assignments_by_year_and_month_count',
          amountKey: 'assignments_by_year_and_month_amount',
          countLabel: 'Total des dossiers',
          amountLabel: 'Montant total',
          averageLabel: 'Moyenne par dossier'
        }
      case 'payments':
        return {
          icon: '💰',
          label: 'Paiements',
          countKey: 'payments_by_year_and_month_count',
          amountKey: 'payments_by_year_and_month_amount',
          countLabel: 'Total des paiements',
          amountLabel: 'Montant total reçu',
          averageLabel: 'Moyenne par paiement'
        }
      case 'invoices':
        return {
          icon: '🧾',
          label: 'Factures',
          countKey: 'invoices_by_year_and_month_count',
          amountKey: 'invoices_by_year_and_month_amount',
          countLabel: 'Total des factures',
          amountLabel: 'Montant total facturé',
          averageLabel: 'Moyenne par facture'
        }
      default:
        return null
    }
  }

  const config = getTypeConfig()
  if (!config) return null

  const countData = statistics[config.countKey as keyof StatisticsData] as unknown as any[]
  const amountData = statistics[config.amountKey as keyof StatisticsData] as unknown as any[]

  const totalCount = countData?.reduce((total, item) => total + item.count, 0) || 0
  const totalAmount = amountData?.reduce((total, item) => total + parseFloat(item.amount), 0) || 0
  const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0

  const hasExport = 'export_url' in statistics && statistics.export_url

  // Préparer les données pour le tableau
  const tableData = countData?.map((countItem, index) => {
    const amountItem = amountData?.[index]
    const monthName = new Date(countItem.year, countItem.month - 1).toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    })
    const amount = amountItem ? parseFloat(amountItem.amount) : 0
    const average = countItem.count > 0 ? amount / countItem.count : 0

    return {
      month: monthName,
      year: countItem.year,
      monthNum: countItem.month,
      count: countItem.count,
      amount,
      average,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
    }
  }).sort((a, b) => {
    // Trier par année puis par mois
    if (a.year !== b.year) return b.year - a.year
    return b.monthNum - a.monthNum
  }) || []

  return (
    <div className={cn("space-y-6", className)}>
      {/* Bouton d'export */}
      {hasExport && onDownloadExport && (
        <div className="flex justify-end">
          <Button
            onClick={() => onDownloadExport(statistics.export_url!)}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter en Excel
          </Button>
        </div>
      )}

      {/* Résumé des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-none border-l-4 border-l-grey-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{config.countLabel}</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {config.label} sur la période sélectionnée
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-l-4 border-l-grey-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{config.amountLabel}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Montant total des {config.label.toLowerCase()}
            </p>
          </CardContent>
        </Card>

        {/* <Card className="shadow-none border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{config.averageLabel}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(averageAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Montant moyen par {config.label.toLowerCase().slice(0, -1)}
            </p>
          </CardContent>
        </Card> */}
      </div>

      {/* Tableau détaillé par mois */}
      {tableData.length > 0 && (
        <>
          {/* <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Détails par mois
            </CardTitle>
          </CardHeader> */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Période</TableHead>
                    <TableHead className="text-center font-semibold">Nombre</TableHead>
                    <TableHead className="text-right font-semibold">Montant total</TableHead>
                    <TableHead className="text-center font-semibold">Moyenne</TableHead>
                    <TableHead className="text-center font-semibold">% du total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow 
                      key={`${row.year}-${row.monthNum}`}
                      className={cn(
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/30',
                        'hover:bg-muted/50 transition-colors'
                      )}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-muted-foreground">
                            {row.year}
                          </span>
                          <span className="capitalize">{row.month}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {row.count.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <span className="font-semibold text-green-600">
                          {formatCurrency(row.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        x
                        {/* <span className="text-muted-foreground">
                          {formatCurrency(row.average)}
                        </span> */}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          {/* <Badge 
                            variant="secondary" 
                            className="text-xs font-mono"
                          >
                            {row.percentage.toFixed(1)}%
                          </Badge> */}
                          x
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Ligne de total */}
                  <TableRow className="bg-primary/5 border-t-2 border-primary/20">
                    <TableCell className="font-bold text-primary">
                      Total
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default" className="font-mono">
                        {totalCount.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span className="font-bold text-primary">
                        {formatCurrency(totalAmount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span className="font-bold text-primary">
                        {formatCurrency(averageAmount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default" className="font-mono">
                        100%
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
          </div>
        </>
      )}
    </div>
  )
}
