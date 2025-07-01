import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Calendar as CalendarIcon,
  FileText,
  DollarSign,
  User,
  Building,
  Loader2,
  X
} from 'lucide-react'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { formatDate } from '@/utils/format-date'
import { formatCurrency } from '@/utils/format-currency'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export default function InvoicesPage() {
  const navigate = useNavigate()
  const { 
    invoices, 
    loading, 
    fetchInvoices, 
    deleteInvoice
  } = useInvoiceStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    date_from: '',
    date_to: '',
    status: 'all'
  })
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [dateFromOpen, setDateFromOpen] = useState(false)
  const [dateToOpen, setDateToOpen] = useState(false)

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const handleSearch = () => {
    const searchFilters = {
      search: searchTerm,
      date_from: filters.date_from,
      date_to: filters.date_to,
      status: filters.status === 'all' ? '' : filters.status
    }
    fetchInvoices(searchFilters)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilters({
      date_from: '',
      date_to: '',
      status: 'all'
    })
    fetchInvoices()
  }

  const hasActiveFilters = searchTerm || filters.date_from || filters.date_to || (filters.status && filters.status !== 'all')

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        await deleteInvoice(id)
      } catch (_error) {
        // L'erreur est déjà gérée dans le store
      }
    }
  }

  const handleViewDetails = (id: number) => {
    navigate({ to: `/comptabilite/invoices/details/${id}` })
  }

  const handleCreate = () => {
    navigate({ to: '/comptabilite/invoices/create' })
  }



  const handleFilterDateFrom = (date: Date | undefined) => {
    if (date) {
      setFilters(prev => ({ 
        ...prev, 
        date_from: date.toISOString().split('T')[0] 
      }))
    }
    setDateFromOpen(false)
  }

  const handleFilterDateTo = (date: Date | undefined) => {
    if (date) {
      setFilters(prev => ({ 
        ...prev, 
        date_to: date.toISOString().split('T')[0] 
      }))
    }
    setDateToOpen(false)
  }

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Factures</h1>
          <p className="text-muted-foreground">
            Gérez les factures de vos <span className="font-bold">{invoices.length} dossier{invoices.length > 1 ? 's' : ''}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setFilterModalOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filtres
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {[searchTerm, filters.date_from, filters.date_to, filters.status !== 'all' ? filters.status : ''].filter(Boolean).length}
              </Badge>
            )}
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle facture
          </Button>
        </div>
      </div>

      {/* Barre de recherche rapide */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par référence, assignation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>
          Rechercher
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={handleClearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-24rem)] overflow-y-hidden">
      {/* Liste des factures */}
        <div>
            <div>
            {loading ? (
                <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Chargement des factures...</span>
                </div>
            ) : invoices.length === 0 ? (
                <div className="text-center py-4">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune facture trouvée</h3>
                <p className="text-muted-foreground mb-4">
                    {hasActiveFilters 
                    ? 'Aucune facture ne correspond à vos critères de recherche'
                    : 'Commencez par créer votre première facture'
                    }
                </p>
                {!hasActiveFilters && (
                    <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une facture
                    </Button>
                )}
                </div>
            ) : (
                <div className="">
                <div className="space-y-3">
                    {invoices.map((invoice) => (
                    <div 
                        key={invoice.id} 
                        className="group relative bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-primary/20"
                    >
                        <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-primary truncate">
                                        {invoice.reference}
                                    </h3>
                                    <Badge className={cn(getStatusColor(invoice.status.code), "text-xs")}>
                                        {invoice.status.label}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Dossier: <span className="font-medium">{invoice.assignment.reference}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Police: {invoice.assignment.policy_number} • Sinistre: {invoice.assignment.claim_number}
                                </p>
                            </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">{formatDate(invoice.date)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-semibold text-primary">
                                {invoice.amount 
                                    ? formatCurrency(Number(invoice.amount))
                                    : formatCurrency(Number(invoice.assignment.total_amount))
                                }
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">{invoice.created_by.name || 'N/A'}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">Expertise: {formatDate(invoice.assignment.expertise_date)}</span>
                            </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(Number(invoice.id))}
                            className="h-8 w-8 p-0"
                            >
                            <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate({ to: `/comptabilite/invoices/${Number(invoice.id)}/edit` })}
                            className="h-8 w-8 p-0"
                            >
                            <Edit className="h-4 w-4" />
                            </Button>
                            
                            {invoice.assignment.expertise_sheet && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(invoice.assignment.expertise_sheet!, '_blank')}
                                className="h-8 w-8 p-0"
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                            )}
                            
                            <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(Number(invoice.id))}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}
            </div>
        </div>
      </ScrollArea>

      {/* Modal de filtres */}
      <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres avancés
            </DialogTitle>
            <DialogDescription>
              Affinez votre recherche de factures
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.date_from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.date_from ? formatDate(filters.date_from) : "Sélectionnez une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.date_from ? new Date(filters.date_from) : undefined}
                    onSelect={handleFilterDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.date_to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.date_to ? formatDate(filters.date_to) : "Sélectionnez une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.date_to ? new Date(filters.date_to) : undefined}
                    onSelect={handleFilterDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClearFilters}>
                Effacer
              </Button>
              <Button onClick={() => {
                handleSearch()
                setFilterModalOpen(false)
              }}>
                Appliquer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  )
}
