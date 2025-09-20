import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePhotoTypeStore } from "@/stores/photoTypeStore"
import { X } from "lucide-react"
import { useEffect } from "react"

interface PhotoTypeSelectProps {
  value: string
  onValueChange: (value: string) => void
}

export function PhotoTypeSelect({ value, onValueChange }: PhotoTypeSelectProps) {

  const {
    photoTypes,
      fetchPhotoTypes,
      loading
  } = usePhotoTypeStore()

  useEffect(() => {
    fetchPhotoTypes()
  }, [fetchPhotoTypes])

  return (
    <>
        <div className="space-y-2">
                <Label htmlFor="edit-photo-type" className="text-sm font-medium">
                  Type de photo
                </Label>
                <Select
                  value={value}
                  onValueChange={(value) => onValueChange(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loading ? "Chargement..." : "Sélectionnez un type"} />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {photoTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span>{type.label}</span>
                          {type.description && (
                            <span className="text-xs text-muted-foreground">
                              - {type.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
          </div>  
          {!!value && !loading && (
            <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="p-0 text-white hover:text-foreground bg-red-500"
              aria-label="Effacer"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onValueChange('') }}
            >
              <X className="h-3 w-3" /> Supprimer le type
            </Button>
            </div>
          )}
    </>
  )
}