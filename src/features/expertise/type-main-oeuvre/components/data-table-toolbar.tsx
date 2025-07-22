import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'

interface DataTableToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onCreateClick: () => void
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  onCreateClick,
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* <Input
          placeholder="Rechercher un type..."
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        /> */}
      </div>
      <Button onClick={onCreateClick} size="sm" className="ml-auto h-8">
        <Plus className="mr-2 h-4 w-4" />
        Nouveau type
      </Button>
    </div>
  )
} 