// import { useState, useEffect } from 'react'
// import { toast } from 'sonner'
// import axiosInstance from '@/lib/axios'
// import { API_CONFIG } from '@/config/api'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { 
//   Plus, 
//   Trash2, 
//   Receipt, 
//   Calculator,
//   Check,
//   Loader2
// } from 'lucide-react'

// interface ReceiptType {
//   id: number
//   label: string
//   code: string
// }

// interface Receipt {
//   receipt_type_id: number
//   amount: number
// }

// interface ReceiptModalProps {
//   isOpen: boolean
//   assignmentId: number
//   assignmentAmount?: number
//   onSave: (receipts: Receipt[]) => void
//   onClose: () => void
// }

// export function ReceiptModal({
//   isOpen,
//   assignmentId,
//   assignmentAmount = 0,
//   onSave,
//   onClose
// }: ReceiptModalProps) {
//   const [receiptTypes, setReceiptTypes] = useState<ReceiptType[]>([])
//   const [receipts, setReceipts] = useState<Receipt[]>([])
//   const [loading, setLoading] = useState(false)
//   const [saving, setSaving] = useState(false)

//   // Charger les types de quittances
//   useEffect(() => {
//     if (isOpen) {
//       loadReceiptTypes()
//     }
//   }, [isOpen])

//   const loadReceiptTypes = async () => {
//     try {
//       setLoading(true)
//       const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.RECEIPT_TYPES}`)
//       setReceiptTypes(response.data.data)
//     } catch (_error) {
//       toast.error('Erreur lors du chargement des types de quittances')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Ajouter une quittance
//   const addReceipt = () => {
//     setReceipts([...receipts, { receipt_type_id: 0, amount: 0 }])
//   }

//   // Supprimer une quittance
//   const removeReceipt = (index: number) => {
//     const newReceipts = receipts.filter((_, i) => i !== index)
//     setReceipts(newReceipts)
//   }

//   // Mettre à jour une quittance
//   const updateReceipt = (index: number, field: keyof Receipt, value: number) => {
//     const newReceipts = [...receipts]
//     newReceipts[index] = { ...newReceipts[index], [field]: value }
//     setReceipts(newReceipts)
//   }

//   // Sauvegarder les quittances
//   const handleSave = async () => {
//     // Validation
//     const validReceipts = receipts.filter(r => r.receipt_type_id > 0 && r.amount > 0)
    
//     if (validReceipts.length === 0) {
//       toast.error('Veuillez ajouter au moins une quittance valide')
//       return
//     }

//     try {
//       setSaving(true)
      
//       const payload = {
//         assignment_id: assignmentId.toString(),
//         receipts: validReceipts.map(r => ({
//           receipt_type_id: r.receipt_type_id.toString(),
//           amount: r.amount
//         }))
//       }

//       await axiosInstance.post(`${API_CONFIG.ENDPOINTS.RECEIPTS}`, payload)
      
//       toast.success(`${validReceipts.length} quittance(s) ajoutée(s) avec succès`, {
//         duration: 1000,
//       })
//       onSave(validReceipts)
//     } catch (_error) {
//       toast.error('Erreur lors de l\'ajout des quittances')
//     } finally {
//       setSaving(false)
//     }
//   }

//   // Calculer le total des quittances
//   const totalReceipts = receipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0)

//   // Formater les montants
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'XOF',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount)
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-3 text-xl">
//             <div className="p-2 bg-green-100 rounded-full">
//               <Receipt className="h-6 w-6 text-green-600" />
//             </div>
//             Ajouter des quittances
//           </DialogTitle>
//           <DialogDescription className="text-base text-gray-600">
//             Ajoutez les quittances correspondant à ce dossier d'expertise
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           {/* Informations du dossier */}
//           <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
//             <CardHeader className="pb-3">
//               <CardTitle className="flex items-center gap-2 text-lg text-black-800">
//                 <Calculator className="h-5 w-5" />
//                 Informations du dossier
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-sm text-gray-600">Dossier</Label>
//                   <p className="font-semibold text-blue-800">#{assignmentId}</p>
//                 </div>
//                 <div>
//                   <Label className="text-sm text-gray-600">Montant total</Label>
//                   <p className="font-semibold text-black-600">{formatCurrency(assignmentAmount)}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Liste des quittances */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
//                 <Receipt className="h-5 w-5 text-purple-600" />
//                 Quittances
//                 {receipts.length > 0 && (
//                   <Badge variant="secondary" className="bg-purple-100 text-purple-800">
//                     {receipts.length}
//                   </Badge>
//                 )}
//               </h4>
//               <Button 
//                 onClick={addReceipt}
//                 className=" text-white"
//                 disabled={loading}
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Ajouter une quittance
//               </Button>
//             </div>

//             {receipts.length === 0 && (
//               <div className="text-center py-8">
//                 <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
//                   <Receipt className="h-12 w-12 text-grey-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune quittance</h3>
//                   <p className="text-gray-500 mb-4">Ajoutez les quittances correspondant à ce dossier</p>
//                   <Button 
//                     onClick={addReceipt}
//                     className="0 text-white"
//                     disabled={loading}
//                   >
//                     <Plus className="mr-2 h-4 w-4" />
//                     Ajouter la première quittance
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {receipts.map((receipt, index) => (
//               <Card key={index} className="border-purple-200 bg-purple-50">
//                 <CardContent className="p-4">
//                   <div className="flex items-center justify-between mb-3">
//                     <h5 className="font-semibold text-purple-800 flex items-center gap-2">
//                       <Receipt className="h-4 w-4" />
//                       Quittance #{index + 1}
//                     </h5>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => removeReceipt(index)}
//                       className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-sm font-medium text-gray-700 mb-2">Type de quittance</Label>
//                       <Select 
//                         value={receipt.receipt_type_id.toString()} 
//                         onValueChange={(value) => updateReceipt(index, 'receipt_type_id', Number(value))}
//                       >
//                         <SelectTrigger className={`w-full ${!receipt.receipt_type_id ? 'border-red-300 bg-red-50' : ''}`}>
//                           <SelectValue placeholder={!receipt.receipt_type_id ? "⚠️ Sélectionner un type" : "Sélectionner un type"} />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {receiptTypes.map((type) => (
//                             <SelectItem key={type.id} value={type.id.toString()}>
//                               {type.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium text-gray-700 mb-2">Montant (FCFA)</Label>
//                       <Input
//                         type="number"
//                         value={receipt.amount}
//                         onChange={(e) => updateReceipt(index, 'amount', Number(e.target.value))}
//                         placeholder="0"
//                         className={!receipt.amount ? 'border-red-300 bg-red-50' : ''}
//                       />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {/* Récapitulatif */}
//           {receipts.length > 0 && (
//             <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-semibold text-green-800 mb-1">Récapitulatif</h4>
//                     <p className="text-sm text-green-600">
//                       {receipts.filter(r => r.receipt_type_id > 0 && r.amount > 0).length} quittance(s) valide(s)
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-gray-600">Total des quittances</p>
//                     <p className="text-xl font-bold text-green-600">{formatCurrency(totalReceipts)}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         <div className="flex justify-end gap-3 pt-4 border-t">
//           <Button 
//             variant="outline" 
//             onClick={onClose}
//             className="px-6"
//             disabled={saving}
//           >
//             Annuler
//           </Button>
//           <Button 
//             onClick={handleSave}
//             disabled={saving || receipts.length === 0}
//             className="px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
//           >
//             {saving ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Sauvegarde...
//               </>
//             ) : (
//               <>
//                 <Check className="mr-2 h-4 w-4" />
//                 Sauvegarder les quittances
//               </>
//             )}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// } 