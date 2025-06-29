import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import { useAssignmentsStore } from '@/stores/assignments'

interface AssignmentSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function AssignmentSelect({
  value,
  onValueChange,
  placeholder = "Sélectionnez un dossier...",
  disabled = false
}: AssignmentSelectProps) {
  const [open, setOpen] = useState(false)
  const { assignments, loading, fetchAssignments } = useAssignmentsStore()

  // Filtrer les dossiers avec le statut "edited"
  const editedAssignments = assignments
  //   .filter(
  //   assignment => assignment.status.code === 'edited'
  // )

  useEffect(() => {
    if (assignments.length === 0) {
      fetchAssignments()
    }
  }, [fetchAssignments, assignments.length])

  const selectedAssignment = editedAssignments.find(
    assignment => assignment.id.toString() === value
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : selectedAssignment ? (
            <div className="flex flex-col items-start text-left py-2">
              <span className="font-medium">{selectedAssignment.reference}</span>
              <span className="text-xs text-muted-foreground">
                {selectedAssignment.client.name} - {selectedAssignment.vehicle.license_plate}
              </span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher un dossier..." />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des dossiers...
              </div>
            ) : editedAssignments.length === 0 ? (
              <CommandEmpty>Aucun dossier édité trouvé.</CommandEmpty>
            ) : (
              <CommandGroup>
                {editedAssignments.map((assignment) => (
                  <CommandItem
                    key={assignment.id}
                    value={`${assignment.reference} ${assignment.client.name} ${assignment.vehicle.license_plate}`}
                    onSelect={() => {
                      onValueChange(assignment.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === assignment.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{assignment.reference}</span>
                      <span className="text-xs text-muted-foreground">
                        {assignment.client.name} - {assignment.vehicle.license_plate}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 