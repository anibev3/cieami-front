import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
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

interface Assignment {
  id: number
  reference: string
}

interface AssignmentSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function AssignmentSelect({ value, onValueChange, placeholder = "Sélectionner une assignation..." }: AssignmentSelectProps) {
  const [open, setOpen] = useState(false)
  const [assignments, setAssignments] = useState<Assignment[]>([])

  useEffect(() => {
    // Simuler le chargement des assignations
    // En production, vous devriez utiliser un service pour récupérer les assignations
    setAssignments([
      { id: 1, reference: "ASS-2025-001" },
      { id: 2, reference: "ASS-2025-002" },
      { id: 3, reference: "ASS-2025-003" },
    ])
  }, [])

  const selectedAssignment = assignments.find(assignment => assignment.id.toString() === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedAssignment ? selectedAssignment.reference : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher une assignation..." />
          <CommandList>
            <CommandEmpty>Aucune assignation trouvée.</CommandEmpty>
            <CommandGroup>
              {assignments.map((assignment) => (
                <CommandItem
                  key={assignment.id}
                  value={assignment.reference}
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
                  {assignment.reference}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 