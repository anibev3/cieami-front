import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Search } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { AssignmentSelect } from '@/features/widgets/AssignmentSelect'
import { AssignmentStatisticsTable } from './components/assignment-statistics-table'
import { useAssignmentStatisticsStore } from '@/stores/assignmentStatisticsStore'

export default function AssignmentStatisticsPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('')
  
  const { statistics, loading, fetchStatistics } = useAssignmentStatisticsStore()

  const handleSearch = () => {
    if (!startDate || !endDate) {
      return
    }

    const filters = {
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      assignment_id: selectedAssignmentId ? parseInt(selectedAssignmentId) : undefined
    }

    fetchStatistics(filters)
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistiques des Dossiers</h1>
          <p className="text-muted-foreground">
            Analysez les performances et les tendances de vos dossiers d'expertise
          </p>
        </div>
      </div>

      {/* Filtres */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtres de recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date de début */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de début</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date de fin */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Dossier spécifique */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Dossier spécifique</label>
              <AssignmentSelect
                value={selectedAssignmentId}
                onValueChange={setSelectedAssignmentId}
                placeholder="Tous les dossiers"
              />
            </div>

            {/* Bouton de recherche */}
            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button 
                onClick={handleSearch} 
                disabled={!startDate || !endDate || loading}
                className="w-full"
              >
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résumé des statistiques */}
      {/* {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des dossiers</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalCount()}</div>
              <p className="text-xs text-muted-foreground">
                Dossiers sur la période sélectionnée
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Montant total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(getTotalAmount())}</div>
              <p className="text-xs text-muted-foreground">
                Montant total des dossiers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moyenne par dossier</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getTotalCount() > 0 ? formatCurrency(getTotalAmount() / getTotalCount()) : '0 €'}
              </div>
              <p className="text-xs text-muted-foreground">
                Montant moyen par dossier
              </p>
            </CardContent>
          </Card>
        </div>
      )} */}

      {/* Tableau des statistiques */}
      {statistics && (
        <AssignmentStatisticsTable statistics={statistics.data} />
      )}

      {/* État de chargement */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Chargement des statistiques...
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 