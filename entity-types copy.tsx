// import { useState, useEffect } from 'react'
// import { useNavigate } from '@tanstack/react-router'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
// import { Textarea } from '@/components/ui/textarea'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import * as z from 'zod'
// import { toast } from 'sonner'
// import { Plus, Search, Edit, Trash2, Eye, EyeOff, Building } from 'lucide-react'
// import { useEntityTypesStore } from '@/stores/entityTypesStore'
// import { EntityType } from '@/types/entity-types'
// import { ConfirmDialog } from '@/components/confirm-dialog'

// const entityTypeSchema = z.object({
//   label: z.string().min(1, 'Le libellé est requis'),
//   description: z.string().min(1, 'La description est requise'),
// })

// type EntityTypeFormData = z.infer<typeof entityTypeSchema>

// export default function EntityTypesPage() {
//   const navigate = useNavigate()
//   const { 
//     entityTypes, 
//     loading, 
//     pagination,
//     fetchEntityTypes, 
//     createEntityType, 
//     updateEntityType,
//     enableEntityType,
//     disableEntityType,
//     deleteEntityType 
//   } = useEntityTypesStore()

//   const [searchQuery, setSearchQuery] = useState('')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [selectedEntityType, setSelectedEntityType] = useState<EntityType | null>(null)
//   const [confirmDialog, setConfirmDialog] = useState<{
//     open: boolean
//     title: string
//     description: string
//     onConfirm: () => void
//   }>({
//     open: false,
//     title: '',
//     description: '',
//     onConfirm: () => {},
//   })

//   const form = useForm<EntityTypeFormData>({
//     resolver: zodResolver(entityTypeSchema),
//     defaultValues: {
//       label: '',
//       description: '',
//     },
//   })

//   // Charger les types d'entité au montage
//   useEffect(() => {
//     fetchEntityTypes({ page: currentPage, search: searchQuery })
//   }, [currentPage, searchQuery, fetchEntityTypes])

//   const handleSearch = (value: string) => {
//     setSearchQuery(value)
//     setCurrentPage(1)
//   }

//   const handleCreate = () => {
//     form.reset()
//     setIsCreateModalOpen(true)
//   }

//   const handleEdit = (entityType: EntityType) => {
//     setSelectedEntityType(entityType)
//     form.reset({
//       label: entityType.label,
//       description: entityType.description,
//     })
//     setIsEditModalOpen(true)
//   }

//   const handleToggleStatus = (entityType: EntityType) => {
//     const isActive = !entityType.deleted_at
//     const action = isActive ? 'désactiver' : 'activer'
    
//     setConfirmDialog({
//       open: true,
//       title: `${action.charAt(0).toUpperCase() + action.slice(1)} le type d'entité`,
//       description: `Êtes-vous sûr de vouloir ${action} "${entityType.label}" ?`,
//       onConfirm: async () => {
//         try {
//           if (isActive) {
//             await disableEntityType(entityType.id)
//           } else {
//             await enableEntityType(entityType.id)
//           }
//           setConfirmDialog({ ...confirmDialog, open: false })
//         } catch (error) {
//           console.error('Erreur lors du changement de statut:', error)
//         }
//       },
//     })
//   }

//   const handleDelete = (entityType: EntityType) => {
//     setConfirmDialog({
//       open: true,
//       title: 'Supprimer le type d\'entité',
//       description: `Êtes-vous sûr de vouloir supprimer "${entityType.label}" ? Cette action est irréversible.`,
//       onConfirm: async () => {
//         try {
//           await deleteEntityType(entityType.id)
//           setConfirmDialog({ ...confirmDialog, open: false })
//         } catch (error) {
//           console.error('Erreur lors de la suppression:', error)
//         }
//       },
//     })
//   }

//   const onSubmitCreate = async (data: EntityTypeFormData) => {
//     try {
//       await createEntityType(data)
//       setIsCreateModalOpen(false)
//       form.reset()
//     } catch (error) {
//       console.error('Erreur lors de la création:', error)
//     }
//   }

//   const onSubmitEdit = async (data: EntityTypeFormData) => {
//     if (!selectedEntityType) return
    
//     try {
//       await updateEntityType(selectedEntityType.id, data)
//       setIsEditModalOpen(false)
//       setSelectedEntityType(null)
//       form.reset()
//     } catch (error) {
//       console.error('Erreur lors de la modification:', error)
//     }
//   }

//   const getStatusBadge = (entityType: EntityType) => {
//     const isActive = !entityType.deleted_at
//     return (
//       <Badge 
//         variant={isActive ? "default" : "secondary"}
//         className={cn(
//           isActive ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
//         )}
//       >
//         {isActive ? 'Actif' : 'Inactif'}
//       </Badge>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Types d'entité</h1>
//           <p className="text-muted-foreground">
//             Gérez les types d'entité du système
//           </p>
//         </div>
//         <Button onClick={handleCreate} className="flex items-center gap-2">
//           <Plus className="h-4 w-4" />
//           Nouveau type d'entité
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Building className="h-5 w-5" />
//             Liste des types d'entité
//           </CardTitle>
//           <CardDescription>
//             {pagination.total} type(s) d'entité trouvé(s)
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center gap-4 mb-4">
//             <div className="relative flex-1 max-w-sm">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//               <Input
//                 placeholder="Rechercher un type d'entité..."
//                 value={searchQuery}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>

//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Libellé</TableHead>
//                   <TableHead>Code</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Statut</TableHead>
//                   <TableHead>Créé le</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={6} className="text-center py-8">
//                       Chargement...
//                     </TableCell>
//                   </TableRow>
//                 ) : entityTypes.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={6} className="text-center py-8">
//                       Aucun type d'entité trouvé
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   entityTypes.map((entityType) => (
//                     <TableRow key={entityType.id}>
//                       <TableCell className="font-medium">{entityType.label}</TableCell>
//                       <TableCell>
//                         <Badge variant="outline">{entityType.code}</Badge>
//                       </TableCell>
//                       <TableCell className="max-w-xs truncate">
//                         {entityType.description}
//                       </TableCell>
//                       <TableCell>{getStatusBadge(entityType)}</TableCell>
//                       <TableCell>
//                         {new Date(entityType.created_at).toLocaleDateString('fr-FR')}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex items-center justify-end gap-2">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleToggleStatus(entityType)}
//                           >
//                             {!entityType.deleted_at ? (
//                               <EyeOff className="h-4 w-4" />
//                             ) : (
//                               <Eye className="h-4 w-4" />
//                             )}
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleEdit(entityType)}
//                           >
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleDelete(entityType)}
//                             className="text-destructive hover:text-destructive"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* Pagination */}
//           {pagination.lastPage > 1 && (
//             <div className="flex items-center justify-between mt-4">
//               <p className="text-sm text-muted-foreground">
//                 Page {pagination.currentPage} sur {pagination.lastPage}
//               </p>
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   Précédent
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                   disabled={currentPage === pagination.lastPage}
//                 >
//                   Suivant
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Modal de création */}
//       <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Nouveau type d'entité</DialogTitle>
//             <DialogDescription>
//               Créez un nouveau type d'entité dans le système
//             </DialogDescription>
//           </DialogHeader>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmitCreate)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="label"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Libellé *</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Ex: Compagnie d'assurance" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description *</FormLabel>
//                     <FormControl>
//                       <Textarea 
//                         placeholder="Description du type d'entité" 
//                         {...field} 
//                         rows={3}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
//                   Annuler
//                 </Button>
//                 <Button type="submit">Créer</Button>
//               </DialogFooter>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>

//       {/* Modal de modification */}
//       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Modifier le type d'entité</DialogTitle>
//             <DialogDescription>
//               Modifiez les informations du type d'entité
//             </DialogDescription>
//           </DialogHeader>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="label"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Libellé *</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Ex: Compagnie d'assurance" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description *</FormLabel>
//                     <FormControl>
//                       <Textarea 
//                         placeholder="Description du type d'entité" 
//                         {...field} 
//                         rows={3}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
//                   Annuler
//                 </Button>
//                 <Button type="submit">Modifier</Button>
//               </DialogFooter>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>

//       {/* Dialog de confirmation */}
//       <ConfirmDialog
//         open={confirmDialog.open}
//         onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
//         title={confirmDialog.title}
//         description={confirmDialog.description}
//         onConfirm={confirmDialog.onConfirm}
//       />
//     </div>
//   )
// }