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

interface Assignment {
  id: number
  reference: string
  status?: {
    code: string
    label: string
  }
}

interface AssignmentSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function AssignmentSelect({ value, onValueChange, placeholder = "Sélectionner un dossier..." }: AssignmentSelectProps) {
  const [open, setOpen] = useState(false)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(false)
  
  const { fetchAssignments, assignments: storeAssignments, loading: storeLoading } = useAssignmentsStore()

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true)
      try {
        await fetchAssignments(1, { is_selected: true })
      } catch (_error) {
        // Erreur silencieuse - les erreurs sont gérées par le store
      } finally {
        setLoading(false)
      }
    }

    loadAssignments()
  }, [fetchAssignments])

  useEffect(() => {
    if (storeAssignments.length > 0) {
      setAssignments(storeAssignments.map(assignment => ({
        id: assignment.id,
        reference: assignment.reference,
        status: assignment.status
      })))
    }
  }, [storeAssignments])

  const selectedAssignment = assignments.find(assignment => assignment.id.toString() === value)

  const getStatusColor = (statusCode?: string) => {
    switch (statusCode) {
      case 'pending': return 'text-yellow-600'
      case 'in_progress': return 'text-blue-600'
      case 'completed': return 'text-green-600'
      case 'cancelled': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading || storeLoading}
        >
          {loading || storeLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : selectedAssignment ? (
            <div className="flex items-center gap-2">
              <span>{selectedAssignment.reference}</span>
              {/* {selectedAssignment.status && (
                <span className={`text-xs ${getStatusColor(selectedAssignment.status.code)}`}>
                  {selectedAssignment.status.label}
                </span>
              )} */}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher une assignation..." />
          <CommandList>
            <CommandEmpty>
              {loading || storeLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Chargement des assignations...
                </div>
              ) : (
                "Aucune assignation trouvée."
              )}
            </CommandEmpty>
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
                  <div className="flex items-center justify-between w-full">
                    <span>{assignment.reference}</span> 
                    {assignment.status && (
                      <span className={`text-xs ml-4 ${getStatusColor(assignment.status.code)}`}>
                        ({assignment.status.label})
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 