import { useState, useEffect } from 'react'
import { DocumentTransmis } from './types'
import { useDocumentsTransmisStore } from './store'

interface DocumentTransmisSheetProps {
  open: boolean
  mode: 'create' | 'edit'
  document?: DocumentTransmis | null
  onClose: () => void
}

export function DocumentTransmisSheet({ open, mode, document, onClose }: DocumentTransmisSheetProps) {
  const { createDocument, updateDocument, loading } = useDocumentsTransmisStore()
  const [form, setForm] = useState<Partial<DocumentTransmis>>({
    code: '',
    label: '',
    description: '',
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mode === 'edit' && document) {
      setForm({ ...document })
    } else {
      setForm({ code: '', label: '', description: '' })
    }
    setError(null)
  }, [mode, document, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.label || !form.code) {
      setError('Libellé et code obligatoires')
      return
    }
    try {
      if (mode === 'create') {
        await createDocument(form)
      } else if (mode === 'edit' && document) {
        await updateDocument(document.id, form)
      }
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erreur')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-lg p-6 overflow-auto">
        <h3 className="text-xl font-bold mb-4">{mode === 'create' ? 'Nouveau document transmis' : 'Éditer le document transmis'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Code *</label>
            <input name="code" value={form.code} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1">Libellé *</label>
            <input name="label" value={form.label} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea name="description" value={form.description || ''} onChange={handleChange} className="input w-full" />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Enregistrer'}
            </button>
            <button type="button" className="btn" onClick={onClose} disabled={loading}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  )
} 