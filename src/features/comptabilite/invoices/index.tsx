import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { DateRangePicker } from '@/components/ui/range-calendar/date-range-picker'
import { AssignmentSelect } from '@/features/widgets/AssignmentSelect'
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
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Invoice } from '@/types/comptabilite'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function InvoicesPageContent() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { 
    invoices, 
    loading, 
    pagination,
    totalAmount,
    exportUrl,
    fetchInvoices, 
    // deleteInvoice,
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
  const [selectedAssignment, setSelectedAssignment] = useState<string>('')
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null
  })
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null)
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
        assignment_reference: selectedAssignment,
        start_date: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
        end_date: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined,
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
    setSelectedAssignment('')
    setDateRange({ from: null, to: null })
    // Reset to first page
    fetchInvoicesWithPagination({ page: 1 })
  }

  const handleAssignmentChange = (assignmentId: string) => {
    setSelectedAssignment(assignmentId)
    // Recharger les données avec le nouveau filtre
    const filterParams = {
      search: searchTerm,
      assignment_reference: assignmentId || undefined,
      start_date: dateRange.from ? dateRange.from.toISOString().split('T')[0] : undefined,
      end_date: dateRange.to ? dateRange.to.toISOString().split('T')[0] : undefined,
      status: filters.status === 'all' ? '' : filters.status,
      amount_min: filters.amount_min,
      amount_max: filters.amount_max,
      page: 1
    }
    fetchInvoicesWithPagination(filterParams)
  }

  const handleDateRangeChange = (values: { range: { from: Date; to: Date | undefined }; rangeCompare?: { from: Date; to: Date | undefined } }) => {
    setDateRange({
      from: values.range.from,
      to: values.range.to || null
    })
    // Recharger les données avec le nouveau filtre de dates
    const filterParams = {
      search: searchTerm,
      assignment_reference: selectedAssignment || undefined,
      start_date: values.range.from.toISOString().split('T')[0],
      end_date: values.range.to ? values.range.to.toISOString().split('T')[0] : undefined,
      status: filters.status === 'all' ? '' : filters.status,
      amount_min: filters.amount_min,
      amount_max: filters.amount_max,
      page: 1
    }
    fetchInvoicesWithPagination(filterParams)
  }

  const hasActiveFilters = searchTerm || selectedAssignment || dateRange.from || dateRange.to || (filters.status && filters.status !== 'all') || filters.amount_min || filters.amount_max

  // const handleDelete = async (id: number) => {
  //   if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
  //     try {
  //       await deleteInvoice(id)
  //       // Refresh current page after deletion
  //       fetchInvoicesWithPagination()
  //     } catch (_error) {
  //       // L'erreur est déjà gérée dans le store
  //     }
  //   }
  // }

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
      setDeleteModalOpen(false)
    } else {
      toast.error(message)
    }
    setDeleteModalOpen(false)
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
                {[searchTerm, selectedAssignment, dateRange.from, dateRange.to, filters.status !== 'all' ? filters.status : '', filters.amount_min, filters.amount_max].filter(Boolean).length}
              </Badge>
            )}
          </Button>
          <Button className="text-xs" size={isMobile ? "sm" : "xs"} onClick={handleCreate}>
            <Plus className="mr-2 h-2 w-2 text-xs" />
            {isMobile ? "Nouvelle facture" : "Nouvelle facture"}
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total des factures</p>
              <p className="text-2xl font-bold">{pagination.total}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">F</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Montant total</p>
              <p className="text-2xl font-bold">
                {parseFloat(totalAmount).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-sm font-bold">€</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Factures actives</p>
              <p className="text-2xl font-bold">
                {invoices.filter(inv => inv.status?.code === 'active').length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-sm font-bold">✓</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Actions</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(exportUrl ?? '', '_blank')}
                  className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  disabled={!exportUrl}
                >
                  📊 Exporter
                </Button>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 text-sm font-bold">⚡</span>
            </div>
          </div>
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
          
          {exportUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(exportUrl, '_blank')}
              className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              📊 Exporter
            </Button>
          )}
          
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearFilters} size={isMobile ? "sm" : "icon"}>
              {isMobile ? "Effacer" : <X className="h-4 w-4" />}
            </Button>
          )}
          <DateRangePicker
            initialDateFrom={dateRange.from || undefined}
            initialDateTo={dateRange.to || undefined}
            onUpdate={handleDateRangeChange}
            showCompare={false}
            className="w-full"
          />
        </div>
      </div>

      {/* Affichage des filtres actifs */}
      {(selectedAssignment || dateRange.from || dateRange.to || (filters.status && filters.status !== 'all') || filters.amount_min || filters.amount_max) && (
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Filtres actifs:</span>
          {selectedAssignment && (
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
              📁 Dossier sélectionné
              <button
                onClick={() => setSelectedAssignment('')}
                className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {dateRange.from && (
            <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
              📅 {dateRange.from.toLocaleDateString('fr-FR')}
              {dateRange.to && ` - ${dateRange.to.toLocaleDateString('fr-FR')}`}
              <button
                onClick={() => setDateRange({ from: null, to: null })}
                className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status && filters.status !== 'all' && (
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              🏷️ Statut: {filters.status}
              <button
                onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
                className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.amount_min && (
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
              💰 Min: {filters.amount_min}
              <button
                onClick={() => setFilters(prev => ({ ...prev, amount_min: '' }))}
                className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.amount_max && (
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
              💰 Max: {filters.amount_max}
              <button
                onClick={() => setFilters(prev => ({ ...prev, amount_max: '' }))}
                className="ml-1 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

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
                  // const canDelete = !isCancelled && !isDeleted
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
                                <DropdownMenuItem onClick={() => {
                                  setInvoiceToDelete(invoice)
                                  setDeleteModalOpen(true)
                                }}>
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
      <Sheet open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <SheetContent className="w-full sm:max-w-lg md:max-w-xl">
          <SheetHeader className="pb-3">
            <SheetTitle className="text-lg font-bold text-gray-900">Filtres avancés</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-2 px-6 overflow-y-auto max-h-[calc(100vh-120px)]">
            {/* Header avec bouton de réinitialisation */}
            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Personnalisez vos filtres</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3 mr-1" />
                Réinitialiser
              </Button>
            </div>
            
            {/* Section Dossier */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <Label className="text-sm font-semibold text-gray-900">Dossier</Label>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">Sélectionner un dossier</Label>
                <AssignmentSelect
                  value={selectedAssignment}
                  onValueChange={handleAssignmentChange}
                  placeholder="Sélectionner un dossier..."
                />
              </div>
            </div>

            <Separator className="my-3" />

            {/* Section Statut */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Label className="text-sm font-semibold text-gray-900">Statut</Label>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">Choisir le statut</Label>
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
            </div>

            <Separator className="my-3" />

            {/* Section Montants */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <Label className="text-sm font-semibold text-gray-900">Montants</Label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-700">Montant min</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.amount_min}
                    onChange={(e) => setFilters(prev => ({ ...prev, amount_min: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-700">Montant max</Label>
                  <Input
                    type="number"
                    placeholder="∞"
                    value={filters.amount_max}
                    onChange={(e) => setFilters(prev => ({ ...prev, amount_max: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            {/* Section Période */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <Label className="text-sm font-semibold text-gray-900">Période</Label>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-600">
                  Sélectionnez une plage de dates
                </p>
                <DateRangePicker
                  initialDateFrom={dateRange.from || undefined}
                  initialDateTo={dateRange.to || undefined}
                  onUpdate={handleDateRangeChange}
                  showCompare={false}
                  className="w-full"
                />
              </div>
            </div>

            {/* Boutons d'action */}
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
        </SheetContent>
      </Sheet>

      <Dialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      >
        <DialogContent className="w-1/3">
          <DialogHeader>
            <DialogTitle>Annuler la facture</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Êtes-vous sûr de vouloir annuler cette facture ?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Retour
            </Button>
            <Button variant="destructive" onClick={() => handleCancel(Number(invoiceToDelete?.id))}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> 
    </div>
  )
}


export default function InvoicesPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_INVOICE}>
      <InvoicesPageContent />
    </ProtectedRoute>
  )
}
