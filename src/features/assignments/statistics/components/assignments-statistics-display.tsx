/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, TrendingUp, Download, Zap } from 'lucide-react'
import { StatisticsData } from '@/types/statistics'
import { formatCurrency } from '@/utils/format-currency'
import { cn } from '@/lib/utils'

interface AssignmentsStatisticsDisplayProps {
  statistics: StatisticsData
  onDownloadExport?: (exportUrl: string) => void
  className?: string
}

export function AssignmentsStatisticsDisplay({
  statistics,
  onDownloadExport,
  className
}: AssignmentsStatisticsDisplayProps) {
  const [activeTab, setActiveTab] = useState('count')

  // Récupérer les données avec vérification de type
  const countData = (statistics as any).assignments_by_year_and_month_count || []
  const amountData = (statistics as any).assignments_by_year_and_month_amount || []
  const shockAmountData = (statistics as any).assignments_total_shock_amount_by_year_and_month || []

  // Calculs pour le tableau des comptages
  const totalCount = countData?.reduce((total: number, item: any) => total + (item.count || 0), 0) || 0

  // Calculs pour le tableau des montants
  const totalAmount = amountData?.reduce((total: number, item: any) => total + parseFloat(item.amount || 0), 0) || 0
  const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0

  // Calculs pour le tableau des montants de chocs
  const totalShockAmount = shockAmountData?.reduce((total: number, item: any) => total + parseFloat(item.amount || 0), 0) || 0
  const averageShockAmount = totalCount > 0 ? totalShockAmount / totalCount : 0

  const hasExport = 'export_url' in statistics && statistics.export_url

  // Préparer les données pour le tableau des comptages
  const countTableData = countData?.map((item: any) => {
    const monthName = new Date(item.year, item.month - 1).toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    })

    return {
      month: monthName,
      year: item.year,
      monthNum: item.month,
      count: item.count || 0,
      percentage: totalCount > 0 ? ((item.count || 0) / totalCount) * 100 : 0
    }
  }).sort((a: any, b: any) => {
    if (a.year !== b.year) return b.year - a.year
    return b.monthNum - a.monthNum
  }) || []

  // Préparer les données pour le tableau des montants
  const amountTableData = amountData?.map((item: any) => {
    const monthName = new Date(item.year, item.month - 1).toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    })
    const amount = parseFloat(item.amount || 0)
    const countItem = countData?.find((c: any) => c.year === item.year && c.month === item.month)
    const count = countItem?.count || 0
    const average = count > 0 ? amount / count : 0

    return {
      month: monthName,
      year: item.year,
      monthNum: item.month,
      amount,
      count,
      average,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
    }
  }).sort((a: any, b: any) => {
    if (a.year !== b.year) return b.year - a.year
    return b.monthNum - a.monthNum
  }) || []

  // Préparer les données pour le tableau des montants de chocs
  const shockAmountTableData = shockAmountData?.map((item: any) => {
    const monthName = new Date(item.year, item.month - 1).toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    })
    const amount = parseFloat(item.amount || 0)
    const countItem = countData?.find((c: any) => c.year === item.year && c.month === item.month)
    const count = countItem?.count || 0
    const average = count > 0 ? amount / count : 0

    return {
      month: monthName,
      year: item.year,
      monthNum: item.month,
      amount,
      count,
      average,
      percentage: totalShockAmount > 0 ? (amount / totalShockAmount) * 100 : 0
    }
  }).sort((a: any, b: any) => {
    if (a.year !== b.year) return b.year - a.year
    return b.monthNum - a.monthNum
  }) || []

  const handleDownloadExport = () => {
    if (statistics.export_url) {
      if (onDownloadExport) {
        onDownloadExport(statistics.export_url)
      } else {
        window.open(statistics.export_url, '_blank')
      }
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Bouton d'export */}
      {hasExport && (
        <div className="flex justify-end">
          <Button
            onClick={handleDownloadExport}
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
        <Card className="shadow-none border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des dossiers</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📁</span>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Dossiers sur la période sélectionnée
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Montant total des dossiers
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant total des chocs</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalShockAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Montant total des chocs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Système de tabs pour les différents tableaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="count" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Nombre de dossiers</span>
            <span className="sm:hidden">Nombre</span>
          </TabsTrigger>
          <TabsTrigger value="amount" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Montants des dossiers</span>
            <span className="sm:hidden">Montants</span>
          </TabsTrigger>
          <TabsTrigger value="shock" className="gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Montants des chocs</span>
            <span className="sm:hidden">Chocs</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Nombre de dossiers */}
        <TabsContent value="count" className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Nombre de dossiers par mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              {countTableData.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Période</TableHead>
                        <TableHead className="text-center font-semibold">Nombre de dossiers</TableHead>
                        <TableHead className="text-center font-semibold">% du total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {countTableData.map((row: any, index: number) => (
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
                          <TableCell className="text-center">
                            <Badge 
                              variant="secondary" 
                              className="text-xs font-mono"
                            >
                              {row.percentage.toFixed(1)}%
                            </Badge>
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
                        <TableCell className="text-center">
                          <Badge variant="default" className="font-mono">
                            100%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune donnée disponible
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Montants des dossiers */}
        <TabsContent value="amount" className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Montants des dossiers par mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              {amountTableData.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Période</TableHead>
                        <TableHead className="text-center font-semibold">Nombre</TableHead>
                        <TableHead className="text-right font-semibold">Montant total</TableHead>
                        <TableHead className="text-right font-semibold">Moyenne</TableHead>
                        <TableHead className="text-center font-semibold">% du total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {amountTableData.map((row: any, index: number) => (
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
                          <TableCell className="text-right font-mono">
                            <span className="text-muted-foreground">
                              {formatCurrency(row.average)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant="secondary" 
                              className="text-xs font-mono"
                            >
                              {row.percentage.toFixed(1)}%
                            </Badge>
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
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune donnée disponible
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Montants des chocs */}
        <TabsContent value="shock" className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Montants totaux des chocs par mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              {shockAmountTableData.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Période</TableHead>
                        <TableHead className="text-center font-semibold">Nombre de dossiers</TableHead>
                        <TableHead className="text-right font-semibold">Montant total des chocs</TableHead>
                        <TableHead className="text-right font-semibold">Moyenne par dossier</TableHead>
                        <TableHead className="text-center font-semibold">% du total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shockAmountTableData.map((row: any, index: number) => (
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
                            <span className="font-semibold text-purple-600">
                              {formatCurrency(row.amount)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            <span className="text-muted-foreground">
                              {formatCurrency(row.average)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant="secondary" 
                              className="text-xs font-mono"
                            >
                              {row.percentage.toFixed(1)}%
                            </Badge>
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
                            {formatCurrency(totalShockAmount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          <span className="font-bold text-primary">
                            {formatCurrency(averageShockAmount)}
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
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune donnée disponible
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

