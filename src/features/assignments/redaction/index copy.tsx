// /* eslint-disable no-console */
// import { useState, useEffect } from 'react'
// import { useParams } from '@tanstack/react-router'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Separator } from '@/components/ui/separator'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { 
//   ArrowLeft, 
//   FileText, 
//   Car, 
//   User, 
//   Building2, 
//   Calculator,
//   Receipt,
//   DollarSign,
//   MapPin,
//   Phone,
//   Mail,
//   Hash,
//   AlertCircle,
//   CheckCircle,
//   Clock,
//   Loader2,
//   Save
// } from 'lucide-react'
// import { useNavigate } from '@tanstack/react-router'
// import { toast } from 'sonner'
// import { Header } from '@/components/layout/header'
// import { ThemeSwitch } from '@/components/theme-switch'
// import { ProfileDropdown } from '@/components/profile-dropdown'
// import { Main } from '@/components/layout/main'
// import { ShockWorkforceTableV2 } from '@/features/assignments/components/shock-workforce-table-v2'
// import { ReceiptManagement } from '@/features/assignments/components/receipt-management'
// import { assignmentService } from '@/services/assignmentService'

// interface Assignment {
//   id: number
//   reference: string
//   policy_number: string
//   claim_number: string
//   claim_starts_at: string
//   claim_ends_at: string
//   expertise_date: string
//   expertise_place: string | null
//   received_at: string
//   circumstance: string
//   damage_declared: string
//   observation: string | null
//   point_noted: string
//   shock_amount_excluding_tax: string
//   shock_amount_tax: string
//   shock_amount: string
//   other_cost_amount_excluding_tax: string
//   other_cost_amount_tax: string
//   other_cost_amount: string
//   receipt_amount_excluding_tax: string | null
//   receipt_amount_tax: string | null
//   receipt_amount: string | null
//   total_amount_excluding_tax: string
//   total_amount_tax: string
//   total_amount: string
//   insurer: {
//     id: number
//     code: string
//     name: string
//     email: string
//     telephone: string | null
//     address: string | null
//   }
//   repairer: {
//     id: number
//     code: string
//     name: string
//     email: string
//     telephone: string | null
//     address: string | null
//   }
//   vehicle: {
//     id: number
//     license_plate: string
//     usage: string
//     type: string
//     option: string
//     mileage: string
//     serial_number: string
//     fiscal_power: number
//     energy: string
//     nb_seats: number
//   }
//   client: {
//     id: number
//     name: string
//     email: string
//     phone_1: string | null
//     phone_2: string | null
//     address: string
//   }
//   status: {
//     id: number
//     code: string
//     label: string
//   }
//   shocks: Array<{
//     id: number
//     workforces: Array<{
//       uid?: string
//       id?: number
//       workforce_type_id?: number
//       workforce_type_label?: string
//       nb_hours: string | number
//       work_fee?: string | number
//       discount: string | number
//       amount_excluding_tax?: string | number
//       amount_tax?: string | number
//       amount?: string | number
//       hourly_rate_id?: string | number
//       paint_type_id?: string | number
//       workforce_type?: {
//         id: number
//         code: string
//         label: string
//       }
//     }>
//   }>
//   other_costs: Array<{
//     id: number
//     amount_excluding_tax: string
//     amount_tax: string
//     amount: string
//     other_cost_type_label: string
//     other_cost_type: {
//       id: number
//       code: string
//       label: string
//     }
//   }>
//   receipts: Array<{
//     id: number
//     amount_excluding_tax: string
//     amount_tax: string
//     amount: string
//     receipt_type: {
//       id: number
//       code: string
//       label: string
//     }
//   }>
// }

// export default function EditReportPage() {
//   const { id } = useParams({ strict: false }) as { id: string } 
//   const navigate = useNavigate()
//   const [assignment, setAssignment] = useState<Assignment | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [activeTab, setActiveTab] = useState('overview')

//   // Charger les données du dossier
//   useEffect(() => {
//     const fetchAssignment = async () => {
//       try {
//         setLoading(true)
//         const response = await assignmentService.getAssignment(Number(id))
        
//         // La réponse API a une structure { status, message, data }
//         // Nous devons extraire les données de response.data
//         if (response && typeof response === 'object' && 'data' in response) {
//           setAssignment(response.data as unknown as Assignment)
//         } else {
//           // Si la réponse est directement les données
//           setAssignment(response as unknown as Assignment)
//         }
//       } catch (err) {
//         console.log(err)
//         setError('Erreur lors du chargement du dossier')
//         toast.error('Erreur lors du chargement du dossier')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchAssignment()
//   }, [id])

//   // Fonction pour rafraîchir les données du dossier
//   const refreshAssignment = async () => {
//     try {
//       const response = await assignmentService.getAssignment(Number(id))
      
//       if (response && typeof response === 'object' && 'data' in response) {
//         setAssignment(response.data as unknown as Assignment)
//       } else {
//         setAssignment(response as unknown as Assignment)
//       }
//     } catch (err) {
//       console.log(err)
//       toast.error('Erreur lors du rafraîchissement du dossier')
//     }
//   }

//   // Fonction de formatage des montants
//   const formatCurrency = (amount: string | number | null) => {
//     if (amount === null || amount === undefined) return '0 FCFA'
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'XOF',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(Number(amount) || 0)
//   }

//   // Fonction de formatage des dates
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     })
//   }

//   // Fonction pour obtenir l'icône du statut
//   const getStatusIcon = (statusCode: string) => {
//     switch (statusCode) {
//       case 'pending': return <Clock className="h-4 w-4" />
//       case 'opened': return <AlertCircle className="h-4 w-4" />
//       case 'realized': return <CheckCircle className="h-4 w-4" />
//       case 'edited': return <FileText className="h-4 w-4" />
//       case 'closed': return <CheckCircle className="h-4 w-4" />
//       case 'paid': return <CheckCircle className="h-4 w-4" />
//       case 'cancelled': return <AlertCircle className="h-4 w-4" />
//       default: return <Clock className="h-4 w-4" />
//     }
//   }

//   // Fonction pour obtenir la couleur du statut
//   const getStatusColor = (statusCode: string) => {
//     switch (statusCode) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800'
//       case 'opened': return 'bg-blue-100 text-blue-800'
//       case 'realized': return 'bg-green-100 text-green-800'
//       case 'edited': return 'bg-purple-100 text-purple-800'
//       case 'closed': return 'bg-gray-100 text-gray-800'
//       case 'paid': return 'bg-emerald-100 text-emerald-800'
//       case 'cancelled': return 'bg-red-100 text-red-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   if (loading) {
//     return (
//       <>
//         <Header fixed>
//           <div className='ml-auto flex items-center space-x-4'>
//             <ThemeSwitch />
//             <ProfileDropdown />
//           </div>
//         </Header>
//         <Main>
//           <div className="flex items-center justify-center h-96">
//             <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
//             <span className="ml-2 text-gray-600">Chargement du dossier...</span>
//           </div>
//         </Main>
//       </>
//     )
//   }

//   if (error || !assignment) {
//     return (
//       <>
//         <Header fixed>
//           <div className='ml-auto flex items-center space-x-4'>
//             <ThemeSwitch />
//             <ProfileDropdown />
//           </div>
//         </Header>
//         <Main>
//           <div className="flex items-center justify-center h-96">
//             <div className="text-center">
//               <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h3>
//               <p className="text-gray-600 mb-4">{error || 'Dossier non trouvé'}</p>
//               <Button onClick={() => navigate({ to: '/assignments' })}>
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Retour aux dossiers
//               </Button>
//             </div>
//           </div>
//         </Main>
//       </>
//     )
//   }

//   return (
//     <>
//       <Header fixed>
//         <div className='ml-auto flex items-center space-x-4'>
//           <ThemeSwitch />
//           <ProfileDropdown />
//         </div>
//       </Header>
//       <Main>
//         <div className="flex h-screen">
//           {/* Sidebar fixe */}
//           <div className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
//             {/* Header de la sidebar */}
//             <div className="p-4 border-b border-gray-200">
//               <div className="flex items-center gap-3 mb-4">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => navigate({ to: '/assignments' })}
//                   className="hover:bg-gray-100"
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                 </Button>
//                 <div>
//                   <h1 className="text-sm font-bold">Modifier le rapport</h1>
//                   <p className="text-xs text-gray-500">#{assignment.reference}</p>
//                 </div>
//               </div>
              
//               {/* Statut */}
//               <div className="flex items-center gap-2 mb-4">
//                 {getStatusIcon(assignment.status.code)}
//                 <Badge className={getStatusColor(assignment.status.code)}>
//                   {assignment.status.label}
//                 </Badge>
//               </div>

//               {/* Montant total */}
//               <div className="bg-gray-50 rounded-lg p-3">
//                 <div className="text-xs text-gray-600 mb-1">Montant total</div>
//                 <div className="text-lg font-bold text-green-600">
//                   {formatCurrency(assignment.total_amount)}
//                 </div>
//               </div>
//             </div>

//             {/* Navigation */}
//             <ScrollArea className="flex-1">
//               <nav className="p-4 space-y-1">
//                 <button
//                   onClick={() => setActiveTab('overview')}
//                   className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
//                     activeTab === 'overview' 
//                       ? 'bg-gray-100 text-gray-900 font-medium' 
//                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <FileText className="h-4 w-4" />
//                     <span>Vue d'ensemble</span>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('workforce')}
//                   className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
//                     activeTab === 'workforce' 
//                       ? 'bg-gray-100 text-gray-900 font-medium' 
//                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <Calculator className="h-4 w-4" />
//                     <span>Main d'œuvre</span>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('costs')}
//                   className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
//                     activeTab === 'costs' 
//                       ? 'bg-gray-100 text-gray-900 font-medium' 
//                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <DollarSign className="h-4 w-4" />
//                     <span>Autres coûts</span>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('receipts')}
//                   className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
//                     activeTab === 'receipts' 
//                       ? 'bg-gray-100 text-gray-900 font-medium' 
//                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <Receipt className="h-4 w-4" />
//                     <span>Quittances</span>
//                   </div>
//                 </button>
//               </nav>
//             </ScrollArea>
//           </div>

//           {/* Contenu principal avec marge pour la sidebar */}
//           <div className="flex-1 ml-64">
//             <ScrollArea className="h-full">
//               <div className="p-6">
//                 {/* Vue d'ensemble */}
//                 {activeTab === 'overview' && (
//                   <div className="space-y-6">
//                     <div className="flex items-center justify-between">
//                       <h2 className="text-xl font-bold text-gray-900">Vue d'ensemble</h2>
//                       <Button className="bg-black hover:bg-gray-800">
//                         <Save className="mr-2 h-4 w-4" />
//                         Sauvegarder
//                       </Button>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                       {/* Informations générales */}
//                       <Card className="shadow-none">
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <Hash className="h-5 w-5" />
//                             Informations générales
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="text-xs font-medium text-gray-600">Référence</label>
//                               <p className="text-base font-semibold">{assignment.reference}</p>
//                             </div>
//                             <div>
//                               <label className="text-xs font-medium text-gray-600">Numéro de police</label>
//                               <p className="text-base font-semibold">{assignment.policy_number}</p>
//                             </div>
//                             <div>
//                               <label className="text-xs font-medium text-gray-600">Numéro de sinistre</label>
//                               <p className="text-base font-semibold">{assignment.claim_number}</p>
//                             </div>
//                             <div>
//                               <label className="text-xs font-medium text-gray-600">Date d'expertise</label>
//                               <p className="text-base font-semibold">{formatDate(assignment.expertise_date)}</p>
//                             </div>
//                           </div>
                          
//                           <Separator />
                          
//                           <div>
//                             <label className="text-xs font-medium text-gray-600">Circonstances</label>
//                             <p className="text-sm text-gray-900">{assignment.circumstance}</p>
//                           </div>
                          
//                           <div>
//                             <label className="text-xs font-medium text-gray-600">Dégâts déclarés</label>
//                             <p className="text-sm text-gray-900">{assignment.damage_declared}</p>
//                           </div>
                          
//                           <div>
//                             <label className="text-xs font-medium text-gray-600">Points notés</label>
//                             <p className="text-sm text-gray-900">{assignment.point_noted}</p>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* Véhicule */}
//                       {assignment.vehicle && (
//                         <Card className="shadow-none">
//                           <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                               <Car className="h-5 w-5" />
//                               Véhicule
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                               <div>
//                                 <label className="text-xs font-medium text-gray-600">Plaque</label>
//                                 <p className="text-base font-semibold">{assignment.vehicle.license_plate}</p>
//                               </div>
//                               <div>
//                                 <label className="text-xs font-medium text-gray-600">Numéro de série</label>
//                                 <p className="text-base font-semibold">{assignment.vehicle.serial_number}</p>
//                               </div>
//                               <div>
//                                 <label className="text-xs font-medium text-gray-600">Kilométrage</label>
//                                 <p className="text-base font-semibold">{assignment.vehicle.mileage} km</p>
//                               </div>
//                               <div>
//                                 <label className="text-xs font-medium text-gray-600">Puissance fiscale</label>
//                                 <p className="text-base font-semibold">{assignment.vehicle.fiscal_power} CV</p>
//                               </div>
//                               <div>
//                                 <label className="text-xs font-medium text-gray-600">Énergie</label>
//                                 <p className="text-base font-semibold">{assignment.vehicle.energy}</p>
//                               </div>
//                               <div>
//                                 <label className="text-xs font-medium text-gray-600">Places</label>
//                                 <p className="text-base font-semibold">{assignment.vehicle.nb_seats}</p>
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       )}

//                       {/* Client */}
//                       {assignment.client && (
//                         <Card className="shadow-none">
//                           <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                               <User className="h-5 w-5" />
//                               Client
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className="space-y-4">
//                             <div>
//                               <label className="text-xs font-medium text-gray-600">Nom</label>
//                               <p className="text-base font-semibold">{assignment.client.name}</p>
//                             </div>
                            
//                             <div className="flex items-center gap-2">
//                               <Mail className="h-4 w-4 text-gray-500" />
//                               <span className="text-sm">{assignment.client.email}</span>
//                             </div>
                            
//                             {assignment.client.phone_1 && (
//                               <div className="flex items-center gap-2">
//                                 <Phone className="h-4 w-4 text-gray-500" />
//                                 <span className="text-sm">{assignment.client.phone_1}</span>
//                               </div>
//                             )}
                            
//                             <div className="flex items-start gap-2">
//                               <MapPin className="h-4 w-4 text-gray-500 mt-1" />
//                               <span className="text-sm whitespace-pre-line">{assignment.client.address}</span>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       )}

//                       {/* Assureur et Réparateur */}
//                       {(assignment.insurer || assignment.repairer) && (
//                         <Card className="shadow-none">
//                           <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                               <Building2 className="h-5 w-5" />
//                               Assureur & Réparateur
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className="space-y-6">
//                             {assignment.insurer && (
//                               <div>
//                                 <h4 className="font-semibold text-gray-900 mb-2">Assureur</h4>
//                                 <div className="bg-gray-50 rounded-lg p-3">
//                                   <p className="font-semibold">{assignment.insurer.name}</p>
//                                   <p className="text-xs text-gray-600">{assignment.insurer.code}</p>
//                                   <p className="text-xs text-gray-600">{assignment.insurer.email}</p>
//                                 </div>
//                               </div>
//                             )}
                            
//                             {assignment.repairer && (
//                               <div>
//                                 <h4 className="font-semibold text-gray-900 mb-2">Réparateur</h4>
//                                 <div className="bg-gray-50 rounded-lg p-3">
//                                   <p className="font-semibold">{assignment.repairer.name}</p>
//                                   <p className="text-xs text-gray-600">{assignment.repairer.code}</p>
//                                   <p className="text-xs text-gray-600">{assignment.repairer.email}</p>
//                                 </div>
//                               </div>
//                             )}
//                           </CardContent>
//                         </Card>
//                       )}
//                     </div>

//                     {/* Récapitulatif financier */}
//                     <Card className="shadow-none">
//                       <CardHeader>
//                         <CardTitle>Récapitulatif financier</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//                           <div className="text-center">
//                             <div className="text-xs text-gray-600 mb-1">Chocs</div>
//                             <div className="text-xl font-bold text-blue-600">
//                               {formatCurrency(assignment.shock_amount)}
//                             </div>
//                           </div>
//                           <div className="text-center">
//                             <div className="text-xs text-gray-600 mb-1">Autres coûts</div>
//                             <div className="text-xl font-bold text-orange-600">
//                               {formatCurrency(assignment.other_cost_amount)}
//                             </div>
//                           </div>
//                           <div className="text-center">
//                             <div className="text-xs text-gray-600 mb-1">Quittances</div>
//                             <div className="text-xl font-bold text-green-600">
//                               {formatCurrency(assignment.receipt_amount)}
//                             </div>
//                           </div>
//                           <div className="text-center">
//                             <div className="text-xs text-gray-600 mb-1">Total</div>
//                             <div className="text-xl font-bold text-purple-600">
//                               {formatCurrency(assignment.total_amount)}
//                             </div>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 )}

//                 {/* Main d'œuvre */}
//                 {activeTab === 'workforce' && (
//                   <div className="space-y-6">
//                     <div className="flex items-center justify-between">
//                       <h2 className="text-xl font-bold text-gray-900">Main d'œuvre</h2>
//                     </div>

//                     {assignment.shocks && assignment.shocks.length > 0 ? (
//                       assignment.shocks.map((shock, shockIndex) => (
//                         <div key={shock.id}>
//                           <CardHeader>
//                             <CardTitle>Choc #{shock.id}</CardTitle>
//                           </CardHeader>
//                           <div>
//                             <ShockWorkforceTableV2
//                               shockId={shock.id}
//                               workforces={shock.workforces || []}
//                               onUpdate={(updatedWorkforces) => {
//                                 // Mettre à jour les données locales
//                                 const updatedAssignment = { ...assignment }
//                                 updatedAssignment.shocks[shockIndex].workforces = updatedWorkforces
//                                 setAssignment(updatedAssignment)
//                               }}
//                               onAssignmentRefresh={refreshAssignment}
//                             />
//                           </div>
                          
//                           <div className="border-b border-t mt-4 mb-4 border-gray-200">
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <Card className="shadow-none">
//                         <CardContent className="p-6">
//                           <div className="text-center py-8 text-gray-500">
//                             Aucun choc enregistré
//                           </div>
//                         </CardContent>
//                       </Card>
//                     )}
//                   </div>
//                 )}

//                 {/* Autres coûts */}
//                 {activeTab === 'costs' && (
//                   <div className="space-y-6">
//                     <div className="flex items-center justify-between">
//                       <h2 className="text-xl font-bold text-gray-900">Autres coûts</h2>
//                     </div>

//                     <Card className="shadow-none">
//                       <CardContent className="p-6">
//                         {assignment.other_costs && assignment.other_costs.length > 0 ? (
//                           <div className="space-y-4">
//                             {assignment.other_costs.map((cost) => (
//                               <div key={cost.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                                 <div>
//                                   <h4 className="font-semibold">{cost.other_cost_type_label}</h4>
//                                   <p className="text-xs text-gray-600">{cost.other_cost_type.code}</p>
//                                 </div>
//                                 <div className="text-right">
//                                   <div className="text-base font-bold text-green-600">
//                                     {formatCurrency(cost.amount)}
//                                   </div>
//                                   <div className="text-xs text-gray-600">
//                                     HT: {formatCurrency(cost.amount_excluding_tax)}
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         ) : (
//                           <div className="text-center py-8 text-gray-500">
//                             Aucun autre coût enregistré
//                           </div>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </div>
//                 )}

//                 {/* Quittances */}
//                 {activeTab === 'receipts' && (
//                   <ReceiptManagement
//                     assignmentId={assignment.id}
//                     receipts={assignment.receipts || []}
//                     onRefresh={refreshAssignment}
//                   />
//                 )}
//               </div>
//             </ScrollArea>
//           </div>
//         </div>
//       </Main>
//     </>
//   )
// } 