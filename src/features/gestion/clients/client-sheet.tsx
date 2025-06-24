import { useState, useEffect } from 'react'
import { Client } from './types'
import { useClientsStore } from './store'

interface ClientSheetProps {
  open: boolean
  mode: 'create' | 'edit'
  client?: Client | null
  onClose: () => void
}

export function ClientSheet({ open, mode, client, onClose }: ClientSheetProps) {
  const { createClient, updateClient, loading } = useClientsStore()
  const [form, setForm] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone_1: '',
    phone_2: '',
    address: '',
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mode === 'edit' && client) {
      setForm({ ...client })
    } else {
      setForm({ name: '', email: '', phone_1: '', phone_2: '', address: '' })
    }
    setError(null)
  }, [mode, client, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) {
      setError('Nom et email obligatoires')
      return
    }
    try {
      if (mode === 'create') {
        await createClient(form)
      } else if (mode === 'edit' && client) {
        await updateClient(client.id, form)
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
        <h3 className="text-xl font-bold mb-4">{mode === 'create' ? 'Nouveau client' : 'Éditer le client'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nom *</label>
            <input name="name" value={form.name} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1">Email *</label>
            <input name="email" value={form.email} onChange={handleChange} className="input w-full" required type="email" />
          </div>
          <div>
            <label className="block mb-1">Téléphone 1</label>
            <input name="phone_1" value={form.phone_1 || ''} onChange={handleChange} className="input w-full" />
          </div>
          <div>
            <label className="block mb-1">Téléphone 2</label>
            <input name="phone_2" value={form.phone_2 || ''} onChange={handleChange} className="input w-full" />
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