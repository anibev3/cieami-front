import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
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
  User,
  Loader2,
  X,
  Settings2,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { formatDate } from '@/utils/format-date'
import { formatCurrency } from '@/utils/format-currency'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function InvoicesPage() {
  const navigate = useNavigate()
  const { 
    invoices, 
    loading, 
    fetchInvoices, 
    deleteInvoice,
    cancelInvoice,
    generateInvoice
  } = useInvoiceStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    date_from: '',
    date_to: '',
    status: 'all',
    amount_min: '',
    amount_max: ''
  })
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [dateFromOpen, setDateFromOpen] = useState(false)
  const [dateToOpen, setDateToOpen] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    reference: true,
    assignment: true,
    date: true,
    amount: true,
    status: true,
    created_by: false,
    expertise_date: false,
    actions: true
  })
  const [sorting, setSorting] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc'
  })

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const handleSearch = () => {
    const searchFilters = {
      search: searchTerm,
      date_from: filters.date_from,
      date_to: filters.date_to,
      status: filters.status === 'all' ? '' : filters.status,
      amount_min: filters.amount_min,
      amount_max: filters.amount_max
    }
    fetchInvoices(searchFilters)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilters({
      date_from: '',
      date_to: '',
      status: 'all',
      amount_min: '',
      amount_max: ''
    })
    fetchInvoices()
  }

  const hasActiveFilters = searchTerm || filters.date_from || filters.date_to || (filters.status && filters.status !== 'all') || filters.amount_min || filters.amount_max

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

  const handleSort = (key: string) => {
    setSorting(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
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
      case 'paid':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  // Tri des factures
  const sortedInvoices = [...invoices].sort((a, b) => {
    const aValue = a[sorting.key as keyof typeof a]
    const bValue = b[sorting.key as keyof typeof b]
    
    // Gérer les valeurs nulles
    const aVal = aValue ?? ''
    const bVal = bValue ?? ''
    
    if (sorting.direction === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  const handleCancel = async (id: number) => {
    const message = await cancelInvoice(id)
    if (message.toLowerCase().includes('succès') || message.toLowerCase().includes('success')) {
      toast.success(message)
      fetchInvoices()
    } else {
      toast.error(message)
    }
  }

  const handleGenerate = async (id: number) => {
    const message = await generateInvoice(id)
    if (message.toLowerCase().includes('succès') || message.toLowerCase().includes('success')) {
      toast.success(message)
      fetchInvoices()
    } else {
      toast.error(message)
    }
  }

  return (
    <div className="space-y-6 relative w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Factures</h1>
          <p className="text-muted-foreground">
            Gérez les factures de vos <span className="font-bold">{invoices.length} dossier{invoices.length > 1 ? 's' : ''}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-xs" size="xs" onClick={() => setFilterModalOpen(true)}>
            <Filter className="mr-2 h-2 w-2 text-xs" />
            Filtres
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {[searchTerm, filters.date_from, filters.date_to, filters.status !== 'all' ? filters.status : '', filters.amount_min, filters.amount_max].filter(Boolean).length}
              </Badge>
            )}
          </Button>
          <Button className="text-xs" size="xs" onClick={handleCreate}>
            <Plus className="mr-2 h-2 w-2 text-xs" />
            Nouvelle facture
          </Button>
        </div>
      </div>

      {/* Barre de recherche et contrôles */}
      <div className="flex gap-3 items-center">
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
        <Button onClick={handleSearch} variant="outline">
          Rechercher
        </Button>
        <Button onClick={() => fetchInvoices()} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={handleClearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* DataTable */}
      <div className="rounded-md border bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Liste des factures</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Colonnes
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(columnVisibility).map(([key, visible]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={visible}
                    onCheckedChange={(checked) =>
                      setColumnVisibility(prev => ({ ...prev, [key]: checked }))
                    }
                  >
                    {key === 'reference' && 'Référence'}
                    {key === 'assignment' && 'Dossier'}
                    {key === 'date' && 'Date facture'}
                    {key === 'amount' && 'Montant'}
                    {key === 'status' && 'Statut'}
                    {key === 'created_by' && 'Créé par'}
                    {key === 'expertise_date' && 'Date expertise'}
                    {key === 'actions' && 'Actions'}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Chargement des factures...</span>
          </div>
        ) : sortedInvoices.length === 0 ? (
          <div className="text-center py-16">
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
          <Table>
            <TableHeader>
              <TableRow>
                {columnVisibility.reference && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('reference')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Référence
                      {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                    </Button>
                  </TableHead>
                )}
                {columnVisibility.assignment && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('assignment')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Dossier
                      {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                    </Button>
                  </TableHead>
                )}
                {columnVisibility.date && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('date')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Date facture
                      {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                    </Button>
                  </TableHead>
                )}
                {columnVisibility.amount && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('amount')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Montant
                      {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                    </Button>
                  </TableHead>
                )}
                {columnVisibility.status && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('status')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Statut
                      {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                    </Button>
                  </TableHead>
                )}
                {columnVisibility.created_by && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('created_by')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Créé par
                      {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                    </Button>
                  </TableHead>
                )}
                {columnVisibility.expertise_date && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('expertise_date')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Date expertise
                      {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                    </Button>
                  </TableHead>
                )}
                {columnVisibility.actions && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvoices.map((invoice) => {
                const isCancelled = invoice.status?.code === 'cancelled'
                const isDeleted = invoice.deleted_at !== null
                const canCancel = !isCancelled && !isDeleted
                const canGenerate = invoice.status?.code !== 'generated' && !isDeleted && !isCancelled
                const canEdit = !isCancelled && !isDeleted
                const canDelete = !isCancelled && !isDeleted
                return (
                  <TableRow key={invoice.id} className="hover:bg-muted/50">
                    {columnVisibility.reference && (
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {/* <FileText className="h-4 w-4 text-muted-foreground" /> */}
                          {invoice.reference}
                        </div>
                      </TableCell>
                    )}
                    
                    {columnVisibility.assignment && (
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{invoice.assignment?.reference}</div>
                          {/* <div className="text-xs text-muted-foreground">
                            Police: {invoice.assignment.policy_number}
                          </div> */}
                        </div>
                      </TableCell>
                    )}
                    
                    {columnVisibility.date && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          {formatDate(invoice.date)}
                        </div>
                      </TableCell>
                    )}
                    
                    {columnVisibility.amount && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                          <span className="font-semibold text-green-600">
                            {formatCurrency(Number(invoice.assignment?.receipt_amount || 0))}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    
                    {columnVisibility.status && (
                      <TableCell>
                        <Badge className={cn(getStatusColor(invoice.status?.code || ''), "text-xs")}> 
                          {invoice.status?.label || 'Statut inconnu'}
                        </Badge>
                      </TableCell>
                    )}
                    
                    {columnVisibility.created_by && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[120px]">
                            {invoice.created_by?.name || 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    
                    {columnVisibility.expertise_date && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* <Building className="h-4 w-4 text-muted-foreground" /> */}
                          {formatDate(invoice.assignment?.expertise_date)}
                        </div>
                      </TableCell>
                    )}
                    
                    {columnVisibility.actions && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(Number(invoice.id))}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir les détails
                            </DropdownMenuItem>
                            {/* {canEdit && (
                              <DropdownMenuItem onClick={() => navigate({ to: `/comptabilite/invoices/${Number(invoice.id)}/edit` })}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                            )} */}
                            {canCancel && (
                              <DropdownMenuItem onClick={() => handleCancel(Number(invoice.id))}>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Annuler
                              </DropdownMenuItem>
                            )}
                            {canGenerate && (
                              <DropdownMenuItem onClick={() => handleGenerate(Number(invoice.id))}>
                                <Download className="mr-2 h-4 w-4" />
                                Générer
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {canDelete && (
                              <DropdownMenuItem 
                                onClick={() => handleDelete(Number(invoice.id))}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Modal de filtres avancés */}
      <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres avancés
            </DialogTitle>
            <DialogDescription>
              Affinez votre recherche de factures avec des critères précis
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
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Montant min</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.amount_min}
                  onChange={(e) => setFilters(prev => ({ ...prev, amount_min: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Montant max</Label>
                <Input
                  type="number"
                  placeholder="∞"
                  value={filters.amount_max}
                  onChange={(e) => setFilters(prev => ({ ...prev, amount_max: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClearFilters}>
                Effacer tout
              </Button>
              <Button onClick={() => {
                handleSearch()
                setFilterModalOpen(false)
              }}>
                Appliquer les filtres
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
