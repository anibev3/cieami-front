import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface DataTableToolbarProps {
  onCreateClick: () => void
}

export function DataTableToolbar({ onCreateClick }: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Placeholder for future search functionality */}
      </div>
      <Button onClick={onCreateClick} size="sm" className="ml-auto h-8">
        <Plus className="mr-2 h-4 w-4" />
        Nouveau prix
      </Button>
    </div>
  )
} 