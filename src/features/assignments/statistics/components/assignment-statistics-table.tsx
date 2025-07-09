import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronRight, BarChart3 } from 'lucide-react'
import { AssignmentStatistics } from '@/types/assignments'
import { formatCurrency } from '@/utils/format-currency'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface AssignmentStatisticsTableProps {
  statistics: AssignmentStatistics
}

export function AssignmentStatisticsTable({ statistics }: AssignmentStatisticsTableProps) {
  const [expanded, setExpanded] = useState(true)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const getMonthName = (month: number) => {
    const date = new Date(2024, month - 1, 1)
    return format(date, 'MMMM', { locale: fr })
  }

  // Combiner les données par mois
  const combinedData = () => {
    const countMap = new Map()
    const amountMap = new Map()

    // Créer des maps pour les données de comptage
    statistics.assignments_by_year_and_month_count?.forEach(item => {
      const key = `${item.year}-${item.month}`
      countMap.set(key, item.count)
    })

    // Créer des maps pour les données de montant
    statistics.assignments_by_year_and_month_amount?.forEach(item => {
      const key = `${item.year}-${item.month}`
      amountMap.set(key, parseFloat(item.amount))
    })

    // Combiner toutes les clés uniques
    const allKeys = new Set([...countMap.keys(), ...amountMap.keys()])
    
    return Array.from(allKeys).map(key => {
      const [year, month] = key.split('-').map(Number)
      return {
        year,
        month,
        count: countMap.get(key) || 0,
        amount: amountMap.get(key) || 0
      }
    }).sort((a, b) => {
      // Trier par année puis par mois
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })
  }

  const data = combinedData()
  const totalCount = data.reduce((total, item) => total + item.count, 0)
  const totalAmount = data.reduce((total, item) => total + item.amount, 0)

  return (
    <div className="shadow-none">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <CardTitle>Statistiques par mois</CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{totalCount} dossiers total</Badge>
              <Badge variant="secondary">{formatCurrency(totalAmount)} montant total</Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      {expanded && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Année</TableHead>
                <TableHead>Mois</TableHead>
                <TableHead className="text-right">Nombre de dossiers</TableHead>
                <TableHead className="text-right">% Dossiers</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-right">% Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={`${item.year}-${item.month}`} className="">
                    <TableCell className="font-medium">{item.year}</TableCell>
                    <TableCell className="capitalize">{getMonthName(item.month)}</TableCell>
                    <TableCell className="text-right font-semibold">{item.count}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {/* {totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : 0}% */}-
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {formatCurrency(item.amount)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {/* {totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0}% */}-
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucune donnée disponible pour cette période
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
} 