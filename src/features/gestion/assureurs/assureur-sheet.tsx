import { useState, useEffect } from 'react'
import { Assureur } from './types'
import { useAssureursStore } from './store'

interface AssureurSheetProps {
  open: boolean
  mode: 'create' | 'edit'
  assureur?: Assureur | null
  onClose: () => void
}

export function AssureurSheet({ open, mode, assureur, onClose }: AssureurSheetProps) {
  const { createAssureur, updateAssureur, loading } = useAssureursStore()
  const [form, setForm] = useState<Partial<Assureur>>({
    code: '',
    name: '',
    email: '',
    telephone: '',
    address: '',
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mode === 'edit' && assureur) {
      setForm({ ...assureur })
    } else {
      setForm({ code: '', name: '', email: '', telephone: '', address: '' })
    }
    setError(null)
  }, [mode, assureur, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.code) {
      setError('Nom, code et email obligatoires')
      return
    }
    try {
      if (mode === 'create') {
        await createAssureur(form)
      } else if (mode === 'edit' && assureur) {
        await updateAssureur(assureur.id, form)
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
        <h3 className="text-xl font-bold mb-4">{mode === 'create' ? 'Nouvel assureur' : 'Éditer l\'assureur'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Code *</label>
            <input name="code" value={form.code} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1">Nom *</label>
            <input name="name" value={form.name} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1">Email *</label>
            <input name="email" value={form.email} onChange={handleChange} className="input w-full" required type="email" />
          </div>
          <div>
            <label className="block mb-1">Téléphone</label>
            <input name="telephone" value={form.telephone || ''} onChange={handleChange} className="input w-full" />
          </div>
          <div>
            <label className="block mb-1">Adresse</label>
            <input name="address" value={form.address || ''} onChange={handleChange} className="input w-full" />
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