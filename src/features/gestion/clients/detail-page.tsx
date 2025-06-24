import { useParams, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useClientsStore } from './store'

export default function ClientDetailPage() {
  const { id } = useParams('/gestion/clients/$id')
  const navigate = useNavigate()
  const { selectedClient, fetchClient, deleteClient } = useClientsStore()

  useEffect(() => {
    fetchClient(Number(id))
  }, [id, fetchClient])

  if (!selectedClient) return <div>Chargement...</div>

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Détail du client</h2>
      <div className="mb-2"><b>Nom :</b> {selectedClient.name}</div>
      <div className="mb-2"><b>Email :</b> {selectedClient.email}</div>
      <div className="mb-2"><b>Téléphone 1 :</b> {selectedClient.phone_1 || '-'}</div>
      <div className="mb-2"><b>Téléphone 2 :</b> {selectedClient.phone_2 || '-'}</div>
      <div className="mb-2"><b>Adresse :</b> {selectedClient.address || '-'}</div>
      <div className="flex gap-2 mt-4">
        <button className="btn btn-primary" onClick={() => navigate({ to: `/gestion/clients/${id}/edit` })}>Éditer</button>
        <button className="btn btn-danger" onClick={async () => { if (window.confirm('Supprimer ce client ?')) { await deleteClient(Number(id)); navigate({ to: '/gestion/clients' }) } }}>Supprimer</button>
        <button className="btn" onClick={() => navigate({ to: '/gestion/clients' })}>Retour</button>
      </div>
    </div>
  )
} 