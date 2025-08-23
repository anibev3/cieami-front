import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

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
  Trash2, 
  Download,

  FileText,
  User,
  Loader2,
  X,
  Settings2,
  ChevronDown,
  MoreHorizontal,
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { formatDate } from '@/utils/format-date'
import { formatCurrency } from '@/utils/format-currency'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'

export default function InvoicesPage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { 
    invoices, 
    loading, 
    pagination,
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
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    reference: true,
    assignment: !isMobile,
    date: !isMobile,
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

  // Pagination state - using store data directly
  // Remove local pagination state to prevent infinite loops
  // const [currentPage, setCurrentPage] = useState(1)
  // const [perPage, setPerPage] = useState(20)

  useEffect(() => {
    // Only fetch on component mount, not on pagination changes
    fetchInvoicesWithPagination()
  }, []) // Empty dependency array

  // Remove the problematic sync useEffect that causes infinite loop

  // Ajuster la visibilité des colonnes selon l'état mobile
  useEffect(() => {
    if (isMobile) {
      setColumnVisibility(prev => ({
        ...prev,
        assignment: false,
        date: false,
        created_by: false,
        expertise_date: false
      }))
    } else {
      setColumnVisibility(prev => ({
        ...prev,
        assignment: true,
        date: true
      }))
    }
  }, [isMobile])

  const fetchInvoicesWithPagination = async (searchFilters?: Record<string, unknown>) => {
    try {
      // Base filters
      const baseFilters = {
        search: searchTerm,
        date_from: filters.date_from,
        date_to: filters.date_to,
        status: filters.status === 'all' ? '' : filters.status,
        amount_min: filters.amount_min,
        amount_max: filters.amount_max,
        page: pagination.current_page,
        per_page: pagination.per_page
      }
      
      // Merge with any additional filters (like pagination changes)
      const apiFilters = { ...baseFilters, ...searchFilters }
      
      await fetchInvoices(apiFilters)
    } catch (_error) {
      // Error handled by store
    }
  }

  const handleSearch = () => {
    // Reset to first page on search
    fetchInvoicesWithPagination({ page: 1 })
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
    // Reset to first page
    fetchInvoicesWithPagination({ page: 1 })
  }

  const hasActiveFilters = searchTerm || filters.date_from || filters.date_to || (filters.status && filters.status !== 'all') || filters.amount_min || filters.amount_max

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        await deleteInvoice(id)
        // Refresh current page after deletion
        fetchInvoicesWithPagination()
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

  // Pagination handlers
  const handlePageChange = (page: number) => {
    fetchInvoicesWithPagination({ page })
  }

  const handlePerPageChange = (newPerPage: number) => {
    fetchInvoicesWithPagination({ per_page: newPerPage, page: 1 })
  }

  const handleRefresh = () => {
    fetchInvoicesWithPagination()
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
      fetchInvoicesWithPagination()
    } else {
      toast.error(message)
    }
  }

  const handleGenerate = async (id: number) => {
    const message = await generateInvoice(id)
    if (message.toLowerCase().includes('succès') || message.toLowerCase().includes('success')) {
      toast.success(message)
      fetchInvoicesWithPagination()
    } else {
      toast.error(message)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, pagination.current_page - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(pagination.last_page, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }

  return (
    <div className="h-full space-y-6 relative w-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Factures</h1>
          <p className="text-muted-foreground">
            Gérez les factures de vos <span className="font-bold">{pagination.total} dossier{pagination.total > 1 ? 's' : ''}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" className="text-xs" size={isMobile ? "sm" : "xs"} onClick={() => setFilterModalOpen(true)}>
            <Filter className="mr-2 h-2 w-2 text-xs" />
            {!isMobile && "Filtres"}
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {[searchTerm, filters.date_from, filters.date_to, filters.status !== 'all' ? filters.status : '', filters.amount_min, filters.amount_max].filter(Boolean).length}
              </Badge>
            )}
          </Button>
          <Button className="text-xs" size={isMobile ? "sm" : "xs"} onClick={handleCreate}>
            <Plus className="mr-2 h-2 w-2 text-xs" />
            {isMobile ? "Nouvelle facture" : "Nouvelle facture"}
          </Button>
        </div>
      </div>

      {/* Barre de recherche et contrôles */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
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
        <div className="flex gap-2 sm:gap-3">
          <Button onClick={handleSearch} variant="outline" className="flex-1 sm:flex-none">
            {isMobile ? "Rechercher" : "Rechercher"}
          </Button>
          <Button onClick={handleRefresh} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearFilters} size={isMobile ? "sm" : "icon"}>
              {isMobile ? "Effacer" : <X className="h-4 w-4" />}
            </Button>
          )}
        </div>
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
                  {!isMobile && "Colonnes"}
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
          <div className={isMobile ? "overflow-x-auto" : ""}>
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
                  // const canEdit = !isCancelled && !isDeleted
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
                                <DropdownMenuContent align="end">
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
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Affichage de {((pagination.current_page - 1) * pagination.per_page) + 1} à {Math.min(pagination.current_page * pagination.per_page, pagination.total)} sur {pagination.total} factures
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Par page:</span>
              <Select value={pagination.per_page.toString()} onValueChange={(value) => handlePerPageChange(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={pagination.current_page === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page numbers */}
              {getPageNumbers().map((page) => (
                <Button
                  key={page}
                  variant={pagination.current_page === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.last_page)}
                disabled={pagination.current_page === pagination.last_page}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de filtres avancés */}
      <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <DialogContent className={isMobile ? "w-[95vw] max-w-none mx-4" : "max-w-md"}>
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
              <Input
                type="date"
                value={filters.date_from || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Input
                type="date"
                value={filters.date_to || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
                className="w-full"
              />
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

            <div className={isMobile ? "space-y-4" : "grid grid-cols-2 gap-2"}>
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
                  value={filters.amount_min}
                  onChange={(e) => setFilters(prev => ({ ...prev, amount_max: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClearFilters} className={isMobile ? "w-full" : ""}>
                Effacer tout
              </Button>
              <Button onClick={() => {
                handleSearch()
                setFilterModalOpen(false)
              }} className={isMobile ? "w-full" : ""}>
                Appliquer les filtres
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
