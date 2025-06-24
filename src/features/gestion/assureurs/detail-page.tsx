import { useParams, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAssureursStore } from './store'

export default function AssureurDetailPage() {
  const { id } = useParams({ from: '/gestion/assureurs/$id' })
  const navigate = useNavigate()
  const { selectedAssureur, fetchAssureur, deleteAssureur } = useAssureursStore()

  useEffect(() => {
    fetchAssureur(Number(id))
  }, [id, fetchAssureur])

  if (!selectedAssureur) return <div>Chargement...</div>

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Détail de l'assureur</h2>
      <div className="mb-2"><b>Nom :</b> {selectedAssureur.name}</div>
      <div className="mb-2"><b>Code :</b> {selectedAssureur.code}</div>
      <div className="mb-2"><b>Email :</b> {selectedAssureur.email}</div>
      <div className="mb-2"><b>Téléphone :</b> {selectedAssureur.telephone || '-'}</div>
      <div className="mb-2"><b>Adresse :</b> {selectedAssureur.address || '-'}</div>
      <div className="mb-2"><b>Statut :</b> {selectedAssureur.status.label}</div>
      <div className="mb-2"><b>Type d'entité :</b> {selectedAssureur.entity_type.label}</div>
      <div className="flex gap-2 mt-4">
        <button className="btn btn-primary" onClick={() => navigate({ to: `/gestion/assureurs/${id}/edit` })}>Éditer</button>
        <button className="btn btn-danger" onClick={async () => { if (window.confirm('Supprimer cet assureur ?')) { await deleteAssureur(Number(id)); navigate({ to: '/gestion/assureurs' }) } }}>Supprimer</button>
        <button className="btn" onClick={() => navigate({ to: '/gestion/assureurs' })}>Retour</button>
      </div>
    </div>
  )
} 