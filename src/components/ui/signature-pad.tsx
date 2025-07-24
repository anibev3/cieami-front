import React, { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Upload, PenTool, RotateCcw, Download } from 'lucide-react'

interface SignaturePadProps {
  onSignatureChange: (signature: string | File | null) => void
  currentSignature?: string | null
}

export function SignaturePad({ onSignatureChange, currentSignature }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [mode, setMode] = useState<'draw' | 'upload'>('draw')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configuration du canvas
    canvas.width = 400
    canvas.height = 200
    
    // Style du canvas
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Si une signature existe déjà, l'afficher
    if (currentSignature && !uploadedFile) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        setHasSignature(true)
      }
      img.src = currentSignature
    }
  }, [currentSignature, uploadedFile])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setHasSignature(true)
    saveSignature()
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'signature.png', { type: 'image/png' })
        onSignatureChange(file)
      }
    }, 'image/png')
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    setUploadedFile(null)
    onSignatureChange(null)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    processFile(file)
  }

  const processFile = (file: File | null) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image')
      return
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('Le fichier est trop volumineux. Taille maximale : 2MB')
      return
    }

    setUploadedFile(file)
    onSignatureChange(file)
    setHasSignature(true)

    // Afficher l'image sur le canvas
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
    img.src = URL.createObjectURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const downloadSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'signature.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="w-5 h-5" />
          Signature
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode selector */}
        <div className="flex gap-2">
          <Button
            variant={mode === 'draw' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('draw')}
            className="flex items-center gap-2"
          >
            <PenTool className="w-4 h-4" />
            Signer
          </Button>
          <Button
            variant={mode === 'upload' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('upload')}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Uploader
          </Button>
        </div>

        <Separator />

        {mode === 'draw' ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                className="border border-gray-200 rounded cursor-crosshair w-full max-w-md mx-auto"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Effacer
              </Button>
              {hasSignature && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadSignature}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </Button>
              )}
            </div>
          </div>
                 ) : (
           <div className="space-y-4">
             <div 
               className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
               onDragOver={handleDragOver}
               onDrop={handleDrop}
             >
               <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
               <p className="text-sm text-gray-600 mb-2">
                 Glissez-déposez votre signature ici ou cliquez pour sélectionner
               </p>
               <p className="text-xs text-gray-500">
                 Formats acceptés : PNG, JPG, JPEG (max 2MB)
               </p>
               <input
                 type="file"
                 accept="image/*"
                 onChange={handleFileUpload}
                 className="hidden"
                 id="signature-upload"
               />
               <Button
                 variant="outline"
                 onClick={() => document.getElementById('signature-upload')?.click()}
                 className="mt-4"
               >
                 Sélectionner un fichier
               </Button>
             </div>
            
            {uploadedFile && (
              <div className="text-center">
                <p className="text-sm text-green-600">
                  ✓ Fichier sélectionné : {uploadedFile.name}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCanvas}
                  className="mt-2"
                >
                  Supprimer
                </Button>
              </div>
            )}
          </div>
        )}

        {hasSignature && (
          <div className="text-center p-2 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-700">
              ✓ Signature prête à être enregistrée
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 