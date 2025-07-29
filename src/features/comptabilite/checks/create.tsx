import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCheckStore } from '@/stores/checkStore'
import { CreateCheckData } from '@/types/comptabilite'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, CreditCard, Building2, Calendar, Euro, Upload, X, Image, FileImage } from 'lucide-react'
import { PaymentSelect } from './components/payment-select'
import { BankSelect } from './components/bank-select'
import { DatePicker } from '@/features/widgets/date-picker'
import { toast } from 'sonner'

export default function CreateCheckPage() {
  const navigate = useNavigate()
  const { createCheck, loading } = useCheckStore()
  const [formData, setFormData] = useState<CreateCheckData>({
    payment_id: '',
    bank_id: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileSelect = (file: File) => {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide')
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB')
      return
    }

    setSelectedFile(file)
    
    // Créer l'URL de prévisualisation
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.payment_id || !formData.bank_id || !formData.date || formData.amount <= 0) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      const checkData = {
        ...formData,
        photo: selectedFile || undefined
      }
      await createCheck(checkData)
      toast.success('Chèque créé avec succès')
      navigate({ to: '/comptabilite/checks' })
    } catch (_error) {
      toast.error('Erreur lors de la création du chèque')
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-300 to-blue-500 p-6 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 w-full justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/comptabilite/checks' })}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              
            </Button>
            <h1 className="text-2xl font-bold">Nouveau chèque</h1>
          </div>
          
          {/* Breadcrumbs */}
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-100">
            <span>Comptabilité</span>
            <span>/</span>
            <span>Chèques</span>
            <span>/</span>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Création
            </Badge>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className=" mx-auto shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Informations du chèque
          </CardTitle>
          <CardDescription>
            Remplissez les informations nécessaires pour créer un nouveau chèque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Selection */}
            <div className="space-y-2">
              <Label htmlFor="payment_id" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Paiement associé *
              </Label>
              <PaymentSelect
                value={formData.payment_id}
                onValueChange={(value) => setFormData({ ...formData, payment_id: value })}
                placeholder="Sélectionnez le paiement associé..."
              />
            </div>

            {/* Bank Selection */}
            <div className="space-y-2">
              <Label htmlFor="bank_id" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Banque *
              </Label>
              <BankSelect
                value={formData.bank_id}
                onValueChange={(value) => setFormData({ ...formData, bank_id: value })}
                placeholder="Sélectionnez la banque..."
              />
            </div>

            {/* Amount and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Montant (XOF) *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  placeholder="0.00"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date *
                </Label>
                <DatePicker
                  value={formData.date}
                  onValueChange={(date: string) => 
                    setFormData({ 
                      ...formData, 
                      date: date
                    })
                  }
                  placeholder="Sélectionnez une date..."
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Photo du chèque
              </Label>
              
              {!previewUrl ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900">
                      Glissez-déposez votre image ici
                    </p>
                    <p className="text-sm text-gray-500">
                      ou cliquez pour sélectionner un fichier
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, JPEG jusqu'à 5MB
                    </p>
                  </div>
                  
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(file)
                    }}
                    className="hidden"
                    id="photo-upload"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <FileImage className="mr-2 h-4 w-4" />
                    Sélectionner une image
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Prévisualisation du chèque"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={removeFile}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{selectedFile?.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedFile?.type}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/comptabilite/checks' })}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer le chèque
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 