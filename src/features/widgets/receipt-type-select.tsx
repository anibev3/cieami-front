import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  Check, 
  ChevronsUpDown, 
  Plus, 
  Loader2,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { receiptTypeService } from '@/services/receiptTypeService'

interface ReceiptType {
  id: number
  label: string
  code: string
  description?: string
}

interface ReceiptTypeSelectProps {
  value?: number | null
  onValueChange: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showCreateOption?: boolean
}

export function ReceiptTypeSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un type de quittance",
  disabled = false,
  className,
  showCreateOption = true
}: ReceiptTypeSelectProps) {
  const [receiptTypes, setReceiptTypes] = useState<ReceiptType[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [creatingType, setCreatingType] = useState(false)
  
  // États pour la création de type
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    code: '',
    label: '',
    description: ''
  })

  // Charger les types de quittances
  useEffect(() => {
    loadReceiptTypes()
  }, [])

  const loadReceiptTypes = async () => {
    try {
      setLoading(true)
      const response = await receiptTypeService.getAll()
      setReceiptTypes(response.data)
    } catch (_error) {
      toast.error('Erreur lors du chargement des types de quittances')
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour créer un type de quittance
  const handleCreateReceiptType = async () => {
    if (!createForm.code || !createForm.label) {
      toast.error('Le code et le libellé sont obligatoires')
      return
    }

    try {
      setCreatingType(true)
      const response = await receiptTypeService.create({
        code: createForm.code,
        label: createForm.label,
        description: createForm.description
      })
      
      toast.success('Type de quittance créé avec succès')
      
      // Ajouter le nouveau type à la liste
      setReceiptTypes([...receiptTypes, response])
      
      // Réinitialiser le formulaire
      setCreateForm({ code: '', label: '', description: '' })
      setShowCreateModal(false)
      
      // Sélectionner automatiquement le nouveau type
      onValueChange(response.id)
      setOpen(false)
      loadReceiptTypes()
    } catch (_error) {
      toast.error('Erreur lors de la création du type de quittance')
    } finally {
      setCreatingType(false)
    }
  }

  // Vérifier si le type est automatique (ID = 1)
  const isAutomaticReceiptType = (receiptTypeId: number) => {
    return receiptTypeId === 1
  }

  const selectedType = receiptTypes.find(type => type.id === value)

  return (
    <>
      <div>

                  
                
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between",
                !value && "text-muted-foreground",
                className
              )}
              disabled={disabled || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : selectedType ? (
                <div className="flex items-center gap-2">
                  <span>{selectedType.label}</span>
                  {isAutomaticReceiptType(selectedType.id) && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                      Auto
                    </Badge>
                  )}
                </div>
              ) : (
                placeholder
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Rechercher un type..." />
              <CommandList>
                <CommandEmpty>
                  {showCreateOption ? (
                    <div className="p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Aucun type trouvé
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowCreateModal(true)
                          setOpen(false)
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Créer un nouveau type
                      </Button>
                    </div>
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground">
                      Aucun type trouvé
                    </p>
                  )}
                </CommandEmpty>
                <CommandGroup>
                  {receiptTypes.map((type) => (
                    <CommandItem
                      key={type.id}
                      value={`${type.label} ${type.code}`}
                      onSelect={() => {
                        onValueChange(type.id)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === type.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <span>{type.label}</span>
                        {isAutomaticReceiptType(type.id) && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                            Auto
                          </Badge>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                  {showCreateOption && (
                    <CommandItem
                      onSelect={() => {
                        setShowCreateModal(true)
                        setOpen(false)
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Créer un nouveau type...
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className='flex justify-end mt-2'>
                  <Button
                    onClick={() => {
                      setShowCreateModal(true)
                      setOpen(false)
                    }}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un nouveau type
                  </Button>
                  </div>
      </div>
      {/* Modal de création de type de quittance */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Créer un nouveau type de quittance
            </DialogTitle>
            <DialogDescription>
              Créez un nouveau type de quittance pour l'utiliser dans vos dossiers
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Code *</Label>
              <Input
                value={createForm.code}
                onChange={(e) => setCreateForm({ ...createForm, code: e.target.value })}
                placeholder="ex: frais_expertise"
                className={!createForm.code ? 'border-red-300 bg-red-50' : ''}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Libellé *</Label>
              <Input
                value={createForm.label}
                onChange={(e) => setCreateForm({ ...createForm, label: e.target.value })}
                placeholder="ex: Frais d'expertise"
                className={!createForm.label ? 'border-red-300 bg-red-50' : ''}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Description</Label>
              <Input
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="Description optionnelle"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCreateModal(false)
                setCreateForm({ code: '', label: '', description: '' })
              }}
              disabled={creatingType}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleCreateReceiptType}
              disabled={creatingType || !createForm.code || !createForm.label}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {creatingType ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer le type
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 