import React from 'react'
import { cn } from '@/lib/utils'

interface HtmlContentProps {
  content: string
  className?: string
  label?: string
}

export function HtmlContent({ content, className, label }: HtmlContentProps) {
  if (!content || content.trim() === '') {
    return (
      <div className={cn("text-gray-500 italic", className)}>
        {label && <span className="font-medium">{label}: </span>}
        Aucun contenu
      </div>
    )
  }

  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      {label && (
        <div className="text-sm font-medium text-gray-700 mb-2">
          {label}
        </div>
      )}
      <div 
        className="text-sm text-gray-900"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
} 