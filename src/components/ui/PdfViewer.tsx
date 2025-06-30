import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog'
import { Button } from './button'
import { X } from 'lucide-react'
import React from 'react'

interface PdfViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  title?: string
}

export function PdfViewer({ open, onOpenChange, url, title }: PdfViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-2">
          <DialogTitle>{title || 'Document PDF'}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        <div className="w-full h-[70vh] bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <iframe
            src={url}
            title={title || 'PDF'}
            className="w-full h-full border-0 rounded-b-lg"
            allowFullScreen
          />
        </div>
        <DialogFooter className="px-6 pb-4 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Button>
              Ouvrir dans un nouvel onglet
            </Button>
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 