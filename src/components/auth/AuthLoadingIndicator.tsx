import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthLoadingIndicatorProps {
  message?: string
  className?: string
}

/**
 * Indicateur de chargement discret pour la vérification de l'authentification
 * Affiché en haut à droite de l'écran
 */
export function AuthLoadingIndicator({ 
  message = 'Vérification de l\'authentification...',
  className 
}: AuthLoadingIndicatorProps) {
  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50',
        'bg-white/95 dark:bg-gray-900/95',
        'backdrop-blur-sm',
        'border border-gray-200 dark:border-gray-800',
        'rounded-lg shadow-lg',
        'px-4 py-3',
        'flex items-center gap-3',
        'min-w-[240px]',
        'animate-in fade-in slide-in-from-top-2 duration-200',
        className
      )}
    >
      <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400 shrink-0" />
      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
        {message}
      </span>
    </div>
  )
}

