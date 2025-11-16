import { useParams, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useReparateursStore } from './store'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function ReparateurDetailPageContent() {
  const { id } = useParams({ from: '/gestion/reparateurs/$id' })
  const navigate = useNavigate()
  const { selectedReparateur, fetchReparateur, deleteReparateur } = useReparateursStore()

  useEffect(() => {
    fetchReparateur(Number(id))
  }, [id, fetchReparateur])

  if (!selectedReparateur) return <div>Chargement...</div>

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Détail du réparateur</h2>
      <div className="mb-2"><b>Nom :</b> {selectedReparateur.name}</div>
      <div className="mb-2"><b>Code :</b> {selectedReparateur.code}</div>
      <div className="mb-2"><b>Email :</b> {selectedReparateur.email}</div>
      <div className="mb-2"><b>Téléphone :</b> {selectedReparateur.telephone || '-'}</div>
      <div className="mb-2"><b>Adresse :</b> {selectedReparateur.address || '-'}</div>
      <div className="mb-2"><b>Statut :</b> {selectedReparateur.status.label}</div>
      <div className="mb-2"><b>Type d'entité :</b> {selectedReparateur.entity_type.label}</div>
      <div className="flex gap-2 mt-4">
        <button className="btn btn-primary" onClick={() => navigate({ to: `/gestion/reparateurs/${id}/edit` })}>Éditer</button>
        <button className="btn btn-danger" onClick={async () => { if (window.confirm('Supprimer ce réparateur ?')) { await deleteReparateur(Number(id)); navigate({ to: '/gestion/reparateurs' }) } }}>Supprimer</button>
        <button className="btn" onClick={() => navigate({ to: '/gestion/reparateurs' })}>Retour</button>
      </div>
    </div>
  )
}

export default function ReparateurDetailPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_ENTITY}>
      <ReparateurDetailPageContent />
    </ProtectedRoute>
  )
} 